import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Download, X, ImageIcon, Loader2, ArrowRight, ShieldCheck, AlertCircle, ChevronsLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [afterBackground, setAfterBackground] = useState<"white" | "grid" | "dark">("white");
  
  // Usage tracking states for UI
  const [processedToday, setProcessedToday] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(5);
  const [guestUsage, setGuestUsage] = useState(0);

  const { isAuthenticated, user, token, refreshProfile, apiBaseUrl } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchDashboardStats = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProcessedToday(data.usage.processedToday);
        setDailyLimit(data.usage.dailyLimit === null || data.usage.dailyLimit === Infinity ? 5 : data.usage.dailyLimit);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    }
  }, [apiBaseUrl, token]);

  // Load user data or guest usage from localStorage on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats();
    } else {
      const guestCount = Number(localStorage.getItem("purepixels_guest_usage") || "0");
      setGuestUsage(guestCount);
    }
  }, [fetchDashboardStats, isAuthenticated, user?.credits]);

  const handleFile = useCallback((f: File) => {
    if (!["image/png", "image/jpeg", "image/webp"].includes(f.type)) {
      toast({ title: "Invalid format", description: "Please upload PNG, JPG, or WEBP.", variant: "destructive" });
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max file size is 10MB.", variant: "destructive" });
      return;
    }
    setFile(f);
    setProcessedUrl(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, [handleFile]);

  const processImage = async () => {
    if (!isAuthenticated) {
      // Guest User Flow
      if (guestUsage >= 1) {
        toast({
          title: "Guest limit reached",
          description: "Guests are limited to 1 background removal per day. Create a free account to continue!",
          variant: "destructive",
        });
        return;
      }

      setIsProcessing(true);
      // Simulate guest AI background removal
      await new Promise((r) => setTimeout(r, 2200));
      
      setProcessedUrl(preview);
      const newGuestUsage = guestUsage + 1;
      setGuestUsage(newGuestUsage);
      localStorage.setItem("purepixels_guest_usage", String(newGuestUsage));
      setIsProcessing(false);

      toast({
        title: "Preview ready!",
        description: "Background removed. Create an account to save history or download in HD!",
      });
      return;
    }

    // Authenticated User Flow
    if (user?.plan === "Free" && processedToday >= dailyLimit) {
      toast({
        title: "Daily limit reached",
        description: "Upgrade to Pro to remove backgrounds from unlimited images!",
        variant: "destructive",
      });
      return;
    }

    if (user?.plan === "Pro" && user.credits <= 0) {
      toast({
        title: "Out of credits",
        description: "Please buy more credits in the Billing section to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${apiBaseUrl}/images/process`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setProcessedUrl(data.processedImageUrl);
        await refreshProfile();
        await fetchDashboardStats();
        toast({ title: "Success!", description: "Background removed perfectly!" });
      } else {
        toast({ title: "Processing Failed", description: data.message || "An error occurred.", variant: "destructive" });
      }
    } catch (err) {
      console.error("Process image failed:", err);
      toast({ title: "Connection Error", description: "Could not connect to the processing server.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearImage = () => {
    setFile(null);
    setPreview(null);
    setProcessedUrl(null);
  };

  const transparencyGridStyle = {
    backgroundColor: "#ffffff",
    backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iI2YxZjVmOSIvPjxyZWN0IHg9IjgiIHk9IjgiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmMWY1ZjkiLz48cmVjdCB4PSI4IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmZmZmIi8+PHJlY3QgeT0iOCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg==')",
    backgroundRepeat: "repeat",
    backgroundSize: "16px 16px",
  };


  const afterBackgroundStyle =
    afterBackground === "grid"
      ? transparencyGridStyle
      : afterBackground === "dark"
        ? { backgroundColor: "#111827" }
        : { backgroundColor: "#ffffff" };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                {isAuthenticated ? `Welcome back, ${user?.name}!` : "AI Background Remover"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isAuthenticated 
                  ? `Active Plan: ${user?.plan} • Remaining Credits: ${user?.credits}` 
                  : "Remove backgrounds instantly using our professional segment AI"}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                user?.plan === "Free" ? (
                  <div className="px-4 py-2.5 rounded-2xl bg-secondary border border-border text-right">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Today's Usage</div>
                    <div className="text-sm font-bold text-foreground mt-0.5">
                      <span className="text-pixel">{processedToday}</span> / {dailyLimit} Images
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-2.5 rounded-2xl bg-secondary border border-border text-right">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Credits Available</div>
                    <div className="text-sm font-bold text-pixel mt-0.5">
                      {user?.credits} Credits
                    </div>
                  </div>
                )
              ) : (
                <div className="px-4 py-2.5 rounded-2xl bg-secondary border border-border text-right">
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Guest Free Limit</div>
                  <div className="text-sm font-bold text-foreground mt-0.5">
                    <span className="text-pixel">{guestUsage}</span> / 1 Today
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SaaS Conversion banner */}
          <AnimatePresence>
            {(!isAuthenticated || user?.plan === "Free") && (
              <motion.div
                className="mb-8 p-5 rounded-3xl gradient-hero flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-pixel/20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div>
                  <h3 className="text-primary-foreground font-semibold text-base flex items-center gap-1.5">
                    <ShieldCheck className="h-5 w-5 text-pixel" />
                    Unlock PurePixels Pro Features
                  </h3>
                  <p className="text-pixel-light/80 text-sm mt-1 max-w-xl">
                    Get unlimited daily limits, high-resolution downloads, developer API endpoints, batch processing, and early access to new models!
                  </p>
                </div>
                <Button className="bg-pixel hover:bg-pixel-dark text-navy-deep font-bold rounded-2xl w-full sm:w-auto h-11 px-5 flex items-center gap-1 shadow-glow flex-shrink-0" asChild>
                  <Link to={isAuthenticated ? "/pricing" : "/signup"}>
                    {isAuthenticated ? "Upgrade Plan" : "Create Account"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload area */}
          {!preview ? (
            <motion.div
              className="border-2 border-dashed border-border rounded-3xl p-16 text-center cursor-pointer hover:border-pixel/50 hover:bg-pixel/5 transition-all duration-300 bg-card shadow-card"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <input
                id="file-input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <div className="w-16 h-16 rounded-2xl bg-pixel/10 text-pixel flex items-center justify-center mx-auto mb-4 border border-pixel/20">
                <Upload className="h-7 w-7" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                Drag & drop your image here
              </h3>
              <p className="text-sm text-muted-foreground mb-4">or click to browse • PNG, JPG, WEBP up to 10MB</p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Image preview / comparison */}
              <div className="relative rounded-3xl overflow-hidden bg-card shadow-elevated border border-border">
                <button
                  onClick={clearImage}
                  className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-card/85 backdrop-blur-sm border border-border hover:bg-card transition-colors shadow-sm"
                  disabled={isProcessing}
                >
                  <X className="h-4 w-4 text-foreground" />
                </button>

                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div
                      key="processing"
                      className="flex flex-col items-center justify-center py-28 bg-card/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="relative">
                        <Loader2 className="h-10 w-10 text-pixel animate-spin" />
                        {Array.from({ length: 12 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2.5 h-2.5 rounded-sm bg-pixel/60"
                            style={{ left: "50%", top: "50%" }}
                            animate={{
                              x: [0, (Math.random() - 0.5) * 100],
                              y: [0, (Math.random() - 0.5) * 100],
                              opacity: [1, 0],
                              scale: [1, 0.2],
                            }}
                            transition={{
                              duration: 1.6,
                              repeat: Infinity,
                              delay: i * 0.12,
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-foreground font-medium mt-6">Removing Background...</p>
                      <p className="text-xs text-muted-foreground mt-1">Our AI is mapping image boundaries</p>
                    </motion.div>
                  ) : processedUrl ? (
                    <motion.div
                      key="result"
                      className="relative"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="relative aspect-[4/3] sm:aspect-[1.4] overflow-hidden bg-white">
                        {/* Original Image underneath */}
                        <img
                          src={preview!}
                          alt="Original"
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                        {/* Processed Image on top with clipping and solid white background */}
                        <div
                          className="absolute inset-0 bg-white"
                          style={{
                            clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                          }}
                        >
                          <img
                            src={processedUrl}
                            alt="Processed"
                            className="absolute inset-0 w-full h-full object-contain"
                          />
                        </div>

                        {/* Slider line */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-pixel shadow-glow z-10 cursor-ew-resize"
                          style={{ left: `${sliderPos}%` }}
                        />
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={sliderPos}
                          onChange={(e) => setSliderPos(Number(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                        />
                        {/* Labels */}
                        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-card/85 backdrop-blur-sm text-xs font-semibold text-foreground z-10 border border-border shadow-sm">
                          After
                        </div>
                        <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-card/85 backdrop-blur-sm text-xs font-semibold text-foreground z-10 border border-border shadow-sm">
                          Before
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="aspect-[4/3] sm:aspect-[1.4] flex items-center justify-center bg-muted/20">
                        <img
                          src={preview}
                          alt="Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                {!processedUrl && !isProcessing && (
                  <Button
                    onClick={processImage}
                    size="lg"
                    className="bg-pixel hover:bg-pixel-dark text-navy-deep font-bold rounded-2xl px-10 h-12 shadow-glow w-full sm:w-auto"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Remove Background
                  </Button>
                )}

                {processedUrl && (
                  <>
                    {isAuthenticated ? (
                      <Button
                        size="lg"
                        className="bg-pixel hover:bg-pixel-dark text-navy-deep font-bold rounded-2xl px-10 h-12 shadow-glow w-full sm:w-auto"
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = processedUrl;
                          a.download = `purepixels_${Date.now()}.png`;
                          a.click();
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download transparent PNG
                      </Button>
                    ) : (
                      <div className="w-full text-center space-y-4">
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-2xl flex items-center gap-2 max-w-lg mx-auto text-sm text-left">
                          <AlertCircle className="h-5 w-5 flex-shrink-0" />
                          <span>Guest users can preview transparent images but cannot download. Please register to unlock downloads and save history!</span>
                        </div>
                        <div className="flex gap-3 justify-center">
                          <Button size="lg" className="bg-pixel hover:bg-pixel-dark text-navy-deep font-bold rounded-2xl px-8 h-12" onClick={() => navigate("/signup")}>
                            Register to Download
                          </Button>
                          <Button size="lg" variant="outline" className="rounded-2xl px-8 h-12" onClick={clearImage}>
                            Try Another
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
