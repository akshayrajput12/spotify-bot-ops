import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  User, 
  FileText, 
  Trophy, 
  History, 
  Settings,
  Shield,
  Menu,
  LogOut,
  X,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { KYCVerification } from "@/components/dashboard/KYCVerification";
import { Rewards } from "@/components/dashboard/Rewards";
import { HistoryComponent } from "@/components/dashboard/HistoryComponent";
import { Profile } from "@/components/dashboard/Profile";
import { Settings as SettingsComponent } from "@/components/dashboard/Settings";

interface KYCDocument {
  id: string;
  document_type: string;
  file_name: string;
  status: string;
  submitted_at: string;
  rejection_reason?: string;
}

export default function UserDashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [kycStats, setKycStats] = useState({ totalPoints: 0, totalPlaytime: "0h 0m" });

  // Fetch user data and KYC documents
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchKycDocuments();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user rewards data
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('user_rewards')
        .select('total_points, total_listening_time')
        .eq('user_id', user?.id)
        .single();

      if (rewardsError) throw rewardsError;

      // Calculate playtime in hours and minutes
      const totalSeconds = rewardsData?.total_listening_time || 0;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const playtime = `${hours}h ${minutes}m`;

      setKycStats({
        totalPoints: rewardsData?.total_points || 0,
        totalPlaytime: playtime
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKycDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('user_id', user?.id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setKycDocuments(data || []);
    } catch (error) {
      console.error("Error fetching KYC documents:", error);
      toast({
        title: "Error",
        description: "Failed to fetch KYC documents",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "kyc", label: "KYC Verification", icon: Shield },
    { id: "rewards", label: "Rewards", icon: Trophy },
    { id: "history", label: "History", icon: History },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-sidebar-primary">Spotify Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">User Panel</p>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`
                  w-full justify-start gap-3 h-12 font-medium text-sm rounded-md transition-colors
                  text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
                  ${isActive && "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"}
                `}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profile?.full_name || user?.email}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 h-10 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-foreground hover:bg-muted"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold capitalize">
              {activeTab === "dashboard" ? "User Dashboard" : activeTab}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{profile?.full_name || user?.email}</p>
              <p className="text-xs text-muted-foreground">User</p>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-background to-card">
          {activeTab === "dashboard" && (
            <DashboardHome 
              kycStats={kycStats} 
              kycDocuments={kycDocuments} 
              onNavigateToTab={setActiveTab} 
            />
          )}
          
          {activeTab === "kyc" && (
            <KYCVerification 
              kycDocuments={kycDocuments} 
              fetchKycDocuments={fetchKycDocuments} 
              user={user} 
            />
          )}
          
          {activeTab === "rewards" && (
            <Rewards kycStats={kycStats} />
          )}
          
          {activeTab === "history" && (
            <HistoryComponent />
          )}
          
          {activeTab === "profile" && (
            <Profile profile={profile} user={user} />
          )}
          
          {activeTab === "settings" && (
            <SettingsComponent />
          )}
        </main>
      </div>
    </div>
  );
}