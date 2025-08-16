import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Shield, LogOut } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, isAdmin, signOut, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl">AyurWell</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {isAuthenticated && (
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => isActive ? "text-primary" : "text-muted-foreground hover:text-foreground transition-colors"}
            >
              Dashboard
            </NavLink>
          )}
          
          {isAdmin && (
            <NavLink 
              to="/admin" 
              className={({ isActive }) => isActive ? "text-primary flex items-center gap-1" : "text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"}
            >
              <Shield className="h-4 w-4" />
              Admin
            </NavLink>
          )}
        </nav>
        
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user?.email}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button asChild variant="hero" size="sm">
              <Link to="/auth">Get Started</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
