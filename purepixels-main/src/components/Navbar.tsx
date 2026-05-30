import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { Menu, X, LogOut, User as UserIcon, History as HistoryIcon, CreditCard, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  // Dynamic Navigation Items
  const publicNavItems = [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "API", href: "/api-docs" },
  ];

  const privateNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Images", href: "/history", icon: HistoryIcon },
    { label: "Billing", href: "/pricing", icon: CreditCard },
    { label: "Profile", href: "/profile", icon: UserIcon },
  ];

  const activeItems = isAuthenticated ? privateNavItems : publicNavItems;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="relative flex h-16 w-full items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="PurePixels" className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6">
          {activeItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`text-sm font-medium transition-colors ${
                location.pathname === item.href
                  ? "text-pixel font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-full bg-secondary border border-border text-xs font-semibold flex items-center gap-1.5">
                <span className="text-muted-foreground">Credits:</span>
                <span className="text-pixel font-bold">{user?.credits}</span>
              </div>
              <Button variant="ghost" className="rounded-xl flex items-center gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" asChild className="rounded-xl">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="rounded-xl bg-pixel hover:bg-pixel-dark text-navy-deep font-semibold shadow-glow">
                <Link to="/dashboard">Get Started Free</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button className="md:hidden p-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3 shadow-lg">
          {activeItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`block text-sm font-medium py-2 border-b border-border/40 ${
                location.pathname === item.href ? "text-pixel font-bold" : "text-muted-foreground"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 rounded-xl bg-secondary border border-border text-sm font-medium flex justify-between">
                  <span className="text-muted-foreground">Available Credits:</span>
                  <span className="text-pixel font-bold">{user?.credits}</span>
                </div>
                <Button variant="destructive" size="sm" className="rounded-xl w-full flex items-center justify-center gap-1.5" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild className="rounded-xl flex-1">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>Log in</Link>
                </Button>
                <Button size="sm" asChild className="rounded-xl flex-1 bg-pixel hover:bg-pixel-dark text-navy-deep font-semibold">
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}>Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
