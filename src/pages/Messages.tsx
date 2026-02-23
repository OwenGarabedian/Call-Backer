import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PhoneMissed,
  MessageSquare,
  Database,
  LayoutList,
  Settings,
  LayoutGrid,
  Layers,
  Phone,
  LogOut,
  Bell,
  User,
  Send,
  MoreVertical,
  Bot
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch"; // Assuming shadcn switch exists

// Types
interface MessageItem {
  id: string | number;
  caller_id: string;
  text: string;
  direction?: string;
  status?: string;
  created_at: string;
  user_id: string;
}

interface Profile {
  id: string;
  email: string;
  full_name: string;
  business_name?: string;
  phone_number?: string;
}

const NAV = [
  { icon: LayoutGrid, label: "Dashboard", to: "/dashboard" },
  { icon: PhoneMissed, label: "Missed Calls", to: "/calls" },
  { icon: MessageSquare, label: "Messages", to: "/messages" },
  { icon: Database, label: "Database", to: "/database" },
  { icon: LayoutList, label: "Control Center", to: "/control-center" },
  { icon: Layers, label: "Billing", to: "/payment" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

function formatPhone(num?: string) {
  if (!num) return "Unknown";
  const d = ("" + num).replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  return num;
}

function timeAgo(ts?: string) {
  if (!ts) return "";
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function ChatMessageTime(ts?: string) {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function Messages() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = (location.state as { id?: string })?.id;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  // Data
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [callerNames, setCallerNames] = useState<Record<string, string>>({});
  const [blacklist, setBlacklist] = useState<Set<string>>(new Set());
  
  // UI State
  const [activeCallerId, setActiveCallerId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const go = (path: string) => navigate(path, { state: { id: userId } });

  const fetchData = useCallback(async () => {
    if (!userId) return;

    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (profileData) setProfile(profileData);

      const [msgsRes, profilesRes, blacklistRes] = await Promise.all([
        supabase
          .from("messages")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
        supabase.from("text_profiles").select("caller_id, name").eq("user_id", userId),
        supabase.from("blacklist").select("caller_id").eq("user_id", userId),
      ]);

      if (msgsRes.data) setMessages(msgsRes.data);

      const fetchedProfiles = profilesRes.data ?? [];
      const namesMap: Record<string, string> = {};
      fetchedProfiles.forEach((p) => {
        const d = (p.caller_id ?? "").replace(/\D/g, "");
        const norm = d.length >= 10 ? d.slice(-10) : d;
        if (norm && p.name) namesMap[norm] = p.name;
      });
      setCallerNames(namesMap);

      const blockedSet = new Set<string>();
      (blacklistRes.data ?? []).forEach(b => {
        const d = (b.caller_id ?? "").replace(/\D/g, "");
        const norm = d.length >= 10 ? d.slice(-10) : d;
        blockedSet.add(norm);
      });
      setBlacklist(blockedSet);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();

    if (!userId) return;
    const msgSub = supabase
      .channel(`msg-channel-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `user_id=eq.${userId}` },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(msgSub);
    };
  }, [userId, fetchData]);

  // Group messages into conversations
  const conversationsMap = new Map<string, MessageItem[]>();
  messages.forEach(m => {
      if(!m.caller_id) return;
      const d = m.caller_id.replace(/\D/g, "");
      const norm = d.length >= 10 ? d.slice(-10) : d;
      
      if(!conversationsMap.has(norm)) conversationsMap.set(norm, []);
      conversationsMap.get(norm)!.push(m);
  });
  
  // Sort conversations by latest message
  const conversations = Array.from(conversationsMap.entries()).map(([norm, msgs]) => {
      // msgs are already sorted descending by created_at from DB
      return {
          normPhone: norm,
          originalPhone: msgs[0].caller_id,
          messages: msgs.reverse(), // Reverse to have oldest first for chat view
          latestMessage: msgs[0] // Because it was descending, 0 is the newest
      }
  }).sort((a, b) => new Date(b.latestMessage.created_at).getTime() - new Date(a.latestMessage.created_at).getTime());

  // Auto-select first conversation if none selected
  useEffect(() => {
      if (!loading && conversations.length > 0 && !activeCallerId) {
          setActiveCallerId(conversations[0].normPhone);
      }
  }, [loading, conversations, activeCallerId]);

  // Scroll to bottom when active conversation changes or new message arrives
  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeCallerId, messages]);

  
  const toggleAutoText = async (normPhone: string, originalPhone: string, isCurrentlyOn: boolean) => {
      const newBlockedSet = new Set(blacklist);
      
      try {
          if (isCurrentlyOn) {
              // Turn OFF -> Add to blacklist
              newBlockedSet.add(normPhone);
              setBlacklist(newBlockedSet); // optimistic update
              await supabase.from("blacklist").insert({ user_id: userId, caller_id: originalPhone });
          } else {
              // Turn ON -> Remove from blacklist
              newBlockedSet.delete(normPhone);
              setBlacklist(newBlockedSet); // optimistic update
              await supabase.from("blacklist").delete().match({ user_id: userId, caller_id: originalPhone });
          }
      } catch (err) {
          console.error("Failed to toggle auto text", err);
          fetchData(); // revert
      }
  };

  const callN8nWebhook = async (targetNumber: string, textMessage: string) => {
    const webhookUrl = "https://owengarabedian9.app.n8n.cloud/webhook/3638addd-9a2b-4b60-a414-1d4df7bfe142";
    try {
      await fetch(webhookUrl, {
        method: "POST",
        body: JSON.stringify({
            user: userId,
            target_number: targetNumber,
            textMessage: textMessage
        }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error calling webhook:", error);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeCallerId) return;
    
    const activeConvo = conversations.find(c => c.normPhone === activeCallerId);
    if(!activeConvo) return;
    
    const textToSend = inputMessage;
    setInputMessage("");
    
    // Optimistic UI update could go here, but realtime sync usually catches it fast enough
    
    callN8nWebhook(activeConvo.originalPhone, textToSend);
  };

  const activeConversation = conversations.find(c => c.normPhone === activeCallerId);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-main">
      {/* ── SIDEBAR ── */}
      <aside
        className="hidden lg:flex flex-col w-60 h-full border-r border-white/10 flex-shrink-0"
        style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)" }}
      >
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
            <Phone className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
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
                location.pathname === to
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
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-white">{profile?.full_name ?? "—"}</p>
              <p className="text-xs text-white/50 truncate">{profile?.email ?? "—"}</p>
            </div>
            <LogOut className="w-4 h-4 text-white/30 flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT (SPLIT PANE) ── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANE: Conversation List */}
        <div className="w-80 border-r border-border flex flex-col bg-foreground/[0.01]">
            <header className="px-5 py-4 border-b border-border flex items-center justify-between flex-shrink-0 glass-strong h-16">
                <h1 className="font-display text-lg font-bold">Inbox</h1>
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground cursor-pointer">
                    <MessageSquare className="w-4 h-4" />
                </div>
            </header>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {loading && conversations.length === 0 ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">Loading...</div>
                ) : conversations.length === 0 ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">No messages found.</div>
                ) : (
                    conversations.map((c) => {
                        const isSelected = activeCallerId === c.normPhone;
                        const displayName = callerNames[c.normPhone] || formatPhone(c.originalPhone);
                        
                        return (
                            <button 
                                key={c.normPhone}
                                onClick={() => setActiveCallerId(c.normPhone)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                                    isSelected ? "bg-indigo-50 border border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20 shadow-sm" : "hover:bg-secondary border border-transparent"
                                )}
                            >
                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", isSelected ? "bg-indigo-500 text-white shadow-sm" : "bg-white text-muted-foreground shadow-sm dark:bg-secondary dark:text-foreground")}>
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h3 className={cn("text-sm font-bold truncate", isSelected ? "text-indigo-950 dark:text-indigo-100" : "text-foreground")}>{displayName}</h3>
                                        <span className={cn("text-[10px] font-semibold", isSelected ? "text-indigo-500" : "text-muted-foreground")}>{timeAgo(c.latestMessage.created_at)}</span>
                                    </div>
                                    <p className={cn("text-xs truncate font-medium", isSelected ? "text-indigo-700/80 dark:text-indigo-300" : "text-muted-foreground")}>
                                        {c.latestMessage.text || "Auto-reply sent"}
                                    </p>
                                </div>
                            </button>
                        )
                    })
                )}
            </div>
        </div>

        {/* RIGHT PANE: Active Chat */}
        <div className="flex-1 flex flex-col glass-strong relative">
            {activeConversation ? (
                <>
                    {/* Chat Header */}
                    <header className="px-6 py-4 border-b border-border flex items-center justify-between flex-shrink-0 h-16 bg-background/50 backdrop-blur-md z-10 sticky top-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md text-white">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="font-display text-base font-bold text-foreground">
                                    {callerNames[activeConversation.normPhone] || formatPhone(activeConversation.originalPhone)}
                                </h2>
                                {callerNames[activeConversation.normPhone] && (
                                    <p className="text-xs text-muted-foreground font-medium">{formatPhone(activeConversation.originalPhone)}</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-border">
                                <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Auto AI</span>
                                <Switch 
                                    checked={!blacklist.has(activeConversation.normPhone)}
                                    // Make sure you have a standard shadcn Switch component that accepts `checked` and `onCheckedChange`
                                    onCheckedChange={() => toggleAutoText(activeConversation.normPhone, activeConversation.originalPhone, !blacklist.has(activeConversation.normPhone))}
                                    className="ml-1 scale-75"
                                />
                            </div>
                            <button className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                    </header>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
                        {activeConversation.messages.map((msg, idx) => {
                            const isOutbound = 
                                (msg.direction && msg.direction.toLowerCase().includes("outbound")) || 
                                (msg.status && ["sent", "delivered", "undelivered", "failed"].includes(msg.status.toLowerCase()));
                                
                            const showAvatar = !isOutbound && (idx === activeConversation.messages.length - 1 || 
                                (activeConversation.messages[idx+1]?.direction && activeConversation.messages[idx+1].direction!.toLowerCase().includes("outbound")));
                            
                            return (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    key={msg.id} 
                                    className={cn("flex max-w-[70%]", isOutbound ? "self-end justify-end" : "self-start justify-start")}
                                >
                                    {!isOutbound && (
                                        <div className="w-6 flex-shrink-0 mr-2 items-end flex pb-1">
                                            {showAvatar && (
                                                <div className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground">
                                                    <User className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    <div className="flex flex-col gap-1">
                                        <div 
                                            className={cn(
                                                "px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed relative group", 
                                                isOutbound 
                                                    ? "bg-[#0A7CFF] text-white rounded-br-sm shadow-sm" 
                                                    : "bg-white dark:bg-secondary border border-border text-foreground rounded-bl-sm shadow-sm"
                                            )}
                                        >
                                            {msg.text || "Auto-reply sent"}
                                            
                                            {/* Hover Timestamp */}
                                            <span className={cn(
                                                "absolute top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity font-medium",
                                                isOutbound ? "-left-12 pr-2" : "-right-12 pl-2"
                                            )}>
                                                {ChatMessageTime(msg.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-background/50 backdrop-blur-md border-t border-border mt-auto">
                        <div className="flex items-center gap-3 bg-white dark:bg-black/20 border border-border rounded-full p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                            <input 
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => { if(e.key === 'Enter') handleSendMessage() }}
                                placeholder="Message..."
                                className="flex-1 bg-transparent px-4 py-2 outline-none text-sm text-foreground placeholder:text-muted-foreground h-10"
                            />
                            <button 
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim()}
                                className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white disabled:opacity-50 disabled:bg-secondary disabled:text-muted-foreground transition-all shrink-0 hover:bg-indigo-600 active:scale-95"
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                    <div className="w-16 h-16 rounded-3xl bg-secondary/50 flex items-center justify-center mb-4">
                        <MessageSquare className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="font-semibold text-sm">Select a conversation</p>
                    <p className="text-xs opacity-60">to view messages and respond</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
