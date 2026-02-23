import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
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
  MessageCircle,
  CalendarDays,
  Clock,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

const NAV = [
  { icon: LayoutGrid, label: "Dashboard", to: "/dashboard" },
  { icon: PhoneMissed, label: "Missed Calls", to: "/calls" },
  { icon: MessageSquare, label: "Messages", to: "/messages" },
  { icon: Database, label: "Database", to: "/database" },
  { icon: LayoutList, label: "Control Center", to: "/control-center" },
  { icon: Layers, label: "Billing", to: "/payment" },
  { icon: SettingsIcon, label: "Settings", to: "/settings" },
];

const DAYS = [
  { key: "mon", label: "Mon", isWeekday: true },
  { key: "tue", label: "Tue", isWeekday: true },
  { key: "wed", label: "Wed", isWeekday: true },
  { key: "thu", label: "Thu", isWeekday: true },
  { key: "fri", label: "Fri", isWeekday: true },
  { key: "sat", label: "Sat", isWeekday: false },
  { key: "sun", label: "Sun", isWeekday: false },
];

function RoutingSchedule({ schedule, onUpdate }: { schedule: any; onUpdate: (newSchedule: any) => void }) {
  const [expanded, setExpanded] = useState(true);

  const getDayData = (key: string, isWeekday: boolean) => {
    if (schedule && schedule[key]) return schedule[key];
    return {
      closed: !isWeekday,
      timeframes: [{ start: "09:00", end: "17:00", route_number: "" }],
    };
  };

  const toggleDayClosed = (key: string, isWeekday: boolean) => {
    const day = getDayData(key, isWeekday);
    const updatedDay = { ...day, closed: !day.closed };
    onUpdate({ ...schedule, [key]: updatedDay });
  };

  const addTimeframe = (key: string, isWeekday: boolean) => {
    const day = getDayData(key, isWeekday);
    const currentFrames = day.timeframes || [];
    const newFrames = [...currentFrames, { start: "12:00", end: "13:00", route_number: "" }];
    onUpdate({ ...schedule, [key]: { ...day, timeframes: newFrames } });
  };

  const removeTimeframe = (key: string, index: number, isWeekday: boolean) => {
    const day = getDayData(key, isWeekday);
    const newFrames = [...day.timeframes];
    newFrames.splice(index, 1);
    onUpdate({ ...schedule, [key]: { ...day, timeframes: newFrames } });
  };

  const updateTimeframe = (key: string, index: number, field: string, value: string, isWeekday: boolean) => {
    const day = getDayData(key, isWeekday);
    const newFrames = [...day.timeframes];
    newFrames[index] = { ...newFrames[index], [field]: value };
    onUpdate({ ...schedule, [key]: { ...day, timeframes: newFrames } });
  };

  return (
    <div className="bg-white rounded-[2rem] border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mt-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 md:p-8 border-b border-gray-100 bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
      >
        <div className="text-left">
          <h2 className="text-lg font-display font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            Weekly Routing Schedule
          </h2>
          <p className="text-sm text-gray-500 mt-1">Configure your business hours.</p>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 md:p-8 space-y-6">
              {DAYS.map((item) => {
                const dayData = getDayData(item.key, item.isWeekday);
                const isOpen = !dayData.closed;
                const frames = dayData.timeframes?.length > 0 
                  ? dayData.timeframes 
                  : [{ start: dayData.open || "09:00", end: dayData.close || "17:00", route_number: dayData.route_to_number || "" }];

                return (
                  <div key={item.key} className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                    {/* Header Row */}
                    <div className="flex items-center justify-between p-4 bg-gray-50/50 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors",
                          isOpen ? "bg-indigo-600 text-white shadow-sm" : "bg-gray-200 text-gray-500"
                        )}>
                          {item.label}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {isOpen ? "Active" : "Closed"}
                        </span>
                      </div>
                      <Switch 
                        checked={isOpen}
                        onCheckedChange={() => toggleDayClosed(item.key, item.isWeekday)}
                      />
                    </div>

                    {/* Timeframes */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="p-4 space-y-4"
                        >
                          {frames.map((frame: any, idx: number) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                              <div className="flex flex-1 items-center gap-3">
                                <div className="space-y-1.5 flex-1">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">From</label>
                                  <input 
                                    type="text"
                                    value={frame.start}
                                    onChange={(e) => updateTimeframe(item.key, idx, "start", e.target.value, item.isWeekday)}
                                    placeholder="09:00"
                                    className="w-full h-10 bg-white border border-gray-200 rounded-lg px-3 text-sm text-center font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                  />
                                </div>
                                <span className="text-gray-400 mt-5">-</span>
                                <div className="space-y-1.5 flex-1">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">To</label>
                                  <input 
                                    type="text"
                                    value={frame.end}
                                    onChange={(e) => updateTimeframe(item.key, idx, "end", e.target.value, item.isWeekday)}
                                    placeholder="17:00"
                                    className="w-full h-10 bg-white border border-gray-200 rounded-lg px-3 text-sm text-center font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                  />
                                </div>
                              </div>
                              
                              <div className="flex-1 space-y-1.5 flex flex-row sm:flex-col justify-end sm:justify-start items-center sm:items-stretch gap-2 sm:gap-0">
                                <label className="hidden sm:block text-[10px] font-bold uppercase tracking-wider text-gray-500 border-none">Custom Number (Optional)</label>
                                <div className="flex w-full gap-2">
                                  <input 
                                    type="text"
                                    value={frame.route_number || ""}
                                    onChange={(e) => updateTimeframe(item.key, idx, "route_number", e.target.value, item.isWeekday)}
                                    placeholder="Number..."
                                    className="flex-1 h-10 bg-white border border-gray-200 rounded-lg px-3 text-sm font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                  />
                                  {frames.length > 1 && (
                                    <button 
                                      onClick={() => removeTimeframe(item.key, idx, item.isWeekday)}
                                      className="h-10 w-10 shrink-0 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          <button
                            onClick={() => addTimeframe(item.key, item.isWeekday)}
                            className="w-full h-10 border-2 border-dashed border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Timeframe
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


export default function AutomationConfig() {
  const location = useLocation();
  const navigate = useNavigate();
  // Safe extraction of ID with Auth Fallback
  const routeUserId = (location.state as { id?: string })?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);

  const [settings, setSettings] = useState({
    forwarding_number: "",
    backup_number: "",
    calendar_link: "",
    auto_reply_message: "",
    routing_custom: false,
    custom_business_hours: {},
    cal_api_key: "",
  });

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
          supabase.from("user_settings").select("*").eq("user_id", currentUserId).single()
        ]);

        if (isMounted) {
          if (profRes.data) setProfileData(profRes.data);
          if (setRes.data) {
            setSettings({
              forwarding_number: setRes.data.forwarding_number || "",
              backup_number: setRes.data.backup_number || "",
              calendar_link: setRes.data.calendar_link || "",
              auto_reply_message: setRes.data.auto_reply_message || "",
              routing_custom: setRes.data.routing_custom || false,
              custom_business_hours: setRes.data.custom_business_hours || {},
              cal_api_key: setRes.data.cal_api_key || "",
            });
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

  const updateSetting = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const onPhoneNumberChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 10) cleaned = cleaned.substring(0, 10);

    let styledNumber = cleaned;
    if (cleaned.length > 6) {
      styledNumber = `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
    } else if (cleaned.length > 3) {
      styledNumber = `(${cleaned.substring(0, 3)}) ${cleaned.substring(3)}`;
    } else if (cleaned.length > 0) {
      styledNumber = `(${cleaned}`;
    }

    if (cleaned.length === 10 || cleaned.length === 0) setPhoneError(null);
    else setPhoneError("Enter a valid 10-digit number");

    updateSetting("forwarding_number", styledNumber);
  };

  const handleSave = async () => {
    if (!activeUserId) return;
    if (phoneError) {
      alert("Please fix the errors before saving.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from("user_settings")
        .upsert({ user_id: activeUserId, ...settings });
      if (error) throw error;
      navigate("/settings", { state: { id: activeUserId } });
    } catch (error) {
      console.error(error);
      alert("Could not save settings.");
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
      <aside
        className="hidden lg:flex flex-col w-60 h-full border-r border-white/10 flex-shrink-0"
        style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)" }}
      >
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
            <PhoneIcon className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
          </div>
          <span className="font-display text-sm font-bold tracking-tight text-white">Call Backer</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV.map(({ icon: Icon, label, to }) => (
            <button
              key={to}
              onClick={() => go(to)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left",
                location.pathname === to || (to === "/settings" && location.pathname === "/automationConfig")
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/50 hover:text-white hover:bg-white/8"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-white">{profileData?.full_name || "—"}</p>
              <p className="text-xs text-white/50 truncate">{profileData?.email || "—"}</p>
            </div>
            <LogOut onClick={handleLogout} className="w-4 h-4 text-white/30 flex-shrink-0 hover:text-red-400 transition-colors" />
          </div>
        </div>
      </aside>

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
              <h1 className="font-display text-xl font-bold text-gray-900">Automation</h1>
              <p className="text-xs text-gray-500 mt-0.5">Configure routing, messaging, and schedules.</p>
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
               <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8 pb-10">
              
              {/* Call Routing Section */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-[2rem] border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
              >
                <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
                   <h2 className="text-lg font-display font-bold text-gray-900 flex items-center gap-2">
                      <PhoneIcon className="w-5 h-5 text-indigo-500" />
                      Call Routing
                   </h2>
                   <p className="text-sm text-gray-500 mt-1">Manage where your incoming calls are directed.</p>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">Primary Forwarding Number</label>
                       <div className="relative group">
                          <input
                            type="tel"
                            value={settings.forwarding_number}
                            onChange={(e) => onPhoneNumberChange(e.target.value)}
                            placeholder="(555) 000-0000"
                            className={cn(
                                "w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm",
                                phoneError && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            )}
                          />
                          {phoneError && <p className="text-[10px] text-red-500 ml-1 mt-1">{phoneError}</p>}
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">Backup Number (Failover)</label>
                       <div className="relative group">
                          <input
                            type="tel"
                            value={settings.backup_number}
                            onChange={(e) => updateSetting("backup_number", e.target.value)}
                            placeholder="Optional backup line"
                            className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
                          />
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Messaging Settings */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="bg-white rounded-[2rem] border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
              >
                <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
                   <h2 className="text-lg font-display font-bold text-gray-900 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-emerald-500" />
                      Message Settings
                   </h2>
                   <p className="text-sm text-gray-500 mt-1">Configure auto-replies for missed calls.</p>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">Standard Text Back Message</label>
                    <textarea
                        value={settings.auto_reply_message}
                        onChange={(e) => updateSetting("auto_reply_message", e.target.value)}
                        placeholder="Sorry we missed you! How can we help?"
                        className="w-full h-24 bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-sm resize-none"
                    />
                    <p className="text-[10px] text-gray-400 ml-1">Best practice is to include your business name.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">Booking / Calendar Link</label>
                    <input
                        type="url"
                        value={settings.calendar_link}
                        onChange={(e) => updateSetting("calendar_link", e.target.value)}
                        placeholder="https://calendly.com/..."
                        className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-sm"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Calendar Connection */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="bg-white rounded-[2rem] border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
              >
                <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
                   <h2 className="text-lg font-display font-bold text-gray-900 flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-rose-500" />
                      Calendar Connection
                   </h2>
                   <p className="text-sm text-gray-500 mt-1">Link your current calendar and copy API key.</p>
                </div>

                <div className="p-6 md:p-8 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">Cal.com API Key</label>
                    <input
                        type="text"
                        value={settings.cal_api_key}
                        onChange={(e) => updateSetting("cal_api_key", e.target.value)}
                        placeholder="cal_..."
                        className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-sm"
                    />
                  </div>
                  <a 
                    href="https://app.cal.com/settings/developer/api-keys" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex h-8 items-center justify-center rounded-lg bg-gray-100 px-4 text-[10px] font-bold tracking-wider text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    GET KEY ↗
                  </a>
                </div>
              </motion.div>

              {/* Schedule / Availability Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="bg-white rounded-[2rem] border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-6 md:p-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-display font-bold text-gray-900">Enable Custom Schedule</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {settings.routing_custom ? "Using specific hours & routing." : "Active 24/7 (Always On)."}
                    </p>
                  </div>
                  <Switch
                    checked={settings.routing_custom}
                    onCheckedChange={(val) => updateSetting("routing_custom", val)}
                  />
                </div>
              </motion.div>

              <AnimatePresence>
                {settings.routing_custom && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <RoutingSchedule 
                      schedule={settings.custom_business_hours || {}} 
                      onUpdate={(newSchedule) => updateSetting("custom_business_hours", newSchedule)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
