import { motion } from "framer-motion";
import { ShoppingBag, Camera, Palette, Users } from "lucide-react";

const useCases = [
  { icon: ShoppingBag, title: "E-commerce", desc: "Clean product photos for your online store" },
  { icon: Camera, title: "Photography", desc: "Professional edits in seconds, not hours" },
  { icon: Palette, title: "Design", desc: "Create compositions with transparent assets" },
  { icon: Users, title: "Social Media", desc: "Stand out with professional profile images" },
];

export function UseCaseGrid() {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Built for Every Use Case
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            From e-commerce product shots to creative design work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((uc, i) => (
            <motion.div
              key={uc.title}
              className="p-6 rounded-2xl bg-card shadow-card border border-border hover:shadow-elevated transition-all duration-300 group cursor-default"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-10 h-10 rounded-xl bg-pixel/10 text-pixel flex items-center justify-center mb-4 group-hover:bg-pixel/20 transition-colors">
                <uc.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">{uc.title}</h3>
              <p className="text-sm text-muted-foreground">{uc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
