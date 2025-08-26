import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  CreditCard, 
  Bot, 
  BarChart3, 
  FileText,
  LogOut,
  User,
  Shield,
  Music
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users Management",
    href: "/users",
    icon: Users,
  },
  {
    title: "KYC Management",
    href: "/kyc",
    icon: Shield,
  },
  {
    title: "Playlists",
    href: "/playlists",
    icon: Music,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: CreditCard,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Bot Settings",
    href: "/bots/settings",
    icon: Bot,
  },
  {
    title: "Reward Settings",
    href: "/rewards/settings",
    icon: Settings,
  },
  {
    title: "Content Management",
    href: "/cms",
    icon: FileText,
  },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  return (
    <div className="bg-sidebar-background text-sidebar-foreground w-64 min-h-screen flex flex-col border-r border-sidebar-border">
      {/* Logo Section */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-sidebar-primary">Spotify Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">Playtime Enhancer</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-12 font-medium text-sm rounded-md transition-colors",
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
              )}
              onClick={() => navigate(item.href)}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Button>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-sidebar-primary rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {profile?.full_name || 'Admin User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {profile?.email || 'admin@spotify.com'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md mb-1"
          onClick={() => navigate("/profile")}
        >
          <User className="h-4 w-4" />
          <span>Profile</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}