import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, ShieldAlert, Award, LogOut, CheckCircle, Loader2 } from "lucide-react";

export default function Profile() {
  const { isAuthenticated, user, token, logout, apiBaseUrl, refreshProfile } = useAuth();
  const [historyCount, setHistoryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchHistoryCount = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/images/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setHistoryCount(data.length);
      }
    } catch (error) {
      console.error("Failed to load user count:", error);
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl, token]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    refreshProfile();
    fetchHistoryCount();
  }, [fetchHistoryCount, isAuthenticated, navigate, refreshProfile]);

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out", description: "You have signed out of your session." });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-2xl">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your account details and subscriptions</p>
          </motion.div>

          <motion.div
            className="rounded-3xl bg-card border border-border overflow-hidden shadow-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Header profile badge */}
            <div className="gradient-hero p-8 flex flex-col items-center justify-center text-center text-primary-foreground border-b border-border/10">
              <div className="w-20 h-20 rounded-full bg-pixel/25 text-pixel flex items-center justify-center border-2 border-pixel shadow-glow mb-4 text-3xl font-bold font-display">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold font-display">{user?.name}</h2>
              <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-navy-deep/40 text-pixel text-xs font-semibold border border-pixel/25">
                <Award className="h-3.5 w-3.5" />
                <span>{user?.plan} Account</span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-secondary/50 border border-border">
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Full Name</div>
                    <div className="text-sm font-semibold text-foreground mt-0.5">{user?.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-secondary/50 border border-border">
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Email Address</div>
                    <div className="text-sm font-semibold text-foreground mt-0.5">{user?.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-secondary/50 border border-border">
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Usage & Credit Balance</div>
                    <div className="text-sm font-semibold text-foreground mt-0.5">
                      {user?.plan === "Free" ? (
                        <span>Free Access • {user?.credits} welcome credits remaining</span>
                      ) : (
                        <span>Pro Plan • <span className="text-pixel font-bold">{user?.credits} Credits</span> remaining</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              {/* Usage Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-border bg-card/60 text-center">
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Processed Images</div>
                  <div className="text-2xl font-bold font-display mt-2 text-foreground">
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto text-pixel" /> : historyCount}
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-border bg-card/60 text-center">
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Plan Status</div>
                  <div className="text-2xl font-bold font-display mt-2 text-pixel flex items-center justify-center gap-1.5">
                    <CheckCircle className="h-5 w-5" />
                    Active
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button className="flex-1 rounded-2xl h-12 bg-pixel hover:bg-pixel-dark text-navy-deep font-bold" onClick={() => navigate("/pricing")}>
                  Upgrade Plan / Add Credits
                </Button>
                <Button variant="outline" className="rounded-2xl h-12 border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
