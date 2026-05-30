import { motion } from "framer-motion";
import { Upload, Wand2, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Drag and drop or click to upload your image. We support PNG, JPG, and WEBP.",
  },
  {
    icon: Wand2,
    title: "AI Removes Background",
    description: "Our AI processes your image in under 5 seconds with high-accuracy segmentation.",
  },
  {
    icon: Download,
    title: "Download PNG",
    description: "Get your transparent PNG instantly. Compare before & after with our slider.",
  },
];

export function HowItWorks() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Three simple steps to remove any background with pixel-perfect accuracy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="relative p-8 rounded-3xl gradient-card shadow-card border border-border text-center group hover:shadow-elevated transition-shadow duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-pixel/10 text-pixel mb-5 group-hover:bg-pixel/20 transition-colors">
                <step.icon className="h-6 w-6" />
              </div>
              <div className="absolute top-6 right-6 text-5xl font-display font-bold text-muted/60">
                {i + 1}
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
