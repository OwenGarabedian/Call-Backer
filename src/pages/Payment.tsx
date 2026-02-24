import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Wallet,
  CheckCircle2,
  Check,
  Bot,
  Calendar,
  Phone
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/magnetic-button";
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
    buttonText: "Coming Soon"
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
    buttonText: "Coming Soon"
  }
];

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

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const routeUserId = (location.state as { id?: string })?.id;

  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);

  const [isMonthPaid, setIsMonthPaid] = useState(false);
  const [twilioStatus, setTwilioStatus] = useState<string | null>(null);

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
        const [profRes, settingsRes, twilioRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", currentUserId).single(),
          supabase.from("user_settings").select("month_paid").eq("user_id", currentUserId).single(),
          supabase.from("twilio_profiles").select("status").eq("user_id", currentUserId).single(),
        ]);

        if (isMounted) {
          if (profRes.data) setProfileData(profRes.data);
          if (settingsRes.data) setIsMonthPaid(settingsRes.data.month_paid);
          if (twilioRes.data) setTwilioStatus(twilioRes.data.status);
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

  const handleUpgrade = async () => {
    if (isMonthPaid) {
      alert("Your account is currently active!");
      return;
    }

    setUpgrading(true);
    try {
      alert("Please implement Stripe Web Checkout routing here.");
    } catch (e: any) {
      alert(e.message || "Something went wrong");
    } finally {
      setUpgrading(false);
    }
  };

  const go = (path: string) => navigate(path, { state: { id: activeUserId } });
  
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      await supabase.auth.signOut();
      navigate("/");
    }
  };

  const canGoBack = !loading && (isMonthPaid || twilioStatus === "pending");

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50 font-sans">
      
      {/* ── SIDEBAR ── */}
      <Sidebar activeUserId={activeUserId} />

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Background Decorative Blur */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0 z-10 shadow-sm relative">
          <div className="flex items-center gap-4">
            {canGoBack ? (
              <button 
                onClick={() => navigate("/dashboard", { state: { id: activeUserId } })}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
               <div className="w-9 h-9" />
            )}
            <div>
              <h1 className="font-display text-xl font-bold text-gray-900">Choose a Plan</h1>
              <p className="text-xs text-gray-500 mt-0.5">Manage your current billing cycle.</p>
            </div>
          </div>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto px-6 py-10 z-10 relative">
          {loading ? (
            <div className="flex items-center justify-center h-full">
               <Loader2 className="w-8 h-8 text-neutral-500 animate-spin" />
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-10 pb-32">

              {/* PRICING CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
                {plans.map((plan, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      "relative p-8 rounded-[2rem] flex flex-col overflow-hidden transition-all duration-300",
                      plan.highlight && !plan.comingSoon
                        ? "bg-gray-900 text-white shadow-2xl scale-100 lg:scale-105 z-10 ring-1 ring-white/10" 
                        : "bg-white text-gray-900 border border-gray-200"
                    )}
                  >
                     {plan.comingSoon && (
                       <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6">
                         <div className="bg-gray-100 p-4 rounded-2xl mb-4">
                            <Lock className="w-5 h-5 text-gray-400" />
                         </div>
                         <h3 className="text-lg font-display font-bold text-gray-900">Coming Soon</h3>
                       </div>
                     )}

                     {plan.highlight && !plan.comingSoon && (
                        <div className="absolute -top-[1px] -right-[1px] bg-indigo-500 text-white px-4 py-1.5 rounded-bl-xl rounded-tr-[2rem] text-[10px] font-bold uppercase tracking-widest shadow-lg">
                          Launch Offer
                        </div>
                     )}
                     
                     <div className="mb-8 relative z-10 flex-col">
                       <h3 className={cn("text-sm font-bold uppercase tracking-widest mb-4", plan.highlight && !plan.comingSoon ? "text-indigo-400" : "text-gray-400")}>{plan.name}</h3>
                       <div className={cn("flex items-baseline gap-1 mt-2", plan.highlight && !plan.comingSoon ? "text-white" : "text-gray-900")}>
                         <span className="text-3xl font-bold">$</span>
                         <RollingNumber value={plan.price} />
                         <span className={cn("text-sm font-medium", plan.highlight && !plan.comingSoon ? "text-gray-400" : "text-gray-500")}>/mo</span>
                       </div>
                     </div>

                     <div className="flex-1 space-y-5 mb-8 relative z-10">
                       {plan.features.map((f: any, index: number) => (
                         <div key={index} className="flex items-center gap-3">
                           <div className={cn("shrink-0 p-1.5 rounded-lg", plan.highlight && !plan.comingSoon ? "bg-white/10 text-emerald-400" : "bg-gray-100 text-gray-400")}>
                             <f.icon className="w-4 h-4" strokeWidth={2} />
                           </div>
                           <div className="flex flex-col">
                             <span className={cn("text-sm font-semibold", plan.highlight && !plan.comingSoon ? "text-white" : "text-gray-900")}>{f.text}</span>
                             {f.sub && <span className={cn("text-[10px] uppercase font-bold tracking-wider", plan.highlight && !plan.comingSoon ? "text-gray-400" : "text-gray-500")}>{f.sub}</span>}
                           </div>
                         </div>
                       ))}
                     </div>

                     <div className="relative z-20 mt-auto">
                        <button 
                          onClick={plan.highlight && !plan.comingSoon ? handleUpgrade : undefined}
                          disabled={isMonthPaid || upgrading || plan.comingSoon}
                          className={cn(
                            "w-full h-14 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300",
                            plan.comingSoon ? "cursor-not-allowed opacity-70 pointer-events-none" : "",
                            plan.highlight && !plan.comingSoon 
                               ? (isMonthPaid ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-indigo-500 hover:bg-indigo-600 text-white") 
                               : "bg-gray-50 border border-gray-200 text-gray-900 hover:bg-gray-100"
                          )}
                        >
                          {plan.highlight && !plan.comingSoon && isMonthPaid ? "Subscribed" : plan.buttonText}
                        </button>
                     </div>
                  </motion.div>
                ))}
              </div>

            </div>
          )}
        </main>
        
        {/* Sticky Fixed Bottom CTA */}
        {!loading && (
          <div className="fixed bottom-0 left-60 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200 p-6 z-20 flex justify-center lg:block sm:hidden">
            <button
               onClick={handleUpgrade}
               disabled={isMonthPaid || upgrading}
               className={cn(
                 "max-w-md mx-auto w-full h-16 rounded-2xl flex items-center justify-center gap-3 transition-all font-semibold shadow-lg text-lg",
                 isMonthPaid 
                   ? "bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-emerald-500/10 cursor-not-allowed" 
                   : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] text-white shadow-indigo-500/25"
               )}
            >
               {upgrading ? (
                 <Loader2 className="w-6 h-6 animate-spin" />
               ) : (
                 <>
                   {isMonthPaid ? <CheckCircle2 className="w-6 h-6" /> : <Wallet className="w-6 h-6" />}
                   {isMonthPaid ? "ALREADY SUBSCRIBED" : "SUBSCRIBE TO STARTER"}
                 </>
               )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
