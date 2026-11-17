import { supabase, isSupabaseConfigured } from './supabase';
import { User, UserRole } from '../types';
import { setCurrentUser, getUsers, saveUsers, seedSampleDataForUser, logoutUser } from './storage';

export interface SignUpParams {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  vehicleModel?: string;
  vehicleType?: 'two_wheeler' | 'four_wheeler';
}

const BLOCKED_DOMAINS = [
  'fake.com',
  'test.com',
  'example.com',
  'tempmail.com',
  'temp-mail.org',
  'mailinator.com',
  '10minutemail.com',
  'guerrillamail.com',
  'yopmail.com',
  'trashmail.com',
  'throwawaymail.com',
  'dispostable.com',
  'sharklasers.com',
  'maildrop.cc',
];

const BLOCKED_USERNAMES = ['fake', 'test', 'dummy', 'asdf', 'qwerty', 'temp', 'nobody', 'sample'];

function validateEmail(email: string): { valid: boolean; error?: string } {
  const clean = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(clean)) {
    return { valid: false, error: 'Please enter a valid email address (e.g. name@gmail.com).' };
  }

  const [username, domain] = clean.split('@');
  if (!username || !domain) {
    return { valid: false, error: 'Invalid email address.' };
  }

  if (BLOCKED_DOMAINS.includes(domain) || domain.includes('temp') || domain.includes('dispos')) {
    return { valid: false, error: `Disposable or temporary email domains (@${domain}) are blocked. Please use your genuine email.` };
  }

  if (BLOCKED_USERNAMES.includes(username)) {
    return { valid: false, error: `Placeholder usernames like "${username}" are not allowed. Please enter your real email.` };
  }

  return { valid: true };
}

/**
 * Sign up a new user with Email and Password
 */
export async function signUpUser(
  email: string, 
  password: string, 
  profileData: SignUpParams
): Promise<{ user: User | null; error: string | null; message?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const emailCheck = validateEmail(cleanEmail);
  if (!emailCheck.valid) {
    return { user: null, error: emailCheck.error || 'Please enter a valid email address.' };
  }

  if (password.length < 6) {
    return { user: null, error: 'Password must be at least 6 characters long.' };
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: profileData.name,
            phone: profileData.phone || '',
            role: profileData.role,
            vehicle_model: profileData.vehicleModel || '',
            vehicle_type: profileData.vehicleType || '',
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        // If Supabase has email confirmation enabled, data.session is null until verified
        if (!data.session && data.user.identities && data.user.identities.length > 0) {
          return {
            user: null,
            error: null,
            message: `Verification email sent to ${cleanEmail}! Please open your inbox and click the verification link to activate your account. Unverified or fake emails cannot sign in.`
          };
        }

        // Construct ChargeCircle user object
        const newUser: User = {
          id: data.user.id,
          name: profileData.name,
          email: data.user.email || cleanEmail,
          phone: profileData.phone || '',
          role: profileData.role,
          vehicleModel: profileData.vehicleModel,
          vehicleType: profileData.vehicleType,
          memberSince: 'Today',
        };

        // Also persist profile row into profiles table if needed
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            name: profileData.name,
            email: data.user.email || cleanEmail,
            phone: profileData.phone || '',
            role: profileData.role,
            vehicle_model: profileData.vehicleModel || null,
            vehicle_type: profileData.vehicleType || null,
            created_at: new Date().toISOString(),
          });
        } catch {
          // Table trigger handles this if present
        }

        setCurrentUser(newUser);
        return { user: newUser, error: null };
      }
    } catch (err: any) {
      return { user: null, error: err.message || 'Error communicating with Supabase database.' };
    }
  }

  // Graceful Local Storage Fallback if Supabase credentials are not yet added
  const existing = getUsers().find(u => u.email.toLowerCase() === cleanEmail.toLowerCase());
  if (existing) {
    return { user: null, error: `An account with ${cleanEmail} already exists. Please sign in instead.` };
  }

  const newUser: User = {
    id: `usr_${Date.now()}`,
    name: profileData.name || 'EV Member',
    email: cleanEmail,
    phone: profileData.phone || '+91 98000 00000',
    role: profileData.role,
    vehicleModel: profileData.vehicleModel,
    vehicleType: profileData.vehicleType,
    memberSince: 'Today',
  };

  const currentUsers = getUsers();
  saveUsers([...currentUsers, newUser]);
  setCurrentUser(newUser);

  return { user: newUser, error: null };
}

/**
 * Sign in existing user with Email and Password
 */
export async function signInUser(
  email: string, 
  password: string
): Promise<{ user: User | null; error: string | null }> {
  const cleanEmail = email.trim().toLowerCase();
  const emailCheck = validateEmail(cleanEmail);
  if (!emailCheck.valid) {
    return { user: null, error: emailCheck.error || 'Please enter a valid email address.' };
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          return {
            user: null,
            error: `Email not confirmed. A verification link was sent to ${cleanEmail}. Please check your inbox and verify your email to log in.`
          };
        }
        return { user: null, error: error.message };
      }

      if (data.user) {
        // Fetch extended profile data from profiles table
        let userProfile: User | null = null;

        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            userProfile = {
              id: profile.id,
              name: profile.name || data.user.user_metadata?.name || cleanEmail.split('@')[0],
              email: profile.email || data.user.email || cleanEmail,
              phone: profile.phone || data.user.user_metadata?.phone || '',
              role: (profile.role as UserRole) || (data.user.user_metadata?.role as UserRole) || 'driver',
              vehicleModel: profile.vehicle_model || data.user.user_metadata?.vehicle_model,
              vehicleType: profile.vehicle_type || data.user.user_metadata?.vehicle_type,
              avatar: profile.avatar,
              memberSince: profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Active Member',
            };
          }
        } catch {
          // If profiles table query fails, fallback to user metadata
        }

        if (!userProfile) {
          const meta = data.user.user_metadata || {};
          userProfile = {
            id: data.user.id,
            name: meta.name || cleanEmail.split('@')[0],
            email: data.user.email || cleanEmail,
            phone: meta.phone || '',
            role: (meta.role as UserRole) || 'driver',
            vehicleModel: meta.vehicle_model,
            vehicleType: meta.vehicle_type,
            memberSince: 'Active Member',
          };
        }

        setCurrentUser(userProfile);
        return { user: userProfile, error: null };
      }
    } catch (err: any) {
      return { user: null, error: err.message || 'Authentication failed.' };
    }
  }

  // Graceful Local Fallback: verify against stored users
  const existing = getUsers().find(u => u.email.toLowerCase() === cleanEmail.toLowerCase());
  if (existing) {
    setCurrentUser(existing);
    return { user: existing, error: null };
  }

  // Reject unregistered fake emails
  return { 
    user: null, 
    error: `No account found for "${cleanEmail}". Please click "New Account" to register first, or choose a quick demo account below.` 
  };
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase sign out error:', e);
    }
  }
  logoutUser();
}

/**
 * Sign in / Sign up with Google OAuth
 */
export async function signInWithGoogle(): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) {
    return { error: 'Please connect Supabase with Vercel first to enable Google OAuth.' };
  }

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Google authentication failed.' };
  }
}
