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
  Save,
  Trash2,
  Plus,
  Bot,
  Info,
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

interface KnowledgeItem {
  id: string;
  name: string;
  price: string;
}

export default function BusinessKnowledge() {
  const location = useLocation();
  const navigate = useNavigate();
  // Safe extraction of ID with Auth Fallback
  const routeUserId = (location.state as { id?: string })?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);

  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [extraInfo, setExtraInfo] = useState("");

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

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
        const [profRes, setRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", currentUserId).single(),
          supabase.from("user_settings").select("business_knowledge").eq("user_id", currentUserId).single()
        ]);

        if (isMounted) {
          if (profRes.data) setProfileData(profRes.data);
          if (setRes.data && setRes.data.business_knowledge) {
            try {
              const parsed = JSON.parse(setRes.data.business_knowledge);
              
              if (Array.isArray(parsed)) {
                setItems(parsed);
              } else if (parsed && typeof parsed === "object") {
                setItems(parsed.services || []);
                setExtraInfo(parsed.extraInfo || "");
              }
            } catch (e) {
              console.log("Could not parse legacy knowledge as JSON");
            }
          }
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

  const handleAddItem = () => {
    if (!newName.trim() || !newPrice.trim()) {
      alert("Please enter both a service name and a price/detail.");
      return;
    }

    const newItem: KnowledgeItem = {
      id: Date.now().toString(),
      name: newName,
      price: newPrice,
    };

    setItems([...items, newItem]);
    setNewName("");
    setNewPrice("");
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleSave = async () => {
    if (!activeUserId) return;
    setSaving(true);
    try {
      const jsonString = JSON.stringify({
        services: items,
        extraInfo: extraInfo.trim(),
      });

      const { error } = await supabase
        .from("user_settings")
        .update({ business_knowledge: jsonString })
        .eq("user_id", activeUserId);

      if (error) throw error;
      navigate("/settings", { state: { id: activeUserId } });
    } catch (error) {
      console.error(error);
      alert("Could not save info.");
    } finally {
      setSaving(false);
    }
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
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

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
              <h1 className="font-display text-xl font-bold text-gray-900">Services & Info</h1>
              <p className="text-xs text-gray-500 mt-0.5">Train your AI with your business knowledge.</p>
            </div>
          </div>
          
          <div className="hidden sm:flex">
             <button
                onClick={handleSave}
                disabled={saving || loading}
                className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-50 shadow-sm"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Configuration
              </button>
          </div>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto px-6 py-10 z-10 relative">
          
          {loading ? (
            <div className="flex items-center justify-center h-full">
               <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8 pb-10">
              
              {/* Instructions Card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-[2rem] border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
              >
                <div className="p-6 md:p-8 bg-gray-50/50">
                   <h2 className="text-lg font-display font-bold text-gray-900 flex items-center gap-2">
                      <Bot className="w-5 h-5 text-purple-500" />
                      Train Your AI
                   </h2>
                   <p className="text-sm text-gray-500 mt-2">
                     The details you provide below serve as the main brain for your AI auto-replies. Make sure your prices, policies, and business rules are accurate!
                   </p>
                </div>
              </motion.div>

              {/* Add New Service */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="bg-white rounded-[2rem] border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
              >
                <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
                   <h2 className="text-lg font-display font-bold text-gray-900 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-indigo-500" />
                      Add New Service
                   </h2>
                   <p className="text-sm text-gray-500 mt-1">Add a new service or product offering to your AI's brain.</p>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                       <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="e.g. Mens Haircut"
                          className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
                       />
                    </div>
                    <div className="sm:w-32 space-y-2">
                       <input
                          type="text"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          placeholder="$30"
                          className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
                       />
                    </div>
                    <button
                      onClick={handleAddItem}
                      className="h-11 px-6 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* List of Items */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="space-y-3"
              >
                <AnimatePresence>
                  {items.length === 0 ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-sm text-gray-400 py-4 font-medium"
                    >
                      No services added yet.
                    </motion.p>
                  ) : (
                    items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between shadow-sm"
                      >
                        <span className="font-semibold text-gray-900 text-sm">{item.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-700 text-sm">{item.price}</span>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Additional Context */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="bg-white rounded-[2rem] border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
              >
                <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
                   <h2 className="text-lg font-display font-bold text-gray-900 flex items-center gap-2">
                      <Info className="w-5 h-5 text-emerald-500" />
                      Business Info & Policies
                   </h2>
                   <p className="text-sm text-gray-500 mt-1">Detail your hours, parking, and rules for the AI.</p>
                </div>

                <div className="p-6 md:p-8">
                  <textarea
                    value={extraInfo}
                    onChange={(e) => setExtraInfo(e.target.value)}
                    placeholder="e.g. We are open Mon-Fri 9am-5pm. Street parking is available out front. A $20 fee applies for no-shows..."
                    className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-sm resize-none"
                  />
                </div>

                {/* Mobile Save Button */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end sm:hidden">
                   <button
                      onClick={handleSave}
                      disabled={saving || loading}
                      className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-sm"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Configuration
                    </button>
                </div>
              </motion.div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
