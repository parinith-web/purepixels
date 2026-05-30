import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Loader2, ShieldCheck, HelpCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "forever",
    features: [
      "5 images per day",
      "720p max resolution",
      "Standard segment speed",
      "Basic file formats",
      "Community support",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    id: "monthly",
    name: "Pro Monthly",
    price: "₹299",
    period: "/month",
    features: [
      "100 Credits immediately",
      "Full HD export",
      "No watermark",
      "Developer API access",
      "Priority segment processing",
      "Email support",
    ],
    cta: "Subscribe Now",
    highlight: true,
  },
  {
    id: "yearly",
    name: "Pro Yearly",
    price: "₹2,999",
    period: "/year",
    features: [
      "1,200 Credits immediately",
      "Full HD export",
      "No watermark",
      "Developer API access",
      "Priority support",
      "Best Value — Save ₹589/year",
    ],
    cta: "Subscribe Best Value",
    highlight: false,
  },
];

type PlanId = "free" | "monthly" | "yearly";

type PaymentOrder = {
  id: string;
  amount: number;
  currency: string;
  key?: string;
  mock?: boolean;
  planId?: PlanId;
};

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => Promise<void>;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

const getStoredUserPrefill = () => {
  const storedUser = localStorage.getItem("purepixels_user");
  if (!storedUser) {
    return { name: "", email: "" };
  }

  try {
    const parsedUser = JSON.parse(storedUser) as { name?: string; email?: string };
    return {
      name: parsedUser.name || "",
      email: parsedUser.email || "",
    };
  } catch {
    return { name: "", email: "" };
  }
};

