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
  Music
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
    <div className="bg-white border-r border-gray-200 text-gray-700 w-64 min-h-screen flex flex-col shadow-sm">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <Music className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Spotify Admin</h1>
            <p className="text-sm text-gray-600">Playtime Enhancer</p>
          </div>
        </div>
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
                "w-full justify-start gap-3 h-11 font-medium transition-all duration-200",
                "text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-r-2 hover:border-r-blue-500",
                isActive && "bg-blue-50 text-blue-700 border-r-2 border-r-blue-500 shadow-sm"
              )}
              onClick={() => navigate(item.href)}
            >
              <item.icon className={cn(
                "h-5 w-5",
                isActive ? "text-blue-600" : "text-gray-500"
              )} />
              {item.title}
            </Button>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3 mb-3 p-3 bg-white rounded-lg border border-gray-200">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@spotify.com</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 text-gray-700 hover:bg-blue-50 hover:text-blue-700 mb-2"
          onClick={() => navigate("/profile")}
        >
          <User className="h-4 w-4" />
          Profile
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 text-gray-700 hover:bg-red-50 hover:text-red-700"
          onClick={() => navigate("/login")}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}