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
  User
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

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

  return (
    <div className="bg-admin-sidebar text-admin-sidebar-foreground w-64 min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-admin-sidebar-hover">
        <h1 className="text-xl font-bold text-white">Spotify Admin</h1>
        <p className="text-sm text-admin-sidebar-foreground/70">Playtime Enhancer</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-11 font-medium",
                "text-admin-sidebar-foreground hover:bg-admin-sidebar-hover hover:text-white",
                isActive && "bg-admin-sidebar-active text-white shadow-sm"
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
      <div className="p-4 border-t border-admin-sidebar-hover">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-admin-sidebar-foreground/70">admin@spotify.com</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 text-admin-sidebar-foreground hover:bg-admin-sidebar-hover hover:text-white"
          onClick={() => navigate("/profile")}
        >
          <User className="h-4 w-4" />
          Profile
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 text-admin-sidebar-foreground hover:bg-admin-sidebar-hover hover:text-white"
          onClick={() => navigate("/login")}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}