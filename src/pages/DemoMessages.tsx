import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare, User, Send, MoreVertical, Bot, Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { DemoSidebar } from "@/components/DemoSidebar";
import { DemoBanner } from "@/components/DemoBanner";
import { DemoWalkthrough } from "@/components/DemoWalkthrough";
import { DEMO_MESSAGES } from "@/lib/demoData";

const CALLER_NAMES: Record<string, string> = {
  "8055550192": "Jordan Marsh",
  "8055550348": "Taylor Nguyen",
  "8055550471": "Morgan Singh",
  "8055550623": "Casey Lee",
  "8055551067": "Riley Okonkwo",
};

function formatPhone(num?: string) {
  if (!num) return "Unknown";
  const d = (num + "").replace(/\D/g, "");
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

function chatTime(ts?: string) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function DemoMessages() {
  const navigate = useNavigate();
  const [activeCallerId, setActiveCallerId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sort newest-first (mirrors Supabase .order("created_at", { ascending: false }))
  const sortedMessages = [...DEMO_MESSAGES].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Group messages into conversations
  const conversationsMap = new Map<string, typeof DEMO_MESSAGES>();
  sortedMessages.forEach((m) => {
    const norm = m.caller_id.replace(/\D/g, "").slice(-10);
    if (!conversationsMap.has(norm)) conversationsMap.set(norm, []);
    conversationsMap.get(norm)!.push(m);
  });

  const conversations = Array.from(conversationsMap.entries())
    .map(([norm, msgs]) => {
      const latest = msgs[0];
      return {
        normPhone: norm,
        originalPhone: latest.caller_id,
        messages: [...msgs].reverse(),
        latestMessage: latest,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.latestMessage.created_at).getTime() -
        new Date(a.latestMessage.created_at).getTime()
    );

  // Auto-select first conversation
  useEffect(() => {
    if (conversations.length > 0 && !activeCallerId) {
      setActiveCallerId(conversations[0].normPhone);
    }
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeCallerId]);

  const activeConversation = conversations.find((c) => c.normPhone === activeCallerId);

  const handleSendAttempt = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2500);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-main">
      <DemoSidebar />
      <DemoWalkthrough />

      <div className="flex-1 flex overflow-hidden flex-col">
        {/* Banner at top of the right panel */}
        <DemoBanner />

        {/* Mobile top spacer */}
        <div className="block lg:hidden h-14" />

        {/* Split pane */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: conversation list */}
          <div className={cn(
            "w-full lg:w-80 border-r border-border flex flex-col bg-foreground/[0.01]",
            activeCallerId ? "hidden lg:flex" : "flex"
          )}>
            <header className="px-5 py-4 border-b border-border flex items-center justify-between flex-shrink-0 glass-strong h-16">
              <h1 className="font-display text-lg font-bold">Inbox</h1>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {conversations.map((c) => {
                const isSelected = activeCallerId === c.normPhone;
                const displayName = CALLER_NAMES[c.normPhone] || formatPhone(c.originalPhone);
                return (
                  <button
                    key={c.normPhone}
                    onClick={() => setActiveCallerId(c.normPhone)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                      isSelected
                        ? "bg-indigo-50 border border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20 shadow-sm"
                        : "hover:bg-secondary border border-transparent"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      isSelected
                        ? "bg-indigo-500 text-white shadow-sm"
                        : "bg-white text-muted-foreground shadow-sm dark:bg-secondary dark:text-foreground"
                    )}>
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className={cn(
                          "text-sm font-bold truncate",
                          isSelected ? "text-indigo-950 dark:text-indigo-100" : "text-foreground"
                        )}>
                          {displayName}
                        </h3>
                        <span className={cn(
                          "text-[10px] font-semibold",
                          isSelected ? "text-indigo-500" : "text-muted-foreground"
                        )}>
                          {timeAgo(c.latestMessage.created_at)}
                        </span>
                      </div>
                      <p className={cn(
                        "text-xs truncate font-medium",
                        isSelected ? "text-indigo-700/80 dark:text-indigo-300" : "text-muted-foreground"
                      )}>
                        {c.latestMessage.text}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: active chat */}
          <div className={cn(
            "flex-1 flex flex-col glass-strong relative",
            activeCallerId ? "flex" : "hidden lg:flex"
          )}>
            {activeConversation ? (
              <>
                {/* Chat header */}
                <header className="px-6 py-4 border-b border-border flex items-center justify-between flex-shrink-0 h-16 bg-background/50 backdrop-blur-md z-10 sticky top-0">
                  <div className="flex items-center gap-3">
                    {/* Mobile back button */}
                    <button
                      onClick={() => setActiveCallerId(null)}
                      className="lg:hidden mr-1 w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md text-white">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-display text-base font-bold text-foreground">
                        {CALLER_NAMES[activeConversation.normPhone] || formatPhone(activeConversation.originalPhone)}
                      </h2>
                      <p className="text-xs text-muted-foreground font-medium">
                        {formatPhone(activeConversation.originalPhone)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-border">
                      <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Auto AI</span>
                      <Switch checked={true} onCheckedChange={() => {}} className="ml-1 scale-75" />
                    </div>
                    <button className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-1.5 flex flex-col">
                  {activeConversation.messages.map((msg, idx) => {
                    const isInbound =
                      msg.direction?.toLowerCase() === "inbound" ||
                      msg.status?.toLowerCase() === "received";
                    const isOutbound = !isInbound;

                    const nextMsg = activeConversation.messages[idx + 1];
                    const isNextOutbound = nextMsg
                      ? !(nextMsg.direction?.toLowerCase() === "inbound" || nextMsg.status?.toLowerCase() === "received")
                      : true;
                    const showAvatar = !isOutbound && (idx === activeConversation.messages.length - 1 || isNextOutbound);

                    const msgDate = new Date(msg.created_at).setHours(0, 0, 0, 0);
                    const prevMsgDate = idx > 0 ? new Date(activeConversation.messages[idx - 1].created_at).setHours(0, 0, 0, 0) : null;
                    const showDateSeparator = msgDate !== prevMsgDate;
                    const dateLabel = new Date(msg.created_at).toLocaleDateString([], {
                      weekday: "short", month: "short", day: "numeric",
                    });

                    return (
                      <div key={msg.id} className={cn("flex flex-col", showDateSeparator && idx > 0 ? "mt-4" : "")}>
                        {showDateSeparator && (
                          <div className="flex justify-center mb-3 mt-1">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest bg-secondary/50 px-3 py-1 rounded-full">
                              {dateLabel}
                            </span>
                          </div>
                        )}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={cn("flex max-w-[70%]", isOutbound ? "self-end justify-end" : "self-start justify-start")}
                        >
                          {!isOutbound && (
                            <div className="w-6 flex-shrink-0 mr-2 items-end flex pb-3">
                              {showAvatar && (
                                <div className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground">
                                  <User className="w-3 h-3" />
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex flex-col gap-0.5 mt-0.5">
                            <div className={cn(
                              "px-4 py-2 rounded-2xl text-[14px] leading-relaxed shadow-sm",
                              isOutbound
                                ? "bg-[#0A7CFF] text-white rounded-br-sm"
                                : "bg-white dark:bg-secondary border border-border text-foreground rounded-bl-sm"
                            )}>
                              {msg.text}
                            </div>
                            <span className={cn(
                              "text-[9px] font-medium text-muted-foreground/70",
                              isOutbound ? "self-end pr-1" : "self-start pl-1"
                            )}>
                              {chatTime(msg.created_at)}
                            </span>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                  {/* Chat Input */}
                  <div className="p-4 bg-background/50 backdrop-blur-md border-t border-border mt-auto pb-24 lg:pb-4 relative">
                  <div className="flex items-center gap-3 bg-white dark:bg-black/20 border border-border rounded-full p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSendAttempt(); }}
                      placeholder="Message… (demo mode)"
                      className="flex-1 bg-transparent px-4 py-2 outline-none text-sm text-foreground placeholder:text-muted-foreground h-10"
                    />
                    <button
                      onClick={handleSendAttempt}
                      className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white transition-all shrink-0 hover:bg-indigo-600 active:scale-95"
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>
                  {showTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-semibold px-4 py-2 rounded-xl shadow-lg whitespace-nowrap pointer-events-none"
                    >
                      Sign up to send real messages 👆
                    </motion.div>
                  )}
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
    </div>
  );
}
