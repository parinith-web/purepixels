import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Copy, Key, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../context/AuthContext";
import { useCallback, useState, useEffect } from "react";

const curlExample = `curl -X POST https://api.purepixels.app/v1/remove-background \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@photo.jpg" \
  -o output.png`;

const jsExample = `const formData = new FormData();
formData.append('image', file);

const response = await fetch('https://api.purepixels.app/v1/remove-background', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
  },
  body: formData,
});

const blob = await response.blob();
// Save or display the transparent PNG`;

export default function ApiDocs() {
  const { toast } = useToast();
  const { isAuthenticated, token, apiBaseUrl } = useAuth();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchApiKey = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/user/apikey`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setApiKey(data.apiKey);
      }
    } catch (error) {
      console.error("Failed to fetch API key:", error);
    }
  }, [apiBaseUrl, token]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchApiKey();
    }
  }, [fetchApiKey, isAuthenticated]);

  const handleGenerateKey = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Account required",
        description: "Please sign in or create an account to generate API keys.",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch(`${apiBaseUrl}/user/apikey/generate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setApiKey(data.apiKey);
        toast({ title: "New API Key Generated", description: "Make sure to copy it now!" });
      } else {
        toast({ title: "Failed to generate key", description: "Server returned an error.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Failed to generate key:", error);
      toast({ title: "Connection Error", description: "Failed to connect to the backend server.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container max-w-3xl">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Developer API
            </h1>
            <p className="text-lg text-muted-foreground">
              Integrate background removal into your app with our simple REST API. Available on Pro plans.
            </p>
          </motion.div>

          {/* API Key Section */}
          <motion.div
            className="p-6 rounded-3xl bg-card shadow-card border border-border mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-pixel/10 text-pixel flex items-center justify-center">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">Your API Key</h2>
                <p className="text-sm text-muted-foreground">Keep this secret. Do not expose in client-side code.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border font-mono text-sm text-muted-foreground flex items-center justify-between min-h-[46px]">
                <span>
                  {isAuthenticated
                    ? apiKey
                      ? showKey
                        ? apiKey
                        : `pp_sk_${"•".repeat(24)}`
                      : "No API Key generated yet."
                    : "Log in to see your API Key."}
                </span>
                {isAuthenticated && apiKey && (
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="text-muted-foreground hover:text-foreground transition-colors ml-2"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                {isAuthenticated && apiKey && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-11 px-3.5 border-border"
                    onClick={() => copyCode(apiKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl h-11 border-border flex-1 sm:flex-none whitespace-nowrap"
                  onClick={handleGenerateKey}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : apiKey ? "Regenerate Key" : "Generate Key"}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Endpoint */}
          <motion.div
            className="p-6 rounded-3xl bg-card shadow-card border border-border mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              POST /v1/remove-background
            </h2>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Request</h4>
                <ul className="text-sm text-muted-foreground space-y-1.5 ml-4 list-disc">
                  <li><code className="text-pixel">image</code> — File (PNG, JPG, WEBP, max 10MB)</li>
                  <li><code className="text-pixel">format</code> — Output format (optional, default: png)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Response</h4>
                <ul className="text-sm text-muted-foreground space-y-1.5 ml-4 list-disc">
                  <li><code className="text-pixel">200</code> — Transparent PNG binary</li>
                  <li><code className="text-pixel">403</code> — Rate limit or plan exceeded</li>
                  <li><code className="text-pixel">401</code> — Invalid API key</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* cURL example */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-semibold text-foreground">cURL Example</h3>
              <Button variant="ghost" size="sm" onClick={() => copyCode(curlExample)} className="text-muted-foreground">
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
            </div>
            <pre className="p-5 rounded-2xl bg-navy-deep text-pixel-light text-sm font-mono overflow-x-auto">
              {curlExample}
            </pre>
          </motion.div>

          {/* JavaScript example */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-semibold text-foreground">JavaScript Example</h3>
              <Button variant="ghost" size="sm" onClick={() => copyCode(jsExample)} className="text-muted-foreground">
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
            </div>
            <pre className="p-5 rounded-2xl bg-navy-deep text-pixel-light text-sm font-mono overflow-x-auto">
              {jsExample}
            </pre>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
