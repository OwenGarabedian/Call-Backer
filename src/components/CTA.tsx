import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MagneticButton } from "./ui/magnetic-button";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 px-6 overflow-hidden">
      {/* Background glow */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: "radial-gradient(ellipse at center, hsl(var(--accent)) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Stop Losing Leads.
            <br />
            <span className="text-muted-foreground">Start Today.</span>
          </h2>

          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Join hundreds of contractors who've automated their missed call recovery. 
            Setup takes less than 60 seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticButton variant="primary" size="lg" className="group">
              <span className="flex items-center gap-2">
                Get Early Access
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </MagneticButton>
          </div>

          {/* Trust badge */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-sm text-muted-foreground"
          >
            ✓ No credit card required &nbsp;&nbsp; ✓ Free 14-day trial &nbsp;&nbsp; ✓ Cancel anytime
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
