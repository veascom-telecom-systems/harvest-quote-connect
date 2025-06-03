import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const checkAdminRole = async () => {
      if (!user || hasChecked) return;

      console.log('AdminGuard: Checking admin role for user:', user.id);
      
      try {
        // Set timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (isMounted) {
            console.log('AdminGuard: Timeout reached, completing check');
            setCheckComplete(true);
            setHasChecked(true);
          }
        }, 8000);

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        clearTimeout(timeoutId);

        if (!isMounted) return;

        if (error) {
          if (error.code === 'PGRST116') {
            // No profile exists, create admin profile for development
            console.log('AdminGuard: Creating admin profile for development');
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                full_name: user.user_metadata?.full_name || user.email,
                role: 'admin',
                updated_at: new Date().toISOString(),
              });

            if (!insertError) {
              setIsAdmin(true);
              toast({
                title: "Admin Access Granted",
                description: "Admin profile created successfully",
              });
            } else {
              console.error('AdminGuard: Failed to create admin profile:', insertError);
              setIsAdmin(false);
            }
          } else {
            console.error('AdminGuard: Database error:', error);
            setIsAdmin(false);
          }
        } else {
          const userIsAdmin = profile?.role === 'admin';
          console.log('AdminGuard: User admin status:', userIsAdmin);
          setIsAdmin(userIsAdmin);

          if (!userIsAdmin) {
            toast({
              title: "Access Denied",
              description: "Admin privileges required",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error('AdminGuard: Unexpected error:', error);
        setIsAdmin(false);
      } finally {
        if (isMounted) {
          setCheckComplete(true);
          setHasChecked(true);
        }
      }
    };

    if (!authLoading && user && !hasChecked) {
      checkAdminRole();
    } else if (!authLoading && !user) {
      setCheckComplete(true);
      setHasChecked(true);
    }

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [user, authLoading, hasChecked, toast]);

  // Show loading while checking authentication or admin status
  if (authLoading || !checkComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">
            {authLoading ? "Loading authentication..." : "Checking admin privileges..."}
          </p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
