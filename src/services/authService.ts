import { supabase, isSupabaseConfigured } from './supabase';
import { User, UserRole } from '../types';
import { setCurrentUser, getUsers, saveUsers, seedSampleDataForUser } from './storage';

export interface SignUpParams {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  vehicleModel?: string;
  vehicleType?: 'two_wheeler' | 'four_wheeler';
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Sign up a new user with Email and Password
 */
export async function signUpUser(
  email: string, 
  password: string, 
  profileData: SignUpParams
): Promise<{ user: User | null; error: string | null }> {
  const cleanEmail = email.trim();
  if (!isValidEmail(cleanEmail)) {
    return { user: null, error: 'Please enter a valid email address (e.g. name@example.com).' };
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
  const cleanEmail = email.trim();
  if (!isValidEmail(cleanEmail)) {
    return { user: null, error: 'Please enter a valid email address.' };
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
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
}
