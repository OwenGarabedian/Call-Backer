import { motion } from "framer-motion";
import { Phone, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/Pricing" },
];

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3"
    >
      <div className="max-w-6xl mx-auto">
        <div className="glass rounded-2xl px-5 py-3 flex items-center justify-between shadow-lg relative">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group select-none">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"
            >
              <Phone className="w-4 h-4 text-primary" strokeWidth={1.5} />
            </motion.div>
            <span className="font-display text-base font-bold hidden sm:block tracking-tight">
              Call Backer
            </span>
          </Link>

          {/* ── Desktop Nav (absolutely centered) ── */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(({ label, href }) => {
              const active = location.pathname === href;
              return (
                <Link
                  key={href}
                  to={href}
                  className={cn(
                    "relative px-4 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-primary/8 border border-primary/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop Auth buttons ── */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/sign-in"
              className="px-5 py-2 text-sm font-semibold rounded-xl border border-border text-foreground/80 hover:text-foreground hover:border-foreground/30 hover:bg-primary/5 transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-85 transition-opacity duration-200 shadow-sm"
            >
              Sign Up
            </Link>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-2 glass rounded-2xl px-5 py-4 flex flex-col gap-2 shadow-lg md:hidden"
          >
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium rounded-xl transition-colors duration-200",
                  location.pathname === href
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                )}
              >
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border flex flex-col gap-2">
              <Link
                to="/sign-in"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold rounded-xl border border-border text-foreground/80 hover:border-foreground/30 transition-all text-center"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-85 transition-opacity text-center"
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};