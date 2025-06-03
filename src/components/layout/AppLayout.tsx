
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Home,
  Package,
  ShoppingCart,
  FileText,
  User,
  Settings,
  LogOut,
  Shield
} from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppSidebar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);

  const menuItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Products",
      url: "/products",
      icon: Package,
    },
    {
      title: "Cart",
      url: "/cart",
      icon: ShoppingCart,
    },
    {
      title: "RFQ",
      url: "/rfq",
      icon: FileText,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: User,
    },
  ];

  const adminItems = [
    {
      title: "Admin Dashboard",
      url: "/admin",
      icon: Shield,
    },
  ];

  // Check if user is admin
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setAdminCheckComplete(true);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No profile exists, create admin profile for development
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
            } else {
              setIsAdmin(false);
            }
          } else {
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(profile?.role === 'admin');
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } finally {
        setAdminCheckComplete(true);
      }
    };

    checkAdminRole();
  }, [user]);

  const handleSignOut = async () => {
    try {
      console.log('Attempting to sign out...');
      await signOut();
      console.log('Sign out successful, navigating to home...');

      // Force navigation to home page
      navigate("/", { replace: true });

      // Force page reload to clear any cached state
      setTimeout(() => {
        window.location.href = "/";
      }, 100);

    } catch (error) {
      console.error("Error signing out:", error);
      // Even if sign out fails, try to navigate away
      navigate("/", { replace: true });
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-4 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">CC</span>
          </div>
          <span className="font-bold text-lg">Crop Catch</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    isActive={location.pathname === item.url}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && adminCheckComplete && isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.url)}
                      isActive={location.pathname === item.url}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {user ? (
            <>
              <SidebarMenuItem>
                <div className="px-4 py-2 text-sm text-gray-600">
                  {user.email}
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut}>
                  <LogOut />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/auth")}>
                <User />
                <span>Sign In</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { loading } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="border-b bg-white/80 backdrop-blur-md">
            <div className="flex h-16 items-center px-4">
              <SidebarTrigger />
            </div>
          </div>
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
