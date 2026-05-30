import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Upload, Zap } from "lucide-react";

const bubbles = [
  { x: 4, y: 23, size: 8, opacity: 0.12 },
  { x: 9, y: 72, size: 14, opacity: 0.18 },
  { x: 14, y: 14, size: 7, opacity: 0.1 },
  { x: 17, y: 58, size: 20, opacity: 0.18 },
  { x: 22, y: 21, size: 14, opacity: 0.13 },
  { x: 34, y: 11, size: 18, opacity: 0.16 },
  { x: 38, y: 2, size: 22, opacity: 0.2 },
  { x: 47, y: 20, size: 12, opacity: 0.14 },
  { x: 49, y: 86, size: 16, opacity: 0.12 },
  { x: 58, y: 87, size: 17, opacity: 0.18 },
  { x: 61, y: 10, size: 8, opacity: 0.09 },
  { x: 64, y: 72, size: 12, opacity: 0.11 },
  { x: 68, y: 24, size: 18, opacity: 0.15 },
  { x: 69, y: 82, size: 17, opacity: 0.18 },
  { x: 72, y: 88, size: 16, opacity: 0.11 },
  { x: 75, y: 67, size: 11, opacity: 0.18 },
  { x: 76, y: 26, size: 18, opacity: 0.17 },
  { x: 84, y: 28, size: 14, opacity: 0.16 },
  { x: 87, y: 78, size: 18, opacity: 0.18 },
  { x: 90, y: 15, size: 7, opacity: 0.11 },
  { x: 91, y: 1, size: 20, opacity: 0.17 },
  { x: 93, y: 81, size: 13, opacity: 0.14 },
  { x: 97, y: 18, size: 15, opacity: 0.14 },
  { x: 96, y: 56, size: 8, opacity: 0.1 },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
      {bubbles.map((bubble, index) => (
        <motion.div
          key={`${bubble.x}-${bubble.y}`}
          className="absolute rounded-full bg-pixel"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: bubble.size,
            height: bubble.size,
            opacity: bubble.opacity,
            boxShadow: "0 0 24px rgba(126, 195, 255, 0.18)",
          }}
          animate={{
            y: [-8, 10, -8],
            x: [-3, 3, -3],
            scale: [0.9, 1.12, 0.9],
          }}
          transition={{
            duration: 4 + (index % 7) * 0.7,
            delay: (index % 9) * 0.25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="container relative z-10 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pixel/10 border border-pixel/20 text-pixel text-sm font-medium mb-6">
              <Zap className="h-3.5 w-3.5" />
              AI-Powered • Under 5 Seconds
            </div>
          </motion.div>

          <motion.h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Remove Image Backgrounds{" "}
            <span className="text-gradient">in Seconds</span>
          </motion.h1>

          <motion.p
            className="text-lg text-pixel-light/70 mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Upload any image and get a perfect transparent PNG instantly. Powered by high-accuracy AI segmentation.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Button size="lg" className="bg-pixel hover:bg-white text-navy-deep hover:text-pixel font-semibold px-8 h-12 rounded-2xl shadow-glow" asChild>
              <Link to="/dashboard">
                <Upload className="mr-2 h-4 w-4" />
                Upload Image - It's Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-pixel/40 bg-white/95 text-pixel hover:bg-pixel hover:text-navy-deep hover:border-pixel h-12 rounded-2xl" asChild>
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </motion.div>

          <motion.p
            className="text-sm text-pixel-light/40 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            5 free images per day • No credit card required
          </motion.p>
        </div>
      </div>
    </section>
  );
}
