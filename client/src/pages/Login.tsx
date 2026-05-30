import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, apiBaseUrl } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Validation Error", description: "Email and password are required.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        toast({ title: "Welcome back!", description: `Logged in successfully as ${data.user.name}` });
        navigate("/dashboard");
      } else {
        toast({ title: "Login Failed", description: data.message || "Invalid credentials.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Login request failed:", error);
      toast({ title: "Connection Error", description: "Could not connect to the server.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        className="w-full max-w-md p-8 rounded-3xl bg-card shadow-elevated border border-border"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center mb-6">
            <img src={logo} alt="PurePixels" className="h-14 w-auto" />
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your PurePixels account</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 rounded-xl h-11"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 rounded-xl h-11"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button
            className="w-full rounded-2xl h-11 bg-primary hover:bg-navy-light font-semibold text-white flex items-center justify-center gap-2"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-pixel hover:underline font-medium">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
