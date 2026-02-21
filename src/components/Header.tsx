import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { MagneticButton } from "./ui/magnetic-button";

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      // Reduced padding on mobile, kept it standard on md+
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 md:py-4" 
    >
      <div className="max-w-6xl mx-auto">
        {/* Made it a tighter pill on mobile with less vertical padding */}
        <div className="glass rounded-full md:rounded-2xl px-4 md:px-6 py-2 md:py-3 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full md:rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Phone className="w-4 h-4 text-primary" strokeWidth={1.5} />
            </div>
            <span className="font-display text-lg font-semibold hidden sm:block">Call Backer</span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-m text-muted-foreground hover:text-foreground transition-colors">
              Home Page
            </a>
            <a href="/Pricing" className="text-m text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>

          {/* CTA */}
          <MagneticButton variant="primary" size="default">
            Get Access
          </MagneticButton>
        </div>
      </div>
    </motion.header>
  );
};