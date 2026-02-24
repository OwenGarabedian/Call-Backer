import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Lock,
  Phone as PhoneIcon,
  Mail,
  Loader2,
  Settings as SettingsIcon,
  LayoutGrid,
  PhoneMissed,
  MessageSquare,
  Database,
  LayoutList,
  Layers,
  LogOut,
  Camera,
  Save,
  ShieldAlert,
  Briefcase
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

export default function ProfileSettings() {
  const location = useLocation();
  const navigate = useNavigate();
  // Safe extraction of ID with Auth Fallback
  const routeUserId = (location.state as { id?: string })?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
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
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUserId)
          .single();

        if (error) throw error;

        if (data && isMounted) {
          setFullName(data.full_name || "");
          setEmail(data.email || "");
          setPhone(data.phone_number || "");
          setBusinessName(data.business_name || "");
        }
      } catch (error) {
        console.error(error);
        alert("Could not load profile.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [routeUserId]);

  const handleSave = async () => {
    if (!activeUserId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone_number: phone,
          business_name: businessName,
        })
        .eq("id", activeUserId);

      if (error) throw error;

      navigate("/settings", { state: { id: activeUserId } });
    } catch (error) {
      console.error(error);
      alert("Could not update profile.");
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
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

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
              <h1 className="font-display text-xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-xs text-gray-500 mt-0.5">Customize your personal and business details.</p>
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
                Save Changes
              </button>
          </div>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto px-6 py-10 z-10 relative">
          
          {loading ? (
            <div className="flex items-center justify-center h-full">
               <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8 pb-10">
              
              {/* Profile Avatar Editor */}
              <motion.div 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-6 p-8 rounded-[2rem] bg-white border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative"
              >
                <div className="relative group cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 border-4 border-white shadow-sm group-hover:border-indigo-100 transition-colors overflow-hidden">
                    <span className="text-3xl font-display font-bold text-indigo-600">
                      {fullName ? fullName.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                     <Camera className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-display font-bold text-gray-900 mb-1">Profile Picture</h3>
                  <p className="text-sm text-gray-500 mb-4">Upload a new avatar. Larger images will be resized.</p>
                  <button className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 transition-colors">
                    Coming Soon
                  </button>
                </div>
              </motion.div>

              {/* Form Section */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="bg-white rounded-[2rem] border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
              >
                <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
                   <h2 className="text-lg font-display font-bold text-gray-900">Personal Information</h2>
                   <p className="text-sm text-gray-500 mt-1">This information will be displayed on your account.</p>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {/* Name Split */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">Full Name</label>
                       <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                            <User className="h-4 w-4" />
                          </div>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Jane Doe"
                            className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">Business Name</label>
                       <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                            <Briefcase className="h-4 w-4" />
                          </div>
                          <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="e.g. Acme Corp"
                            className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
                          />
                       </div>
                    </div>
                  </div>

                  <hr className="border-gray-100 my-6" />

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">Email Address</label>
                       <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <Mail className="h-4 w-4" />
                          </div>
                          <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full h-11 bg-gray-100 border border-gray-200 rounded-xl pl-11 pr-10 text-gray-500 focus:outline-none font-medium text-sm cursor-not-allowed"
                          />
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                            <Lock className="h-3.5 w-3.5" />
                          </div>
                       </div>
                       <div className="flex items-center gap-1.5 mt-2 ml-1">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                          <p className="text-[11px] text-amber-600 font-medium">Email changes require support verification.</p>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">Business Number</label>
                       <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                            <PhoneIcon className="h-4 w-4" />
                          </div>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="(555) 000-0000"
                            className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
                          />
                       </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Save Button */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end sm:hidden">
                   <button
                      onClick={handleSave}
                      disabled={saving || loading}
                      className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-sm"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Changes
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