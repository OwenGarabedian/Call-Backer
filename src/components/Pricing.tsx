import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Calculator, Lock, Bot, MessageSquare, Calendar, Phone, Database, Check, Plus, Minus, ArrowLeft } from "lucide-react";
import Lenis from "@studio-freight/lenis";

// Import your site-wide components
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MagneticButton } from "./ui/magnetic-button";

// --- 1. UTILITIES ---

const Digit = ({ char, delay }: { char: string, delay: number }) => {
  if (isNaN(parseInt(char)) && char !== ".") return <span className="text-5xl font-bold font-display">{char}</span>;
  return (
    <motion.div
      initial={{ y: "100%" }}
      whileInView={{ y: "0%" }}
      viewport={{ once: true }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 30,
        delay 
      }}
      className="relative flex flex-col items-center h-[60px]"
    >
      <span className="text-5xl font-bold font-display flex items-center h-[60px]">{char}</span>
    </motion.div>
  );
};

const RollingNumber = ({ value }: { value: string }) => {
  return (
    <div className="flex items-baseline overflow-hidden h-[60px]">
      {value.split("").map((char, i) => (
        <Digit key={i} char={char} delay={i * 0.1} />
      ))}
    </div>
  );
};

// --- 2. CONFIGURATION ---

const faqs = [
  {
    question: "Does it sound like a robot?",
    answer: "No. We use the latest Artificial Intelligence to ensure natural, fluid conversations that feel human.",
  },
  {
    question: "Can I keep my current phone number?",
    answer: "Yes. You simply set up 'Conditional Call Forwarding' on your existing line. It takes 2 minutes. When you don't answer, we pick up.",
  },
  {
    question: "Is there a long-term contract?",
    answer: "Never. All plans are month-to-month. You can upgrade, downgrade, or cancel at any time with one click.",
  },
];

const plans = [
  {
    name: "Everything Included",
    price: "29.99",
    features: [
      { text: "24/7 AI Receptionist", sub: "Never miss a booking", icon: Bot },
      { text: "Unlimited SMS", sub: "Auto-replies & scheduling", icon: MessageSquare },
      { text: "Calendar Integration", sub: "Direct calendar syncing", icon: Calendar },
      { text: "Local Calling", sub: "Call any client from app", icon: Phone },
      { text: "Advanced CRM", sub: "Manage profiles & trends", icon: Database },
    ],
    highlight: true,
    comingSoon: false,
    buttonText: "Subscribe Now"
  },
  {
    name: "Pro",
    price: "74.99",
    features: [
      { text: "Multi-Agent Support", icon: Check },
      { text: "Priority Support", icon: Check },
      { text: "Team Access (5)", icon: Check },
      { text: "Custom Workflows", icon: Check },
      { text: "API Access", icon: Check }
    ],
    highlight: false,
    comingSoon: true,
    buttonText: "Join Waitlist"
  },
  {
    name: "AI Voice+",
    price: "99.99",
    features: [
      { text: "Voice Cloning", icon: Check },
      { text: "White-labeling", icon: Check },
      { text: "Dedicated Manager", icon: Check },
      { text: "Unlimited History", icon: Check },
      { text: "SLA Guarantee", icon: Check }
    ],
    highlight: false,
    comingSoon: true,
    buttonText: "Join Waitlist"
  }
];

// --- 3. SUB-COMPONENTS ---

