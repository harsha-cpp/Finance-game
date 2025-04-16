import { useState } from "react";
import { useLocation } from "wouter";
import { useBusinessContext } from "@/context/BusinessContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BarChart3, LogOut, Menu, User, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header({ company, isLoading }: { company: any; isLoading: boolean }) {
  const [location, navigate] = useLocation();
  const { user, logout } = useBusinessContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm z-10 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-neutral-800">Startup Business Simulator</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/leaderboard")}
            className="hidden md:flex items-center gap-2"
          >
            <Trophy className="h-4 w-4" />
            Leaderboard
          </Button>

          <span className="hidden md:inline text-sm text-neutral-500">
            {isLoading ? (
              <Skeleton className="h-5 w-32" />
            ) : (
              company && `Quarter ${company.currentQuarter}, Year ${company.currentYear}`
            )}
          </span>

          <div className="flex items-center space-x-1">
            {isLoading ? (
              <Skeleton className="h-5 w-24" />
            ) : (
              company && (
                <span className="text-sm font-medium text-neutral-700">
                  {formatCurrency(company.cash)}
                </span>
              )
            )}
          </div>

          <div className="hidden md:block">
            {isLoading ? (
              <Skeleton className="h-9 w-28" />
            ) : (
              <Button
                disabled={!company}
                onClick={() => navigate(`/dashboard/${company?.id}`)}
                className="bg-primary text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Next Quarter
              </Button>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {company?.name || "Loading..."}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="py-4 flex flex-col gap-3">
                  <div className="flex items-center space-x-2 bg-muted p-3 rounded-md">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user?.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {company?.name || "Loading..."}
                      </p>
                    </div>
                  </div>
                  
                  {company && (
                    <div className="flex items-center space-x-2 p-3">
                      <p className="text-sm text-muted-foreground">Cash:</p>
                      <p className="text-sm font-medium">
                        {formatCurrency(company.cash)}
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full mt-2" 
                    disabled={!company}
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(`/dashboard/${company?.id}`);
                    }}
                  >
                    Next Quarter
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-2" 
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/leaderboard");
                    }}
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Leaderboard
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-2" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
