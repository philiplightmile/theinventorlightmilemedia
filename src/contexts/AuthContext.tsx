import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  access_code_used: string | null;
  first_name: string | null;
  last_name: string | null;
  status: 'started' | 'survey_complete' | 'modules_complete';
  modules_completed: string[];
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, accessCode: string) => Promise<{ error: Error | null }>;
  signInWithMagicLink: (email: string, firstName: string, lastName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as Profile | null;
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id);
            
            // If user signed in via magic link with name metadata, update profile
            if (profileData && !profileData.first_name) {
              const meta = session.user.user_metadata;
              if (meta?.first_name && meta?.last_name) {
                await supabase
                  .from('profiles')
                  .update({ 
                    first_name: meta.first_name, 
                    last_name: meta.last_name 
                  })
                  .eq('user_id', session.user.id);
                profileData.first_name = meta.first_name;
                profileData.last_name = meta.last_name;
              }
            }
            
            setProfile(profileData);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then(profileData => {
          setProfile(profileData);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, accessCode: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) return { error: error as Error };

    if (data.user) {
      const { data: claimed, error: claimError } = await supabase
        .rpc('claim_access_code', { code_to_claim: accessCode.toUpperCase() });

      if (claimError || !claimed) {
        return { error: new Error('Code invalid or already claimed.') };
      }
      
      await supabase.rpc('claim_seat');
      
      await supabase
        .from('profiles')
        .update({ access_code_used: accessCode.toUpperCase() })
        .eq('user_id', data.user.id);
    }

    return { error: null };
  };

  const signInWithMagicLink = async (email: string, firstName: string, lastName: string) => {
    try {
      const { data: fnData, error: fnError } = await supabase.functions.invoke('instant-auth', {
        body: { email, firstName, lastName },
      });

      if (fnError) return { error: new Error(fnError.message || 'Authentication failed') };
      if (fnData?.error) return { error: new Error(fnData.error) };

      // Set the session directly using tokens from the edge function
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: fnData.access_token,
        refresh_token: fnData.refresh_token,
      });

      if (sessionError) return { error: sessionError as Error };

      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Authentication failed') };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signIn,
      signUp,
      signInWithMagicLink,
      signOut,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
