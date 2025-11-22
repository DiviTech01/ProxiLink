import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { List, User, CreditCard, Bell, HelpCircle, FileText, Settings, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="fixed top-4 left-4 z-50 h-11 w-11 sm:h-12 sm:w-12 rounded-full shadow-lg bg-card border-2 border-border hover:shadow-xl transition-shadow text-foreground">
          <List className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-full sm:max-w-xs">
        <SheetHeader>
          <SheetTitle className="text-base sm:text-lg">Menu</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-2 sm:space-y-4">
          <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded text-sm">
            <User className="h-5 w-5 shrink-0" />
            <span>Profile</span>
          </Link>

          <Link to="/vendor/dashboard" className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded text-sm">
            <Settings className="h-5 w-5 shrink-0" />
            <span>Vendor Dashboard</span>
          </Link>

          <Link to="/payments" className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded text-sm">
            <CreditCard className="h-5 w-5 shrink-0" />
            <span>Payment Options</span>
          </Link>

          <Link to="/orders" className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded text-sm">
            <FileText className="h-5 w-5 shrink-0" />
            <span>Past Orders</span>
          </Link>

          <Link to="/notifications" className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded text-sm">
            <Bell className="h-5 w-5 shrink-0" />
            <span>Notifications</span>
          </Link>

          <Link to="/messages" className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded text-sm">
            <MessageSquare className="h-5 w-5 shrink-0" />
            <span>Messages</span>
          </Link>

          <Link to="/about" className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded text-sm">
            <HelpCircle className="h-5 w-5 shrink-0" />
            <span>About</span>
          </Link>

          <Link to="/support" className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded text-sm">
            <Settings className="h-5 w-5 shrink-0" />
            <span>Support</span>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
