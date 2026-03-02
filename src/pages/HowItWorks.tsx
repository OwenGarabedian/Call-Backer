import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import {
  PhoneOff,
  MessageSquare,
  UserCheck,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Zap,
  Clock,
  Shield,
  Star,
} from "lucide-react";

// ── Shared helpers ──────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: "easeOut" as const, delay },
});

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:bg-white/95 transition-all duration-500 ${className}`}
  >
    {children}
  </div>
);

// ── Step data ───────────────────────────────────────────────────────────────
const STEPS = [
  {
    number: "01",
    icon: PhoneOff,
    label: "Missed Call Detected",
    color: "text-violet-500",
    bg: "bg-violet-50",
    border: "border-violet-100",
    description:
      "The moment a call goes unanswered — whether you're on another job, on the roof, or just busy — Call Backer instantly detects it.",
    detail:
      "Works 24 / 7, including nights and weekends. Zero setup after onboarding.",
  },
  {
    number: "02",
    icon: MessageSquare,
    label: "Instant AI Text Sent",
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    description:
      "Within seconds, your lead receives a personalized text from your business number. The message is warm, professional, and on-brand.",
    detail:
      "Our AI is trained on your services and business details so every reply sounds like you wrote it.",
  },
  {
    number: "03",
    icon: UserCheck,
    label: "Lead Qualified",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    description:
      "Call Backer continues the conversation, asking the right questions to understand the job scope, location, and urgency — all by text.",
    detail:
      "Hot leads are flagged and moved to the top of your dashboard so you always follow up first.",
  },
  {
    number: "04",
    icon: Calendar,
    label: "Job Booked",
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-100",
    description:
      "Once qualified, the lead is ready for a callback or estimate. You step in only when the prospect is warm and ready to buy.",
    detail:
      "Less time chasing, more time closing. Every contacted lead is logged in your dashboard.",
  },
];

// ── Why It Matters ──────────────────────────────────────────────────────────
const BENEFITS = [
  {
    icon: Zap,
    title: "2.5-Second Response",
    body: "Speed wins jobs. Leads who get an instant reply are 5× more likely to convert than those who wait.",
  },
  {
    icon: Clock,
    title: "Always On",
    body: "Nights, weekends, holidays — your business never misses another opportunity, even when you're off the clock.",
  },
  {
    icon: Shield,
    title: "Your Brand, Your Voice",
    body: "Every message uses your business name and is trained on your services. Customers never know it's automated.",
  },
  {
    icon: Star,
    title: "Tracks Every Lead",
    body: "A clean dashboard shows every lead, their status, and the full conversation history. No spreadsheets needed.",
  },
];

// ── Page ────────────────────────────────────────────────────────────────────
const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <Header />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-20 px-4 overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-[#E0CCF7] to-transparent opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-[#D4E4F7] to-transparent opacity-30 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp(0)}>
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-[#111] mb-6 leading-[1.1]">
              Missed calls become{" "}
              <span className="italic font-serif text-gray-400">booked jobs.</span>
            </h1>

            <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed font-light">
              Call Backer runs a quiet, automatic system in the background of your
              business. Here's exactly what happens every time you miss a call.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="relative px-4 pb-24 mt-10 max-w-5xl mx-auto">
        <div className="flex flex-col gap-6">
          {STEPS.map((step, i) => (
            <motion.div key={step.number} {...fadeUp(i * 0.08)}>
              <Card>
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Number + icon */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <span className="text-[11px] font-mono font-bold tracking-widest text-gray-300">
                      {step.number}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${step.bg} border ${step.border}`}
                    >
                      <step.icon className={`w-5 h-5 ${step.color}`} strokeWidth={1.75} />
                    </div>
                    {/* connector line */}
                    {i < STEPS.length - 1 && (
                      <div className="hidden sm:flex flex-col items-center">
                        <div className="w-px h-8 bg-gradient-to-b from-gray-200 to-transparent mt-2" />
                        <ArrowRight className="w-3 h-3 text-gray-200 rotate-90 -mt-1" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <h3 className="text-xl font-medium text-gray-900 tracking-tight mb-3">
                      {step.label}
                    </h3>
                    <p className="text-gray-500 text-base leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <div className="flex items-start gap-2 bg-gray-50/80 border border-gray-100 rounded-2xl px-4 py-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-500">{step.detail}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Why It Matters ── */}
      <section className="px-4 pb-24 max-w-5xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-[#111] tracking-tight mb-4">
            Built for trade businesses.{" "}
            <span className="italic font-serif text-gray-400">Not tech teams.</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto font-light">
            We handle the follow-up. You handle the work. It's that simple.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {BENEFITS.map((b, i) => (
            <motion.div key={b.title} {...fadeUp(i * 0.07)}>
              <Card className="h-full">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                      <b.icon className="w-5 h-5 text-gray-900" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 tracking-tight mb-1.5">
                      {b.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{b.body}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 pb-32">
        <motion.div
          {...fadeUp(0)}
          className="relative max-w-2xl mx-auto text-center"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-gradient-to-tr from-purple-100/50 to-blue-100/50 blur-[60px] rounded-full pointer-events-none" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-medium text-[#111] tracking-tight mb-8 leading-[1.1]">
              Ready to stop missing{" "}
              <span className="italic font-serif text-gray-400">opportunities?</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/sign-up"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#111] text-white text-sm font-semibold rounded-2xl shadow-xl shadow-gray-200/50 hover:opacity-85 transition-opacity"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/Pricing"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                View Pricing
              </Link>
            </div>
            <p className="mt-6 text-xs text-gray-400 font-medium">
              Start letting calls go to your competitors.
            </p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
