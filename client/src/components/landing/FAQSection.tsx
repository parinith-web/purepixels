import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How many free images can I process per day?",
    a: "Free users can process up to 10 images per day. The counter resets at midnight IST.",
  },
  {
    q: "What image formats are supported?",
    a: "We support PNG, JPG, and WEBP formats up to 10MB per image.",
  },
  {
    q: "How fast is the background removal?",
    a: "Our AI processes most images in under 5 seconds. Complex images may take slightly longer.",
  },
  {
    q: "Is there a watermark on free plan images?",
    a: "Yes, free plan exports include a small PurePixels watermark. Upgrade to Pro to remove it.",
  },
  {
    q: "Do you offer an API for developers?",
    a: "Yes! Pro users get API access with a personal API key. Check our API docs for integration details.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards, UPI, and net banking via Razorpay. All prices are in INR.",
  },
];

export function FAQSection() {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="container max-w-2xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-2xl px-6 bg-card shadow-card"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <div className="mb-4 h-px w-full bg-border" />
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