const FAQItem = ({ faq, index }: { faq: typeof faqs[0]; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="border-b border-neutral-200"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-medium text-neutral-900 group-hover:text-blue-600 transition-colors pr-8">
          {faq.question}
        </span>
        <div className={`p-2 rounded-full transition-colors shrink-0 ${isOpen ? "bg-blue-100 text-blue-600" : "bg-neutral-100 text-neutral-500"}`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-neutral-500 leading-relaxed pr-8">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- 4. THE SECTION CONTENT ---

export const Pricing = () => {
  return (
    <div className="pt-32 pb-20 relative">
      
      {/* --- BACK BUTTON (MOBILE ONLY, STANDARD HTML ANCHOR) --- */}
      <div className="max-w-6xl mx-auto px-6 mb-8 flex md:hidden justify-start">
        <a href="/" className="inline-block">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 shadow-sm text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </motion.div>
        </a>
      </div>
      
      {/* HEADER SECTION */}
      <div className="max-w-6xl mx-auto px-6 text-center mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Limited Time Launch Pricing</span>
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 tracking-tight mb-6">
          Simple pricing. <br />
          <span className="text-neutral-400 font-serif italic">Serious ROI.</span>
        </h1>
        <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
          Secure the launch rate today. Lock in your price for life.
        </p>
      </div>

      {/* PRICING CARDS */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative p-8 rounded-3xl flex-col overflow-hidden transition-all duration-300 ${
              plan.comingSoon ? "hidden md:flex" : "flex"
            } ${
              plan.highlight && !plan.comingSoon
                ? "bg-[#111] text-white shadow-2xl scale-105 z-10 ring-1 ring-white/10" 
                : "bg-white text-neutral-900 border border-neutral-200 opacity-80"
            }`}
          >
             {plan.comingSoon && (
               <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6">
                 <div className="bg-neutral-100 p-4 rounded-full mb-4">
                    <Lock className="w-6 h-6 text-neutral-400" />
                 </div>
                 <h3 className="text-xl font-bold text-neutral-900">Coming Soon</h3>
                 <p className="text-sm text-neutral-500 mt-2">Invite-only.</p>
               </div>
             )}

             {plan.highlight && !plan.comingSoon && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                  Launch Offer
                </div>
             )}
             
             <div className="mb-8 relative z-10">
               <h3 className={`text-lg font-medium ${plan.highlight && !plan.comingSoon ? "text-neutral-200" : "text-neutral-500"}`}>{plan.name}</h3>
               <div className={`flex items-baseline gap-1 mt-2 ${plan.highlight && !plan.comingSoon ? "text-white" : "text-neutral-900"}`}>
                 <span className="text-2xl">$</span>
                 <RollingNumber value={plan.price} />
                 <span className="text-neutral-400 text-sm">/mo</span>
               </div>
             </div>

             <div className="flex-1 space-y-5 mb-8 relative z-10">
               {plan.features.map((f: any, index: number) => (
                 <div key={index} className="flex items-center gap-3">
                   <div className={`shrink-0 p-1.5 rounded-lg ${plan.highlight && !plan.comingSoon ? "bg-white/10 text-emerald-400" : "bg-neutral-100 text-neutral-400"}`}>
                     <f.icon className="w-4 h-4" strokeWidth={2} />
                   </div>
                   <div className="flex flex-col">
                     <span className={`text-sm font-medium ${plan.highlight && !plan.comingSoon ? "text-white" : "text-neutral-900"}`}>{f.text}</span>
                     {f.sub && <span className="text-[10px] text-neutral-500">{f.sub}</span>}
                   </div>
                 </div>
               ))}
             </div>

             <div className="relative z-20 mt-auto">
                <MagneticButton 
                  variant={plan.highlight && !plan.comingSoon ? "primary" : "secondary"} 
                  className={`w-full justify-center py-4 ${plan.comingSoon ? "cursor-not-allowed opacity-70 pointer-events-none" : ""} ${!plan.highlight && "bg-neutral-50 border-neutral-200"}`}
                >
                  {plan.buttonText}
                </MagneticButton>
             </div>
          </motion.div>
        ))}
      </div>

      {/* ROI CALCULATOR */}
      <div className="max-w-4xl mx-auto px-6 mb-32">
        <div className="bg-blue-600 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-blue-500 rounded-full blur-[100px] opacity-50" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-white">The Math is Simple.</h3>
              <p className="text-blue-100 leading-relaxed text-lg">
                If your average job is worth <span className="font-bold text-white">$500.00</span>, saving just <span className="font-bold text-white">one missed call</span> pays for the entire year.
              </p>
            </div>
            <div className="w-full md:w-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 min-w-[280px]">
              <div className="flex justify-between items-center mb-4 text-blue-200 text-sm">
                <span>Avg. Job Value</span>
                <span>$500.00</span>
              </div>
              <div className="flex justify-between items-center mb-4 text-blue-200 text-sm">
                <span>Monthly Cost</span>
                <span>-$29.99</span>
              </div>
              <div className="h-px w-full bg-white/20 my-4" />
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Net Profit</span>
                <span className="text-emerald-300">+$470.01</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Common Questions</h2>
          <p className="text-neutral-500">Everything you need to know.</p>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};