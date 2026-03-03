import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PhoneMissed, MessageSquare, Database, LayoutList,
  Settings, ArrowRight, ArrowLeft, Sparkles, ChevronDown, X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const STEPS = [
  {
    title: "Welcome to Call Backer! 👋",
    description:
      "This demo uses sample data. Navigate freely — we'll guide you through the key features.",
    icon: Sparkles,
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/15",
    cta: null,
    route: null,
  },
  {
    title: "Missed Calls → Instant Texts",
    description:
      "Every missed call gets an automatic text within seconds. Check the call log to see it in action.",
    icon: PhoneMissed,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/15",
    cta: "View Calls →",
    route: "/demo/calls",
  },
  {
    title: "Two-Way AI Messaging",
    description:
      "The AI keeps conversations going — answering questions and nudging toward booking. You can jump in anytime.",
    icon: MessageSquare,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/15",
    cta: "Open Messages →",
    route: "/demo/messages",
  },
  {
    title: "Built-in CRM Database",
    description:
      "Every caller is saved automatically with their name, need, and status. Filter by Leads or Booked.",
    icon: Database,
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/15",
    cta: "Browse Database →",
    route: "/demo/database",
  },
  {
    title: "Pro Marketing Campaigns",
    description:
      "Upgrade to unlock mass broadcasts, Google review generators, and win-back campaigns.",
    icon: LayoutList,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/15",
    cta: "See Control Center →",
    route: "/demo/control-center",
  },
  {
    title: "Ready to connect your number?",
    description:
      "Setup takes under 5 minutes. Start capturing leads from missed calls today.",
    icon: Settings,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/15",
    cta: "Get Started Free →",
    route: "/sign-up",
  },
];

// ─── sessionStorage keys ────────────────────────────────────────────────────
const KEY_VISIBLE   = "cb_tour_visible";
const KEY_STEP      = "cb_tour_step";
const KEY_MINIMIZED = "cb_tour_minimized";

function readSession() {
  return {
    visible:   sessionStorage.getItem(KEY_VISIBLE)   !== "false",  // default true
    step:      parseInt(sessionStorage.getItem(KEY_STEP)   ?? "0", 10),
    minimized: sessionStorage.getItem(KEY_MINIMIZED) === "true",
  };
}

function saveSession(visible: boolean, step: number, minimized: boolean) {
  sessionStorage.setItem(KEY_VISIBLE,   String(visible));
  sessionStorage.setItem(KEY_STEP,      String(step));
  sessionStorage.setItem(KEY_MINIMIZED, String(minimized));
}

export function DemoWalkthrough({ forceOpen }: { forceOpen?: boolean } = {}) {
  const navigate = useNavigate();

  // forceOpen (dashboard) always starts fresh; other pages restore from session
  const init = forceOpen
    ? { visible: true, step: 0, minimized: false }
    : readSession();

  const [visible,   setVisible]   = useState(init.visible);
  const [step,      setStep]      = useState(init.step);
  const [minimized, setMinimized] = useState(init.minimized);

  // If forceOpen, sync the forced values into sessionStorage once on mount
  useEffect(() => {
    if (forceOpen) saveSession(true, 0, false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist state changes for non-forceOpen pages
  useEffect(() => {
    if (!forceOpen) saveSession(visible, step, minimized);
  }, [visible, step, minimized, forceOpen]);

  const dismiss = () => {
    setVisible(false);
    saveSession(false, step, minimized);
  };

  const openTour = () => {
    setStep(0);
    setMinimized(false);
    setVisible(true);
    saveSession(true, 0, false);
  };

  const handleCta = () => {
    const current = STEPS[step];
    if (current.route === "/sign-up") {
      dismiss();
      navigate("/sign-up");
    } else if (current.route) {
      const nextStep = step + 1;
      setStep(nextStep);
      saveSession(true, nextStep, minimized);
      navigate(current.route);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else dismiss();
  };

  const handlePrev = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const toggleMinimized = () => setMinimized((m) => !m);

  const current = STEPS[step] ?? STEPS[0];
  const isLast  = step === STEPS.length - 1;

  return (
    <>
      {/* Trigger button — only shown when panel is closed */}
      {!visible && (
        <button
          onClick={openTour}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Take the Tour
        </button>
      )}

      {/* Floating panel — no backdrop */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="tour-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="fixed bottom-6 right-6 z-50 w-80"
          >
            <div className="bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
              {/* Progress bar */}
              <div className="h-1 bg-white/5">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.35 }}
                />
              </div>

              {/* Header row */}
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  {step + 1} / {STEPS.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleMinimized}
                    className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${minimized ? "rotate-180" : ""}`} />
                  </button>
                  <button
                    onClick={dismiss}
                    className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Collapsible body */}
              <AnimatePresence initial={false}>
                {!minimized && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.18 }}
                        >
                          <div className="flex items-center gap-3 mb-2 mt-1">
                            <div className={`w-9 h-9 rounded-xl ${current.iconBg} flex items-center justify-center flex-shrink-0`}>
                              <current.icon className={`w-5 h-5 ${current.iconColor}`} />
                            </div>
                            <h3 className="text-sm font-bold text-white leading-snug">{current.title}</h3>
                          </div>
                          <p className="text-xs text-white/55 leading-relaxed mb-4">
                            {current.description}
                          </p>
                        </motion.div>
                      </AnimatePresence>

                      {/* Dots */}
                      <div className="flex items-center gap-1 mb-3">
                        {STEPS.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setStep(i)}
                            className={`rounded-full transition-all ${
                              i === step
                                ? "w-4 h-1.5 bg-indigo-400"
                                : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePrev}
                          disabled={step === 0}
                          className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-25 flex items-center justify-center text-white transition-colors flex-shrink-0"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>

                        {current.cta ? (
                          <button
                            onClick={handleCta}
                            className="flex-1 h-8 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                          >
                            {current.cta}
                          </button>
                        ) : (
                          <button
                            onClick={handleNext}
                            className="flex-1 h-8 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                          >
                            Start Tour
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={handleNext}
                          className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors flex-shrink-0"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {!isLast && (
                        <button
                          onClick={dismiss}
                          className="w-full mt-2 text-[10px] text-white/20 hover:text-white/40 transition-colors py-0.5"
                        >
                          Skip tour
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
