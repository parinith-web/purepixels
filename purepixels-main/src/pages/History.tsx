import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Trash2, Calendar, FileImage, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ImageRecord {
  _id: string;
  originalImageUrl: string;
  processedImageUrl: string;
  createdDate: string;
}

export default function History() {
  const { isAuthenticated, token, apiBaseUrl } = useAuth();
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/images/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else {
        toast({ title: "Failed to load", description: "Could not fetch your processed images history.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Fetch history error:", error);
      toast({ title: "Connection Error", description: "Could not connect to the backend server.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl, toast, token]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchHistory();
  }, [fetchHistory, isAuthenticated, navigate]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`${apiBaseUrl}/images/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setImages(images.filter((img) => img._id !== id));
        toast({ title: "Deleted", description: "Image record removed from history." });
      } else {
        toast({ title: "Failed to delete", description: "Could not remove the image.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Delete image error:", error);
      toast({ title: "Connection Error", description: "Could not connect to the server.", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-5xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">My Processed Images</h1>
              <p className="text-sm text-muted-foreground mt-1">Review, download, and manage your background removal history</p>
            </div>
            <Button onClick={fetchHistory} variant="outline" size="sm" className="rounded-xl border-border" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="h-10 w-10 text-pixel animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Loading your image history gallery...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl bg-card/40">
              <div className="w-16 h-16 rounded-2xl bg-secondary text-muted-foreground flex items-center justify-center mx-auto mb-4 border border-border">
                <FileImage className="h-7 w-7" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">No images found</h3>
              <p className="text-sm text-muted-foreground mb-6">You haven't removed background from any image yet.</p>
              <Button asChild className="rounded-xl bg-pixel hover:bg-pixel-dark text-navy-deep font-semibold">
                <a href="/dashboard">Process Your First Image</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <AnimatePresence>
                {images.map((img) => (
                  <motion.div
                    key={img._id}
                    className="group relative rounded-3xl bg-card border border-border overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Transparent checkerboard preview */}
                    <div className="aspect-video w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2YzZjMiLz48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2YzZjNmMyIvPjwvc3ZnPg==')] bg-repeat bg-[size:15px_15px] border-b border-border flex items-center justify-center overflow-hidden relative">
                      <img
                        src={img.processedImageUrl}
                        alt="Processed Output"
                        className="max-h-[90%] max-w-[95%] object-contain transform group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(img.createdDate)}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 rounded-xl bg-secondary hover:bg-border text-foreground font-medium h-9 text-xs border border-border"
                          onClick={() => {
                            const a = document.createElement("a");
                            a.href = img.processedImageUrl;
                            a.download = `purepixels_${img._id}.png`;
                            a.click();
                          }}
                        >
                          <Download className="mr-1 h-3.5 w-3.5 text-pixel" />
                          Download PNG
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-xl h-9 w-9 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors border border-border"
                          onClick={() => handleDelete(img._id)}
                          disabled={deletingId === img._id}
                        >
                          {deletingId === img._id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
