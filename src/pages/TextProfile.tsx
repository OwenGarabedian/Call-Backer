import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  MessageCircle,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Mail,
  Edit3
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { cn } from "@/lib/utils";

function formatPhone(num?: string | null) {
  if (!num) return "Unknown";
  const d = ("" + num).replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  return num;
}

function normalizePhone(phone: string | null) {
  if (!phone) return "";
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;
}

interface TimelineItem {
  id: string;
  type: "call" | "message";
  date: Date;
  status?: string;
  action?: string;
  direction?: string;
  text?: string;
}

export default function TextProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = (location.state as { id?: string })?.id;
  const callerIdParam = searchParams.get("caller_id") || "";

  const [loading, setLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState<any>(null); 
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);

  const fetchData = useCallback(async () => {
    if (!userId || !callerIdParam) {
      setLoading(false);
      return;
    }

    try {
      const normPhone = normalizePhone(callerIdParam);

      const [profilesRes, logsRes, messagesRes] = await Promise.all([
        supabase.from("text_profiles").select("*").eq("user_id", userId),
        supabase.from("call_log").select("*").eq("user_id", userId),
        supabase.from("messages").select("*").eq("user_id", userId),
      ]);

      const fetchedProfiles = profilesRes.data || [];
      const logs = logsRes.data || [];
      const messages = messagesRes.data || [];

      let bestProfile = null;
      for (const p of fetchedProfiles) {
          if (normalizePhone(p.caller_id) === normPhone) {
              if (!bestProfile) bestProfile = { ...p };
              else {
                  if (p.name && p.name !== "null") bestProfile.name = p.name;
                  if (p.need && p.need !== "null") bestProfile.need = p.need;
                  if (p.location && p.location !== "null") bestProfile.location = p.location;
                  if (p.appointment && p.appointment !== "null") bestProfile.appointment = p.appointment;
              }
          }
      }
      setContactInfo(bestProfile || { caller_id: callerIdParam });

      const unifiedTimeline: TimelineItem[] = [];

      logs.forEach((log) => {
          if (normalizePhone(log.phone_number_calling) === normPhone) {
              unifiedTimeline.push({
                  id: `log-${log.id}`,
                  type: "call",
                  date: new Date(log.time || log.created_at),
                  action: log.action,
                  status: log.success ? "success" : "failed"
              });
          }
      });

      messages.forEach((msg) => {
          if (normalizePhone(msg.caller_id) === normPhone) {
              unifiedTimeline.push({
                  id: `msg-${msg.id}`,
                  type: "message",
                  date: new Date(msg.created_at),
                  direction: msg.direction,
                  text: msg.text,
                  status: msg.status
              });
          }
      });

      unifiedTimeline.sort((a, b) => b.date.getTime() - a.date.getTime());
      setTimeline(unifiedTimeline);

    } catch (error) {
      console.error("Error fetching text profile data:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, callerIdParam]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hasName = contactInfo?.name && contactInfo.name.trim() !== "" && contactInfo.name.toLowerCase() !== "null";
  const displayName = hasName ? contactInfo.name : "Unknown Caller";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      
      {/* ── HEADER ── */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 font-display tracking-tight">Contact Profile</h1>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
            <Edit3 className="w-4 h-4" /> Edit
        </button>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-8">
        {loading ? (
             <div className="flex justify-center items-center h-64">
                 <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
             </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
            {/* ── LEFT COLUMN: IDENTITY & DETAILS ── */}
            <div className="lg:col-span-4 space-y-6">
                
                {/* Identity Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center"
                >
                    <div className="w-24 h-24 mx-auto bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold font-display mb-4">
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 font-display">{displayName}</h2>
                    <p className="text-sm font-medium text-gray-500 mt-1">{formatPhone(contactInfo?.caller_id || callerIdParam)}</p>
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
                        <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-semibold text-sm hover:bg-indigo-100 transition-colors">
                            <MessageCircle className="w-4 h-4" /> Text
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">
                            <PhoneCall className="w-4 h-4" /> Call
                        </button>
                    </div>
                </motion.div>

                {/* Info Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5"
                >
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Details</h3>
                    
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Primary Need</p>
                            <p className="text-sm font-medium text-gray-900 mt-0.5">
                                {contactInfo?.need && contactInfo.need !== "null" ? contactInfo.need : <span className="italic text-gray-400">Not specified</span>}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Appointment</p>
                            <p className="text-sm font-medium text-gray-900 mt-0.5">
                                {contactInfo?.appointment && contactInfo.appointment !== "null" ? contactInfo.appointment : <span className="italic text-gray-400">Not scheduled</span>}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Location</p>
                            <p className="text-sm font-medium text-gray-900 mt-0.5">
                                {contactInfo?.location && contactInfo.location !== "null" ? contactInfo.location : <span className="italic text-gray-400">Not specified</span>}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ── RIGHT COLUMN: TIMELINE ── */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-8 min-h-[500px]"
            >
                <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-100">
                    <Clock className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-bold text-gray-900 font-display">Interaction History</h3>
                </div>

                {timeline.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <Clock className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-sm font-medium">No recorded interactions yet.</p>
                    </div>
                ) : (
                    <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 pb-4">
                        {timeline.map((item, idx) => {
                            const isCall = item.type === "call";
                            const isMsg = item.type === "message";
                            const isInbound = item.direction?.toLowerCase() === "inbound" || item.action === "answered";
                            
                            return (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + (idx * 0.05) }}
                                    key={item.id} 
                                    className="relative pl-8"
                                >
                                    {/* Timeline Node */}
                                    <div className="absolute -left-[17px] top-1 flex items-center justify-center w-8 h-8 rounded-full bg-white border-[3px] border-gray-100 shadow-sm">
                                        {isCall ? (
                                            <PhoneCall className={cn("w-3.5 h-3.5", item.status === "failed" ? "text-red-500" : "text-emerald-500")} />
                                        ) : (
                                            <MessageCircle className="w-3.5 h-3.5 text-indigo-500" />
                                        )}
                                    </div>

                                    {/* Content Box */}
                                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md",
                                                    isCall ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"
                                                )}>
                                                    {isCall ? "Call Log" : "Text"}
                                                </span>
                                                <span className="text-[11px] font-semibold text-gray-500 uppercase">
                                                    {isCall ? item.action || "Logged" : (isInbound ? "Received" : "Sent")}
                                                </span>
                                            </div>
                                            <time className="text-[11px] font-medium text-gray-400">
                                                {item.date.toLocaleDateString()} at {item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </time>
                                        </div>

                                        {isMsg && (
                                            <p className="text-sm text-gray-700 mt-2">
                                                {item.text || <span className="italic text-gray-400">Auto-reply sent</span>}
                                            </p>
                                        )}
                                        {isCall && (
                                            <div className="mt-2 flex items-center gap-1.5">
                                                {item.status === "failed" ? (
                                                    <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                                                ) : (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                )}
                                                <span className={cn("text-xs font-semibold", item.status === "failed" ? "text-red-600" : "text-emerald-600")}>
                                                    {item.status === 'failed' ? "Missed or Failed" : "Successful"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </motion.div>

          </div>
        )}
      </main>
    </div>
  );
}