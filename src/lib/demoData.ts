// ─── Demo Data ─────────────────────────────────────────────────────────────
// All fictional data used by the /demo route. No Supabase involved.

export const DEMO_USER = {
  full_name: "Alex Rivera",
  business_name: "Sunrise HVAC & Plumbing",
  email: "alex@sunrisehvac.com",
};

// ─── Call Logs ──────────────────────────────────────────────────────────────
export const DEMO_CALLS = [
  { id: "c1",  phone_number_calling: "+18055550192", action: "Texted",   success: true,  time: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
  { id: "c2",  phone_number_calling: "+18055550348", action: "Texted",   success: true,  time: new Date(Date.now() - 1000 * 60 * 47).toISOString() },
  { id: "c3",  phone_number_calling: "+18055550471", action: "Texted",   success: true,  time: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: "c4",  phone_number_calling: "+18055550512", action: "Answered", success: true,  time: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  { id: "c5",  phone_number_calling: "+18055550623", action: "Texted",   success: true,  time: new Date(Date.now() - 1000 * 60 * 260).toISOString() },
  { id: "c6",  phone_number_calling: "+18055550734", action: "Texted",   success: false, time: new Date(Date.now() - 1000 * 60 * 360).toISOString() },
  { id: "c7",  phone_number_calling: "+18055550845", action: "Texted",   success: true,  time: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
  { id: "c8",  phone_number_calling: "+18055550956", action: "Answered", success: true,  time: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString() },
  { id: "c9",  phone_number_calling: "+18055551067", action: "Texted",   success: true,  time: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString() },
  { id: "c10", phone_number_calling: "+18055551178", action: "Texted",   success: true,  time: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString() },
  { id: "c11", phone_number_calling: "+18055551289", action: "Texted",   success: false, time: new Date(Date.now() - 1000 * 60 * 60 * 74).toISOString() },
  { id: "c12", phone_number_calling: "+18055551390", action: "Texted",   success: true,  time: new Date(Date.now() - 1000 * 60 * 60 * 76).toISOString() },
];

// ─── Contacts / Text Profiles ───────────────────────────────────────────────
export const DEMO_PROFILES = [
  {
    id: "p1",
    caller_id: "+18055550192",
    name: "Jordan Marsh",
    need: "AC repair",
    location: "Thousand Oaks",
    appointment: "Mar 5, 2026 @ 10:00 AM",
    updated_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    isActiveLead: true,
  },
  {
    id: "p2",
    caller_id: "+18055550348",
    name: "Taylor Nguyen",
    need: "Leaky faucet",
    location: "Ventura",
    appointment: null,
    updated_at: new Date(Date.now() - 1000 * 60 * 47).toISOString(),
    isActiveLead: true,
  },
  {
    id: "p3",
    caller_id: "+18055550471",
    name: "Morgan Singh",
    need: "Furnace install",
    location: "Oxnard",
    appointment: null,
    updated_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    isActiveLead: false,
  },
  {
    id: "p4",
    caller_id: "+18055550623",
    name: "Casey Lee",
    need: "Water heater",
    location: "Camarillo",
    appointment: "Mar 7, 2026 @ 2:00 PM",
    updated_at: new Date(Date.now() - 1000 * 60 * 260).toISOString(),
    isActiveLead: true,
  },
  {
    id: "p5",
    caller_id: "+18055551067",
    name: "Riley Okonkwo",
    need: "Pipe burst",
    location: "Simi Valley",
    appointment: null,
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    isActiveLead: false,
  },
];

// ─── Messages ───────────────────────────────────────────────────────────────
// Outbound = direction "outbound-api", Inbound = direction "inbound"
const t = (minsAgo: number) => new Date(Date.now() - 1000 * 60 * minsAgo).toISOString();

export const DEMO_MESSAGES = [
  // Jordan Marsh thread
  { id: "m1",  caller_id: "+18055550192", text: "Hi! We missed your call at Sunrise HVAC. Can we help with something today?", direction: "outbound-api", status: "delivered", created_at: t(11) },
  { id: "m2",  caller_id: "+18055550192", text: "Yes! My AC stopped working this morning. Do you have availability?", direction: "inbound", status: "received", created_at: t(9) },
  { id: "m3",  caller_id: "+18055550192", text: "Absolutely! We can have a tech out tomorrow morning. Does 10 AM work?", direction: "outbound-api", status: "delivered", created_at: t(8) },
  { id: "m4",  caller_id: "+18055550192", text: "Perfect, see you then!", direction: "inbound", status: "received", created_at: t(7) },

  // Taylor Nguyen thread
  { id: "m5",  caller_id: "+18055550348", text: "Hi Taylor! We missed your call. What can we help you fix today?", direction: "outbound-api", status: "delivered", created_at: t(46) },
  { id: "m6",  caller_id: "+18055550348", text: "Got a leaky faucet in the kitchen. How much would that run?", direction: "inbound", status: "received", created_at: t(44) },
  { id: "m7",  caller_id: "+18055550348", text: "Most faucet repairs start at $85. I can book you in this week — any preference on morning or afternoon?", direction: "outbound-api", status: "delivered", created_at: t(43) },

  // Morgan Singh thread — no reply (not engaged)
  { id: "m8",  caller_id: "+18055550471", text: "Hi! We missed your call at Sunrise HVAC. Need help with something?", direction: "outbound-api", status: "delivered", created_at: t(89) },

  // Casey Lee thread
  { id: "m9",  caller_id: "+18055550623", text: "Hey Casey! Missed your call. What can we help with?", direction: "outbound-api", status: "delivered", created_at: t(259) },
  { id: "m10", caller_id: "+18055550623", text: "Need a new water heater ASAP — the old one is leaking.", direction: "inbound", status: "received", created_at: t(255) },
  { id: "m11", caller_id: "+18055550623", text: "We can do that! We install 40 and 50 gal units. Want to schedule a quote visit?", direction: "outbound-api", status: "delivered", created_at: t(253) },
  { id: "m12", caller_id: "+18055550623", text: "Yes please! Friday works best.", direction: "inbound", status: "received", created_at: t(250) },
  { id: "m13", caller_id: "+18055550623", text: "Booked for March 7th at 2 PM! See you then 👍", direction: "outbound-api", status: "delivered", created_at: t(248) },
];

// ─── Computed Stats ─────────────────────────────────────────────────────────
export const DEMO_STATS = {
  totalCalls: DEMO_CALLS.length,
  totalMessages: DEMO_MESSAGES.length,
  totalCustomers: DEMO_PROFILES.length,
  engagedPercent: Math.round(
    (DEMO_PROFILES.filter((p) => p.isActiveLead).length / DEMO_PROFILES.length) * 100
  ),
  appointments: DEMO_PROFILES.filter(
    (p) => p.appointment && p.appointment.trim() !== "" && p.appointment.toLowerCase() !== "null"
  ).length,
};
