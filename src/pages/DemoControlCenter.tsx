import { motion } from "framer-motion";
import {
  ArrowLeft, Lock, Sparkles, Megaphone, Target, Bot, Database, ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DemoSidebar } from "@/components/DemoSidebar";
import { DemoBanner } from "@/components/DemoBanner";

const campaigns = [
  {
    id: "reviews",
    title: "Review Generator",
    desc: "Auto-texts past callers asking for a 1-10 rating. Sends Google link to 8+ ratings.",
    icon: Sparkles,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    id: "mass_text",
    title: "Mass Broadcast",
    desc: "Send an announcement, promotion, or holiday greeting to your entire caller log.",
    icon: Megaphone,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    id: "winback",
    title: "Missed Call Win-back",
    desc: "Target users who missed a call but never booked. Send them a special discount.",
    icon: Target,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
];

export default function DemoControlCenter() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafa] font-sans">
      <DemoSidebar />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background blurs */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-md flex-shrink-0 z-10 shadow-sm relative">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/demo")}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-0.5">Pro Controls</p>
              <h1 className="font-display text-xl font-bold text-gray-900">Control Center</h1>
            </div>
          </div>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto z-10 relative pb-16">
          <DemoBanner />

          <div className="px-6 lg:px-10 pt-6">
            <div className="max-w-4xl mx-auto space-y-10">
              {/* Upsell banner */}
              <div className="bg-gradient-to-r from-amber-200 to-amber-400 rounded-3xl p-6 shadow-lg shadow-amber-500/20 border border-amber-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-amber-100 rounded-full blur-[50px] opacity-40 mix-blend-overlay pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-5 h-5 text-amber-900" />
                    <h3 className="font-display font-bold text-amber-900 tracking-wider text-sm uppercase">Unlock Pro Campaigns</h3>
                  </div>
                  <p className="text-amber-900/80 text-sm font-medium mb-6 max-w-2xl leading-relaxed">
                    Upgrade to the PRO tier ($74.99/mo) to unlock automated Google Reviews, mass broadcasting, and advanced marketing tools.
                  </p>
                  <button
                    onClick={() => navigate("/sign-up")}
                    className="bg-amber-900 text-amber-50 hover:bg-amber-800 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md inline-block"
                  >
                    Sign Up to Upgrade
                  </button>
                </div>
              </div>

              {/* Campaign list */}
              <div>
                <div className="mb-6">
                  <span className="bg-white border border-gray-200 px-4 py-1.5 rounded-full text-xs font-bold text-gray-900 tracking-wider shadow-sm">
                    MARKETING CAMPAIGNS
                  </span>
                </div>
                <div className="space-y-4">
                  {campaigns.map((camp, index) => (
                    <motion.div
                      key={camp.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="w-full bg-white rounded-2xl p-5 flex items-center gap-5 text-left border border-gray-200 shadow-sm opacity-60 cursor-not-allowed"
                    >
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border", camp.bg, camp.color, camp.borderColor)}>
                        <camp.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-bold text-gray-900 mb-1">{camp.title}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">{camp.desc}</p>
                      </div>
                      <div className="shrink-0 pl-4">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Advanced AI Controls */}
              <div>
                <div className="mb-6">
                  <span className="bg-white border border-gray-200 px-4 py-1.5 rounded-full text-xs font-bold text-gray-900 tracking-wider shadow-sm">
                    ADVANCED AI CONTROLS
                  </span>
                </div>
                <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                  <div className="w-full p-5 flex items-center justify-between opacity-60 cursor-not-allowed">
                    <div className="flex items-center gap-4">
                      <Bot className="w-5 h-5 text-gray-500" />
                      <span className="font-medium text-gray-900">Custom AI Prompt Logic</span>
                    </div>
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="h-px bg-gray-100 ml-14" />
                  <div className="w-full p-5 flex items-center justify-between opacity-60 cursor-not-allowed">
                    <div className="flex items-center gap-4">
                      <Database className="w-5 h-5 text-gray-500" />
                      <span className="font-medium text-gray-900">Export Logs via Database</span>
                    </div>
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
