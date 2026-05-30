import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    features: ["10 images per day", "720p export", "Watermark on output", "Basic support"],
    cta: "Get Started",
    href: "/dashboard",
    highlight: false,
  },
  {
    name: "Pro Monthly",
    price: "₹299",
    period: "/month",
    features: ["Unlimited HD export", "No watermark", "Batch upload (20 images)", "API access", "Priority processing"],
    cta: "Upgrade to Pro",
    href: "/pricing",
    highlight: true,
  },
  {
    name: "Pro Yearly",
    price: "₹2,999",
    period: "/year",
    features: ["Everything in Pro", "Save ₹589/year", "Priority support", "Early access features"],
    cta: "Best Value",
    href: "/pricing",
    highlight: false,
  },
];

export function PricingPreview() {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Start free, upgrade when you need more power.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative p-8 rounded-3xl border ${
                plan.highlight
                  ? "border-pixel shadow-glow bg-card"
                  : "border-border shadow-card bg-card"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-pixel text-navy-deep text-xs font-semibold">
                  Most Popular
                </div>
              )}
              <h3 className="font-display text-lg font-semibold text-foreground">{plan.name}</h3>
              <div className="mt-4 mb-6">
                <span className="font-display text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
              </div>
              <div className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-pixel flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <Button
                className={`w-full rounded-2xl ${
                  plan.highlight
                    ? "bg-pixel hover:bg-pixel-dark text-navy-deep font-semibold"
                    : ""
                }`}
                variant={plan.highlight ? "default" : "outline"}
                asChild
              >
                <Link to={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