export default function Pricing() {
  const { isAuthenticated, token, refreshProfile, apiBaseUrl } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  
  // States for development simulated payment gateway
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxOrder, setSandboxOrder] = useState<PaymentOrder | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  // Load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscription = async (planId: PlanId) => {
    if (planId === "free") {
      navigate("/dashboard");
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Account required",
        description: "Please sign in or create an account to purchase a plan.",
      });
      navigate("/login");
      return;
    }

    setLoadingPlan(planId);
    let isMockOrder = false;
    try {
      const response = await fetch(`${apiBaseUrl}/payments/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId }),
      });

      const orderData = (await response.json()) as PaymentOrder & { message?: string };

      if (!response.ok) {
        toast({ title: "Order creation failed", description: orderData.message || "Could not start checkout.", variant: "destructive" });
        setLoadingPlan(null);
        return;
      }

      // If backend returns a mock order (keys missing)
      if (orderData.mock) {
        isMockOrder = true;
        setSandboxOrder({ ...orderData, planId });
        setShowSandbox(true);
        setLoadingPlan(null);
        return;
      }

      // Real Razorpay Checkout flow
      const res = await loadRazorpayScript();
      if (!res) {
        toast({ title: "Loading failed", description: "Could not load Razorpay SDK. Check your internet connection.", variant: "destructive" });
        setLoadingPlan(null);
        return;
      }

      if (!orderData.key || !window.Razorpay) {
        toast({ title: "Checkout unavailable", description: "Razorpay checkout could not initialize.", variant: "destructive" });
        setLoadingPlan(null);
        return;
      }

      const options: RazorpayOptions = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "PurePixels AI",
        description: `Upgrade to Pro - ${planId === "monthly" ? "Monthly" : "Yearly"} subscription`,
        order_id: orderData.id,
        handler: async function (rzpResponse) {
          try {
            setLoadingPlan(planId);
            const verifyResponse = await fetch(`${apiBaseUrl}/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: rzpResponse.razorpay_order_id,
                razorpay_payment_id: rzpResponse.razorpay_payment_id,
                razorpay_signature: rzpResponse.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              await refreshProfile();
              toast({
                title: "Payment Successful!",
                description: "Your account is now Pro. Credits successfully credited to your balance!",
              });
              navigate("/dashboard");
            } else {
              toast({ title: "Verification Failed", description: verifyData.message || "Payment verification failed.", variant: "destructive" });
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast({ title: "Connection Error", description: "Verification failed due to connectivity problems.", variant: "destructive" });
          } finally {
            setLoadingPlan(null);
          }
        },
        prefill: getStoredUserPrefill(),
        theme: {
          color: "#9b5de5", // match purepixels theme color
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Subscription initiate failed:", err);
      toast({ title: "Purchase Error", description: "Could not initiate payment order.", variant: "destructive" });
    } finally {
      if (!isMockOrder) {
        setLoadingPlan(null);
      }
    }
  };

  const handleSimulatedPayment = async (success: boolean) => {
    setShowSandbox(false);
    if (!success) {
      toast({ title: "Payment Cancelled", description: "You cancelled the simulated checkout transaction.", variant: "destructive" });
      return;
    }

    if (!sandboxOrder?.planId || !sandboxOrder.id) {
      toast({ title: "Checkout Error", description: "Missing simulated order details.", variant: "destructive" });
      return;
    }

    setLoadingPlan(sandboxOrder.planId);
    try {
      const response = await fetch(`${apiBaseUrl}/payments/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          razorpay_order_id: sandboxOrder.id,
          mock: true,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await refreshProfile();
        toast({
          title: "Sandbox Success!",
          description: `Simulated checkout completed successfully. Added credits to your account!`,
        });
        navigate("/dashboard");
      } else {
        toast({ title: "Sandbox Fail", description: data.message || "Simulation verification failed.", variant: "destructive" });
      }
    } catch (err) {
      console.error("Simulated verification failed:", err);
      toast({ title: "Error", description: "Checkout simulation error.", variant: "destructive" });
    } finally {
      setLoadingPlan(null);
      setSandboxOrder(null);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container max-w-5xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Start free, upgrade anytime. All prices in INR with UPI support.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className={`relative p-8 rounded-3xl border flex flex-col justify-between h-[520px] ${
                  plan.highlight
                    ? "border-pixel shadow-glow bg-card"
                    : "border-border shadow-card bg-card"
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-pixel text-navy-deep text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>
                  <div className="mt-4 mb-6">
                    <span className="font-display text-5xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  <div className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-pixel flex-shrink-0 mt-0.5" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className={`w-full rounded-2xl h-12 flex items-center justify-center ${
                    plan.highlight
                      ? "bg-pixel hover:bg-pixel-dark text-navy-deep font-bold"
                      : "border-border hover:bg-secondary"
                  }`}
                  variant={plan.highlight ? "default" : "outline"}
                  onClick={() => handleSubscription(plan.id)}
                  disabled={loadingPlan !== null}
                >
                  {loadingPlan === plan.id ? (
                    <Loader2 className="h-5 w-5 animate-spin text-navy-deep" />
                  ) : (
                    plan.cta
                  )}
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground flex items-center justify-center gap-1.5 max-w-md mx-auto">
            <ShieldCheck className="h-5 w-5 text-pixel" />
            <span>Payments processed securely via Razorpay. UPI, NetBanking, and credit/debit cards accepted.</span>
          </div>
        </div>
      </div>

      {/* GORGEOUS DEVELOPER PAYMENTS SIMULATOR GATEWAY */}
      <AnimatePresence>
        {showSandbox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              className="w-full max-w-md p-6 rounded-3xl bg-card border border-pixel shadow-glow relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-pixel" />
              
              <div className="flex items-center gap-2 mb-4 text-pixel font-bold font-display text-lg">
                <HelpCircle className="h-6 w-6" />
                <span>PurePixels Payment Simulator</span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Developer Mode: Razorpay API keys are not supplied. You are using the built-in checkout sandbox simulator.
              </p>

              <div className="p-4 rounded-2xl bg-secondary/60 border border-border mb-6 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase">
                  <span>Merchant</span>
                  <span>PurePixels AI</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase">
                  <span>Transaction ID</span>
                  <span className="font-mono text-foreground">{sandboxOrder?.id}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase">
                  <span>Amount Payable</span>
                  <span className="font-bold text-foreground">₹{sandboxOrder?.amount / 100}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase">
                  <span>Credits Added</span>
                  <span className="font-bold text-pixel">+{sandboxOrder?.planId === "monthly" ? "100" : "1200"} Credits</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 rounded-2xl h-11 bg-pixel hover:bg-pixel-dark text-navy-deep font-bold" onClick={() => handleSimulatedPayment(true)}>
                  Simulate Success
                </Button>
                <Button variant="outline" className="flex-1 rounded-2xl h-11 border-border text-muted-foreground" onClick={() => handleSimulatedPayment(false)}>
                  Cancel Check
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
