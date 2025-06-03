
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          // Create or update profile
          const { error } = await supabase
            .from('profiles')
            .upsert({
              id: session.user.id,
              full_name: session.user.user_metadata.full_name,
              avatar_url: session.user.user_metadata.avatar_url,
            });

          if (error) {
            console.error('Error creating/updating profile:', error);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${userData.firstName} ${userData.lastName}`,
          company: userData.company,
        },
      },
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }

    toast({
      title: "Success",
      description: "Account created successfully! Please check your email to verify your account.",
    });
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }

    toast({
      title: "Success",
      description: "Welcome back!",
    });
  };

  const signOut = async () => {
    try {
      setLoading(true);

      // Clear local state first
      setUser(null);
      setSession(null);

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      // Clear any cached data
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();

      toast({
        title: "Success",
        description: "You have been signed out successfully",
      });

    } catch (error) {
      console.error('Unexpected sign out error:', error);
      // Even if there's an error, clear local state
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }

    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
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
