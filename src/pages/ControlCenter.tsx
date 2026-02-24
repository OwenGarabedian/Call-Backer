import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Phone as PhoneIcon,
  Settings as SettingsIcon,
  LayoutGrid,
  PhoneMissed,
  MessageSquare,
  Database,
  LayoutList,
  Layers,
  LogOut,
  Loader2,
  Lock,
  Sparkles,
  Megaphone,
  Target,
  Bot,
  ChevronRight,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { cn } from "@/lib/utils";
import { Sidebar } from "../components/Sidebar";

const NAV = [
  { icon: LayoutGrid, label: "Dashboard", to: "/dashboard" },
  { icon: PhoneMissed, label: "Missed Calls", to: "/calls" },
  { icon: MessageSquare, label: "Messages", to: "/messages" },
  { icon: Database, label: "Database", to: "/database" },
  { icon: LayoutList, label: "Control Center", to: "/control-center" },
  { icon: Layers, label: "Billing", to: "/payment" },
  { icon: SettingsIcon, label: "Settings", to: "/settings" },
];

export default function ControlCenter() {
  const location = useLocation();
  const navigate = useNavigate();
  const routeUserId = (location.state as { id?: string })?.id;

  const [loading, setLoading] = useState(true);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);

  // MOCK TIER STATE
  const [isMaxTier, setIsMaxTier] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      let currentUserId = routeUserId;
      if (!currentUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          currentUserId = user.id;
        } else {
          if (isMounted) setLoading(false);
          return;
        }
      }

      if (isMounted) setActiveUserId(currentUserId);

      try {
        const { data: profData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUserId)
          .single();

        if (isMounted && profData) {
          setProfileData(profData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [routeUserId]);

  const go = (path: string) => navigate(path, { state: { id: activeUserId } });
  
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      await supabase.auth.signOut();
      navigate("/");
    }
  };

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

  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafa] font-sans">
      
      {/* ── SIDEBAR ── */}
      <Sidebar activeUserId={activeUserId} />

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Background Decorative Blur */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-md flex-shrink-0 z-10 shadow-sm relative">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/dashboard", { state: { id: activeUserId } })}
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
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 z-10 relative">
          {loading ? (
            <div className="flex items-center justify-center h-full">
               <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-10 pb-20">
              
              {/* UPSELL BANNER */}
              {!isMaxTier && (
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
                      onClick={() => navigate("/payment", { state: { id: activeUserId } })}
                      className="bg-amber-900 text-amber-50 hover:bg-amber-800 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md inline-block"
                    >
                      Upgrade Now
                    </button>
                  </div>
                </div>
              )}

              {/* CAMPAIGN LIST */}
              <div>
                <div className="mb-6">
                  <span className="bg-white border border-gray-200 px-4 py-1.5 rounded-full text-xs font-bold text-gray-900 tracking-wider shadow-sm">
                    MARKETING CAMPAIGNS
                  </span>
                </div>
                
                <div className="space-y-4">
                  {campaigns.map((camp, index) => (
                    <motion.button
                      key={camp.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      disabled={!isMaxTier}
                      onClick={() => console.log("Open config for:", camp.id)}
                      className={cn(
                        "w-full bg-white rounded-2xl p-5 flex items-center gap-5 text-left transition-all border shadow-sm",
                        !isMaxTier ? "opacity-60 cursor-not-allowed border-gray-200" : "hover:border-indigo-300 hover:shadow-md cursor-pointer border-gray-200"
                      )}
                    >
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border", camp.bg, camp.color, camp.borderColor)}>
                        <camp.icon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-bold text-gray-900 mb-1">{camp.title}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">{camp.desc}</p>
                      </div>

                      <div className="shrink-0 pl-4">
                         {isMaxTier ? (
                           <ChevronRight className="w-5 h-5 text-gray-400" />
                         ) : (
                           <Lock className="w-5 h-5 text-gray-400" />
                         )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* ADVANCED AI CONTROLS */}
              <div>
                <div className="mb-6">
                  <span className="bg-white border border-gray-200 px-4 py-1.5 rounded-full text-xs font-bold text-gray-900 tracking-wider shadow-sm">
                    ADVANCED AI CONTROLS
                  </span>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                  <button 
                    disabled={!isMaxTier}
                    className={cn(
                      "w-full p-5 flex items-center justify-between text-left transition-colors",
                      !isMaxTier ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <Bot className="w-5 h-5 text-gray-500" />
                      <span className="font-medium text-gray-900">Custom AI Prompt Logic</span>
                    </div>
                    {!isMaxTier && <Lock className="w-4 h-4 text-gray-400" />}
                  </button>

                  <div className="h-px bg-gray-100 ml-14" />

                  <button 
                    disabled={!isMaxTier}
                    className={cn(
                      "w-full p-5 flex items-center justify-between text-left transition-colors",
                      !isMaxTier ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <Database className="w-5 h-5 text-gray-500" />
                      <span className="font-medium text-gray-900">Export Logs via Database</span>
                    </div>
                    {!isMaxTier && <Lock className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
              </div>

            </div>
          )}
        </main>

      </div>
    </div>
  );
}
