import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  User,
  Phone as PhoneIcon,
  Loader2,
  Settings as SettingsIcon,
  LayoutGrid,
  PhoneMissed,
  MessageSquare,
  Database,
  LayoutList,
  Layers,
  LogOut,
  Headset,
  ChevronDown,
  ChevronUp,
  Mail,
  BookOpen,
  ExternalLink,
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

const SUPPORT_EMAIL = "support@call-backer.com";
const DOCS_URL = "https://call-backer.com";

const FAQS = [
  {
    question: "Why isn't my AI answering calls?",
    answer: "Ensure 'Call Forwarding' is toggled ON in Automation Settings. Also, check that your business phone number is correct.",
  },
  {
    question: "How do I update my prices?",
    answer: "Go to Settings -> Services and Pricing. The AI reads directly from that list.",
  },
  {
    question: "My Cal.com integration isn't working.",
    answer: "Double check that your API Key is correct and that your Event Type in Cal.com is set to public. Also make sure you add customer events for the AI to book clients with",
  },
];

export default function Support() {
  const location = useLocation();
  const navigate = useNavigate();
  const routeUserId = (location.state as { id?: string })?.id;

  const [loading, setLoading] = useState(true);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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
        const { data: profRes } = await supabase.from("profiles").select("*").eq("id", currentUserId).single();
        if (isMounted && profRes) {
          setProfileData(profRes);
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

  const handleEmailSupport = () => {
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=Support Request - AutoReach&body=Help me!`;
  };

  const go = (path: string) => navigate(path, { state: { id: activeUserId } });
  
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      await supabase.auth.signOut();
      navigate("/");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50 font-sans">
      
      {/* ── SIDEBAR ── */}
      <Sidebar activeUserId={activeUserId} />

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Background Decorative Blur */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/settings", { state: { id: activeUserId } })}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold text-gray-900">Support</h1>
              <p className="text-xs text-gray-500 mt-0.5">Help Center & FAQs.</p>
            </div>
          </div>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto px-6 py-10 z-10 relative">
          
          {loading ? (
            <div className="flex items-center justify-center h-full">
               <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8 pb-10">
              
              {/* Contact Card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-[2rem] border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                         <Headset className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div>
                         <h2 className="text-xl font-display font-bold text-gray-900">Need Help?</h2>
                         <p className="text-sm text-gray-500 mt-1">Our team is available Mon-Fri.</p>
                      </div>
                   </div>
                   
                   <button
                     onClick={handleEmailSupport}
                     className="h-12 px-6 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-sm w-full md:w-auto shrink-0"
                   >
                     <Mail className="w-4 h-4" />
                     Email Support
                   </button>
                </div>
              </motion.div>

              {/* FAQ Section */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="space-y-4"
              >
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-2">Common Questions</h3>
                
                <div className="bg-white rounded-[2rem] border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                   {FAQS.map((faq, index) => {
                      const isExpanded = expandedFaq === index;
                      return (
                         <div key={index} className="border-b border-gray-100 last:border-0">
                           <button
                             className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50/50 transition-colors"
                             onClick={() => setExpandedFaq(isExpanded ? null : index)}
                           >
                             <span className="font-semibold text-gray-900 text-sm">{faq.question}</span>
                             {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                             ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                             )}
                           </button>
                           
                           <AnimatePresence>
                             {isExpanded && (
                               <motion.div
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: "auto", opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 className="overflow-hidden"
                               >
                                 <div className="p-6 pt-0 text-sm text-gray-500 leading-relaxed bg-gray-50/20">
                                   {faq.answer}
                                 </div>
                               </motion.div>
                             )}
                           </AnimatePresence>
                         </div>
                      );
                   })}
                </div>
              </motion.div>

              {/* Documentation Link */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                 <a
                   href={DOCS_URL}
                   target="_blank"
                   rel="noreferrer"
                   className="flex items-center justify-between p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group"
                 >
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5" />
                       </div>
                       <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Read Documentation</span>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                 </a>
              </motion.div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
