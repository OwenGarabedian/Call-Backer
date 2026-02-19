import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "lg";
  className?: string;
  onClick?: () => void;
}

export const MagneticButton = ({ 
  children, 
  className, 
  variant = "primary", 
  size = "default", 
  onClick 
}: MagneticButtonProps) => {
  const buttonRef = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.2;
    const deltaY = (e.clientY - centerY) * 0.2;
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 transition-opacity duration-300",
    secondary: "glass border border-border text-foreground hover:border-foreground/30 transition-all duration-300",
    ghost: "bg-transparent text-muted-foreground hover:text-foreground transition-colors duration-300",
  };

  const sizeClasses = {
    default: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <motion.div
      ref={buttonRef}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <button
        onClick={onClick}
        className={cn(
          "relative font-display font-semibold tracking-wide uppercase rounded-xl cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
      >
        {children}
      </button>
    </motion.div>
  );
};
