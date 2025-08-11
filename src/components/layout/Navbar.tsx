import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl">AyurWell</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-primary" : "text-muted-foreground hover:text-foreground transition-colors"}>Dashboard</NavLink>
          <NavLink to="/admin" className={({ isActive }) => isActive ? "text-primary" : "text-muted-foreground hover:text-foreground transition-colors"}>Admin</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="hero" size="sm">
            <Link to="/dashboard">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
