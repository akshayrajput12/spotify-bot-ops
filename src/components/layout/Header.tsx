import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Settings } from "lucide-react";

export function Header() {
  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users, transactions..."
            className="pl-10 bg-muted/50 border-0 rounded-full h-10 focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-accent">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-xs rounded-full">
            3
          </Badge>
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}