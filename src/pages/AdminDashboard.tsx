import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Briefcase, Activity, LogOut } from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  type UserProfile = { id?: string; full_name?: string; phone?: string; created_at?: string };
  type VendorProfile = { id?: string; business_name?: string; category?: string; verification_status?: boolean; created_at?: string };

  const [stats, setStats] = useState({ users: 0, vendors: 0, services: 0, events: 0 });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const checkAdminAccess = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const isAdmin = roles?.some(r => r.role === "admin");
    if (!isAdmin) {
      toast.error("Access denied");
      navigate("/dashboard");
    }
  }, [navigate]);

  const fetchStats = useCallback(async () => {
    const [usersCount, vendorsCount, servicesCount, eventsCount] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("vendor_profiles").select("*", { count: "exact", head: true }),
      supabase.from("services").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true })
    ]);

    setStats({
      users: usersCount.count || 0,
      vendors: vendorsCount.count || 0,
      services: servicesCount.count || 0,
      events: eventsCount.count || 0
    });
  }, []);

  const fetchUsers = useCallback(async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    setUsers(data || []);
  }, []);

  const fetchVendors = useCallback(async () => {
    const { data } = await supabase
      .from("vendor_profiles")
      .select("*, profiles(*)")
      .order("created_at", { ascending: false })
      .limit(10);
    setVendors(data || []);
  }, []);

  useEffect(() => {
    const initialize = async () => {
      await checkAdminAccess();
      await Promise.all([fetchStats(), fetchUsers(), fetchVendors()]);
      setLoading(false);
    };
    initialize();
  }, [checkAdminAccess, fetchStats, fetchUsers, fetchVendors]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm sm:text-base">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="bg-gradient-hero text-white p-3 sm:p-4 sticky top-0 z-10 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Activity className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
            <h1 className="text-lg sm:text-2xl font-bold truncate">Admin Dashboard</h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout} 
            className="text-white hover:bg-white/20 min-h-[44px] text-xs sm:text-sm"
            size="sm"
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-3 sm:p-4 pb-2">
              <CardDescription className="text-xs sm:text-sm">Total Users</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">{stats.users}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-3 sm:p-4 pb-2">
              <CardDescription className="text-xs sm:text-sm">Vendors</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">{stats.vendors}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-3 sm:p-4 pb-2">
              <CardDescription className="text-xs sm:text-sm">Services</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">{stats.services}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-3 sm:p-4 pb-2">
              <CardDescription className="text-xs sm:text-sm">Events</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl">{stats.events}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="users" className="min-h-[44px] text-sm sm:text-base">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Users</span>
              <span className="sm:hidden">Users</span>
            </TabsTrigger>
            <TabsTrigger value="vendors" className="min-h-[44px] text-sm sm:text-base">
              <Briefcase className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Vendors</span>
              <span className="sm:hidden">Vendors</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
            <ScrollArea className="h-[calc(100vh-400px)] sm:h-auto">
              <div className="space-y-3 sm:space-y-4">
                {users.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 sm:py-12 text-center">
                      <Users className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-50" />
                      <p className="text-sm sm:text-base text-muted-foreground">No users found</p>
                    </CardContent>
                  </Card>
                ) : (
                  users.map((user) => (
                    <Card key={user.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base sm:text-lg truncate">{user.full_name || 'Unnamed User'}</CardTitle>
                            <CardDescription className="text-xs sm:text-sm truncate">{user.phone || 'No phone'}</CardDescription>
                          </div>
                          {user.created_at && (
                            <Badge variant="secondary" className="text-xs whitespace-nowrap">
                              {new Date(user.created_at).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="vendors" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
            <ScrollArea className="h-[calc(100vh-400px)] sm:h-auto">
              <div className="space-y-3 sm:space-y-4">
                {vendors.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 sm:py-12 text-center">
                      <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-50" />
                      <p className="text-sm sm:text-base text-muted-foreground">No vendors found</p>
                    </CardContent>
                  </Card>
                ) : (
                  vendors.map((vendor) => (
                    <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="p-3 sm:p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base sm:text-lg truncate">{vendor.business_name || 'Unnamed Business'}</CardTitle>
                            <CardDescription className="text-xs sm:text-sm truncate">{vendor.category || 'Uncategorized'}</CardDescription>
                          </div>
                          <Badge variant={vendor.verification_status ? "default" : "secondary"} className="text-xs whitespace-nowrap">
                            {vendor.verification_status ? "Verified" : "Pending"}
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
