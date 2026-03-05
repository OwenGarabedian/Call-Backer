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
  Phone,
  ListChecks,
  Wrench,
  Megaphone,
} from "lucide-react";

// ── Shared helpers ───────────────────────────────────────────────────────────
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

// ── Getting Started Steps ────────────────────────────────────────────────────
const SETUP_STEPS = [
  {
    number: "01",
    icon: ListChecks,
    label: "Sign Up & Onboard",
    color: "text-violet-500",
    bg: "bg-violet-50",
    border: "border-violet-100",
    description:
      "Fill out a quick sign-up form with your business details — name, services, and a few lines about your company. That's all we need to get started.",
    detail: "Takes about 5 minutes. No tech skills required.",
  },
  {
    number: "02",
    icon: Wrench,
    label: "We Build It for You (1–2 Weeks)",
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    description:
      "Our team sets everything up on the back end during your 1–2 week onboarding window. We configure your AI, train it on your business, and set up your dedicated Call Backer number. You don't touch a thing.",
    detail:
      "We handle 100% of the technical setup. You'll get a heads-up when you're live.",
  },
  {
    number: "03",
    icon: Phone,
    label: "Your New Number Goes on Everything",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    description:
      "Once live, you'll swap your advertising number to your new Call Backer number — on your website, Google Business, truck decals, yard signs, and any digital ads. Your real phone number stays private and unchanged.",
    detail:
      "Your old posters or flyers that already have your personal number on them? No problem — those calls will still ring your cell like normal. Only the new number feeds into the system.",
  },
  {
    number: "04",
    icon: MessageSquare,
    label: "Missed Calls Trigger Instant AI Texts",
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-100",
    description:
      "When someone calls your Call Backer number and you don't pick up, an AI text goes out within seconds. The lead gets a warm, professional message from your business name — and the conversation is tracked in your dashboard.",
    detail:
      "You can still answer that number live too — it rings just like any phone. The AI only kicks in when you miss it.",
  },
  {
    number: "05",
    icon: UserCheck,
    label: "AI Qualifies the Lead",
    color: "text-pink-500",
    bg: "bg-pink-50",
    border: "border-pink-100",
    description:
      "The AI keeps the conversation going, asks the right questions, and figures out the job scope, location, and urgency — all over text. Hot leads get flagged at the top of your dashboard.",
    detail:
      "You only step in when the lead is warm and ready. No more chasing cold calls.",
  },
  {
    number: "06",
    icon: Calendar,
    label: "You Close the Job",
    color: "text-teal-500",
    bg: "bg-teal-50",
    border: "border-teal-100",
    description:
      "Once a lead is qualified, you give them a call back or set up an estimate. Every lead, message, and status is logged in your dashboard — clean and organized.",
    detail: "Less time chasing, more time closing. Every lead accounted for.",
  },
];

// ── How the Phone Routing Works ──────────────────────────────────────────────
const ROUTING_POINTS = [
  {
    icon: Phone,
    title: "You Get a Dedicated Business Number",
    body: "Call Backer gives you a real local phone number powered by Twilio (the same tech behind major apps like Uber and Airbnb). This is the number you put on your ads.",
  },
  {
    icon: Shield,
    title: "Your Personal Number Stays the Same",
    body: "Nothing changes with your real phone. You keep your number, your contacts, your carrier — everything. Call Backer runs alongside your phone, not through it.",
  },
  {
    icon: Megaphone,
    title: "Old Posters? No Worries",
    body: "If you have existing yard signs, flyers, or truck wraps with your personal number — those still work fine. Calls to your old number ring you directly as always. Only the new Call Backer number feeds the system.",
  },
  {
    icon: Zap,
    title: "Miss a Call → AI Texts Instantly",
    body: "The only difference: when a call to your Call Backer number goes unanswered, the AI fires off a text within seconds. If you pick up, it's just a normal phone call.",
  },
];

// ── Why It Matters ───────────────────────────────────────────────────────────
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

// ── Page ─────────────────────────────────────────────────────────────────────
const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <Header />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-20 px-4 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-[#E0CCF7] to-transparent opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-[#D4E4F7] to-transparent opacity-30 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp(0)}>
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-[#111] mb-6 leading-[1.1]">
              Missed calls become{" "}
              <span className="italic font-serif text-gray-400">booked jobs.</span>
            </h1>

            <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed font-light">
              Call Backer runs quietly in the background of your business — no tech skills needed, no changes to your phone. Here's exactly how it works from sign-up to your first booked lead.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Getting Started Steps ── */}
      <section className="relative px-4 pb-24 mt-4 max-w-5xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-[#111] tracking-tight mb-4">
            Getting started.{" "}
            <span className="italic font-serif text-gray-400">Step by step.</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto font-light">
            From sign-up to your first automated lead follow-up — here's the full picture.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6">
          {SETUP_STEPS.map((step, i) => (
            <motion.div key={step.number} {...fadeUp(i * 0.07)}>
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
                    {i < SETUP_STEPS.length - 1 && (
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

      {/* ── How the Phone Routing Works ── */}
      <section className="px-4 pb-24 max-w-5xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-[#111] tracking-tight mb-4">
            How the number routing works.{" "}
            <span className="italic font-serif text-gray-400">Plain and simple.</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto font-light">
            Your personal phone doesn't change. Your existing marketing can stay up. Here's why.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {ROUTING_POINTS.map((r, i) => (
            <motion.div key={r.title} {...fadeUp(i * 0.07)}>
              <Card className="h-full">
                <div className="flex flex-col gap-4">
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 w-fit">
                    <r.icon className="w-5 h-5 text-gray-900" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 tracking-tight mb-1.5">
                      {r.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{r.body}</p>
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
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 w-fit">
                    <b.icon className="w-5 h-5 text-gray-900" strokeWidth={1.5} />
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
            <h2 className="text-4xl md:text-5xl font-medium text-[#111] tracking-tight mb-4 leading-[1.1]">
              Ready to stop missing{" "}
              <span className="italic font-serif text-gray-400">opportunities?</span>
            </h2>
            <p className="text-gray-500 mb-8 font-light max-w-md mx-auto">
              Sign up today and we'll have your system live within 1–2 weeks. No contracts, no tech headaches.
            </p>
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
              Live in 1–2 weeks. Nothing changes with your current phone or number.
            </p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
