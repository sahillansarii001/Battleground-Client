"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Shield, Headphones, MessageSquare, Mail, Phone, 
  AlertTriangle, CheckCircle2, Clock, Send, Copy, 
  Check, ArrowLeft, ExternalLink, HelpCircle, Radio, 
  Users, AlertOctagon, Sparkles 
} from "lucide-react";
import Footer from "@/components/common/Footer";

const SUPPORT_CATEGORIES = [
  { id: "room", label: "Match Room & Credentials (ID / Password)" },
  { id: "scoring", label: "Scoring, Kills & Points Discrepancy" },
  { id: "roster", label: "Roster Change & Substitute Verification" },
  { id: "anticheat", label: "Report Cheating / Unfair Play / Exploits" },
  { id: "device", label: "Device & Hardware Eligibility Clarification" },
  { id: "tech", label: "Technical Bug / Platform Connectivity" },
  { id: "general", label: "General Tournament Inquiry" },
];

const URGENCY_LEVELS = [
  { id: "routine", label: "Routine", desc: "Response within 12h", color: "text-[#B8C0C2] border-white/20 bg-white/5" },
  { id: "priority", label: "Priority", desc: "Match in < 4 hours", color: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10" },
  { id: "critical", label: "Critical RED", desc: "Active Lobby / In Match", color: "text-red-400 border-red-500/50 bg-red-500/15 animate-pulse" },
];

const TOP_FAQS = [
  {
    q: "When will we receive Room ID and Password?",
    a: "Room credentials are released 15-20 minutes before scheduled match start on the Captain's Dashboard and via automated email.",
    link: "/faq#room-credentials"
  },
  {
    q: "Are iPads, tablets, or emulators permitted?",
    a: "Strictly prohibited. Only standard mobile phones (smartphones) are permitted in accordance with Rule 01.",
    link: "/faq#devices"
  },
  {
    q: "Is using Self-AED / Self-Aid kit allowed?",
    a: "No. Self-AED / Self-Aid kit is strictly prohibited in all competitive rounds (Section 13) and leads to round disqualification.",
    link: "/faq#self-aid"
  },
  {
    q: "How do we report a scoring dispute?",
    a: "Lodge a dispute within 15 minutes of match conclusion with unedited end-game screenshots via this Support Desk.",
    link: "/faq#scoring-dispute"
  }
];

export default function SupportPage() {
  const [formData, setFormData] = useState({
    squadName: "",
    captainEmail: "",
    inGameId: "",
    category: "room",
    urgency: "priority",
    subject: "",
    message: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);
  const [copiedTicket, setCopiedTicket] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate cryptographic transmission and ticket generation
    setTimeout(() => {
      const generatedId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      const result = {
        id: generatedId,
        timestamp: new Date().toISOString(),
        ...formData
      };

      setTicketResult(result);
      setSubmitting(false);

      // Save ticket locally for player reference
      try {
        const stored = JSON.parse(localStorage.getItem("bgmi_support_tickets") || "[]");
        stored.unshift(result);
        localStorage.setItem("bgmi_support_tickets", JSON.stringify(stored.slice(0, 10)));
      } catch (err) {
        console.warn("Could not save to local storage", err);
      }
    }, 900);
  };

  const handleCopyTicketInfo = () => {
    if (!ticketResult) return;
    const details = `[BGMI TOURNAMENT SUPPORT DISPATCH]
Ticket ID: ${ticketResult.id}
Squad: ${ticketResult.squadName}
Captain Email: ${ticketResult.captainEmail}
In-Game ID: ${ticketResult.inGameId || "N/A"}
Category: ${ticketResult.category}
Urgency: ${ticketResult.urgency.toUpperCase()}
Subject: ${ticketResult.subject}
Message: ${ticketResult.message}`;

    navigator.clipboard.writeText(details);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2500);
  };

  const handleEmailDirect = () => {
    if (!ticketResult) return;
    const mailto = `mailto:sahilansari9967747153@gmail.com?subject=${encodeURIComponent(
      `[${ticketResult.id}] ${ticketResult.urgency.toUpperCase()}: ${ticketResult.subject} - ${ticketResult.squadName}`
    )}&body=${encodeURIComponent(
      `DISPATCH ID: ${ticketResult.id}\nSQUAD: ${ticketResult.squadName}\nCAPTAIN EMAIL: ${ticketResult.captainEmail}\nIN-GAME ID: ${ticketResult.inGameId}\nCATEGORY: ${ticketResult.category}\nURGENCY: ${ticketResult.urgency}\n\nDETAILS:\n${ticketResult.message}`
    )}`;
    window.location.href = mailto;
  };

  return (
    <div className="flex-1 min-h-screen bg-[#080A0C] text-white relative overflow-hidden flex flex-col">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-25 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[45vw] h-[45vw] bg-[#FF6A00]/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-0 w-[40vw] h-[40vw] bg-[#FF6A00]/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10 flex-1 w-full">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 font-orbitron text-xs text-[#B8C0C2] hover:text-[#FF6A00] uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Base
          </Link>

          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-xs font-orbitron text-[#FF6A00] hover:text-white uppercase tracking-wider transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Go to FAQ Database &rarr;</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FF6A00]/10 border border-[#FF6A00]/30 px-4 py-1.5 mb-5 shadow-sm shadow-[#FF6A00]/10">
            <Radio className="w-4 h-4 text-[#FF6A00] animate-pulse" />
            <span className="font-orbitron text-[11px] font-bold text-[#FF6A00] tracking-widest uppercase">
              Comms & Tactical Helpdesk // 24/7 Operations
            </span>
          </div>

          <h1 className="font-rajdhani text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 uppercase tracking-tight">
            Tournament <span className="text-[#FF6A00]">Support Command</span>
          </h1>

          <p className="font-inter text-sm sm:text-base text-[#B8C0C2] max-w-2xl mx-auto leading-relaxed">
            Direct priority dispatch line for tournament dispute mediation, match room assistance, scoring verification, and squad administration.
          </p>

          {/* Real-time Status Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-[11px] font-orbitron uppercase text-[#B8C0C2]">
            <span className="bg-[#111518] border border-[#39B54A]/30 text-[#39B54A] px-3 py-1 flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#39B54A] animate-ping"></span>
              Dispatch System: Operational
            </span>
            <span className="bg-[#111518] border border-white/10 px-3 py-1 text-white">
              Match Day Desk: Active
            </span>
            <span className="bg-[#111518] border border-[#FF6A00]/30 text-[#FF6A00] px-3 py-1 font-bold">
              Avg Response: &lt; 15 Mins
            </span>
          </div>
        </div>

        {/* Direct Emergency Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {/* Channel 1: Discord */}
          <div className="bg-[#111518]/90 border border-white/10 p-5 hud-border hover:border-[#FF6A00]/50 transition-all group">
            <div className="w-10 h-10 rounded bg-[#5865F2]/10 border border-[#5865F2]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5 text-[#5865F2]" />
            </div>
            <h3 className="font-rajdhani text-lg font-bold uppercase tracking-wider text-white mb-1">
              Official Discord
            </h3>
            <p className="text-xs text-[#B8C0C2] mb-3 leading-relaxed">
              Live referee voice channels and automated <code className="text-[#FF6A00]">#ticket-support</code> bot.
            </p>
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-orbitron text-[#5865F2] hover:text-white uppercase tracking-wider font-bold"
            >
              Join Server <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Channel 2: WhatsApp Hotline */}
          <div className="bg-[#111518]/90 border border-white/10 p-5 hud-border hover:border-[#39B54A]/50 transition-all group">
            <div className="w-10 h-10 rounded bg-[#39B54A]/10 border border-[#39B54A]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5 text-[#39B54A]" />
            </div>
            <h3 className="font-rajdhani text-lg font-bold uppercase tracking-wider text-white mb-1">
              Captains Hotline
            </h3>
            <p className="text-xs text-[#B8C0C2] mb-3 leading-relaxed">
              WhatsApp fast-track priority channel reserved for registered squad leaders.
            </p>
            <a
              href="https://wa.me/919967747153?text=BGMI%20Tournament%20Support%20Inquiry"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-orbitron text-[#39B54A] hover:text-white uppercase tracking-wider font-bold"
            >
              +91 9967747153 <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Channel 3: Official Email */}
          <div className="bg-[#111518]/90 border border-white/10 p-5 hud-border hover:border-[#FF6A00]/50 transition-all group">
            <div className="w-10 h-10 rounded bg-[#FF6A00]/10 border border-[#FF6A00]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5 text-[#FF6A00]" />
            </div>
            <h3 className="font-rajdhani text-lg font-bold uppercase tracking-wider text-white mb-1">
              Email Dispatch
            </h3>
            <p className="text-xs text-[#B8C0C2] mb-3 leading-relaxed">
              Formal protest appeals, official roster updates, and partnership inquiries.
            </p>
            <a
              href="mailto:sahilansari9967747153@gmail.com"
              className="inline-flex items-center gap-1 text-[11px] font-orbitron text-[#FF6A00] hover:text-white uppercase tracking-wider font-bold truncate max-w-full"
            >
              sahilansari9967747153@gmail.com
            </a>
          </div>

          {/* Channel 4: Rulebook & Directives */}
          <div className="bg-[#111518]/90 border border-white/10 p-5 hud-border hover:border-yellow-500/50 transition-all group">
            <div className="w-10 h-10 rounded bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5 text-yellow-500" />
            </div>
            <h3 className="font-rajdhani text-lg font-bold uppercase tracking-wider text-white mb-1">
              Official Rulebook
            </h3>
            <p className="text-xs text-[#B8C0C2] mb-3 leading-relaxed">
              14 official sections detailing devices, bootcamp restrictions & penalties.
            </p>
            <Link
              href="/rules"
              className="inline-flex items-center gap-1 text-[11px] font-orbitron text-yellow-400 hover:text-white uppercase tracking-wider font-bold"
            >
              View Directives &rarr;
            </Link>
          </div>
        </div>

        {/* Main Content Grid: Dispatch Form & Help Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Left Column: Interactive Dispatch Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#111518]/90 border border-white/10 p-6 sm:p-8 hud-border">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#FF6A00]" />
                <h2 className="font-rajdhani text-2xl font-bold uppercase tracking-wider text-white">
                  Transmit Squad Dispatch
                </h2>
              </div>
              <span className="font-mono text-[10px] text-[#B8C0C2] bg-white/5 px-2.5 py-1 border border-white/10">
                DISPATCH // SECURE
              </span>
            </div>

            {ticketResult ? (
              /* Success / Ticket Confirmation Screen */
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-[#39B54A]/10 border border-[#39B54A]/40 p-6 rounded hud-border text-center">
                  <CheckCircle2 className="w-12 h-12 text-[#39B54A] mx-auto mb-3" />
                  <h3 className="font-rajdhani text-3xl font-bold uppercase tracking-wider text-white mb-1">
                    Dispatch Successfully Logged
                  </h3>
                  <p className="text-xs font-mono text-[#B8C0C2] mb-4">
                    Your request has been routed to the active Match Referee console.
                  </p>

                  <div className="bg-black/60 border border-white/10 p-4 max-w-md mx-auto mb-4 text-left font-mono text-xs space-y-1.5">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-[#B8C0C2]">TICKET ID:</span>
                      <span className="text-[#FF6A00] font-bold text-sm">{ticketResult.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#B8C0C2]">SQUAD:</span>
                      <span className="text-white uppercase">{ticketResult.squadName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#B8C0C2]">CATEGORY:</span>
                      <span className="text-white uppercase">{ticketResult.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#B8C0C2]">PRIORITY:</span>
                      <span className={ticketResult.urgency === 'critical' ? 'text-red-400 font-bold uppercase' : 'text-yellow-400 font-bold uppercase'}>
                        {ticketResult.urgency}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleCopyTicketInfo}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 font-rajdhani font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {copiedTicket ? (
                        <>
                          <Check className="w-4 h-4 text-[#39B54A]" />
                          <span>Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-[#FF6A00]" />
                          <span>Copy Ticket Brief</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleEmailDirect}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF6A00] hover:bg-white text-black px-4 py-2 font-rajdhani font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send via Email Client</span>
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setTicketResult(null);
                      setFormData({
                        squadName: "",
                        captainEmail: "",
                        inGameId: "",
                        category: "room",
                        urgency: "priority",
                        subject: "",
                        message: ""
                      });
                    }}
                    className="text-xs font-orbitron text-[#B8C0C2] hover:text-[#FF6A00] underline uppercase tracking-wider cursor-pointer"
                  >
                    Submit Another Dispatch
                  </button>
                </div>
              </div>
            ) : (
              /* Ticket Input Form */
              <form onSubmit={handleSubmit} className="space-y-4 font-inter text-sm">
                
                {/* Squad Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-orbitron text-[#B8C0C2] uppercase tracking-wider mb-1.5">
                      Squad / Team Name <span className="text-[#FF6A00]">*</span>
                    </label>
                    <input
                      type="text"
                      name="squadName"
                      required
                      value={formData.squadName}
                      onChange={handleChange}
                      placeholder="e.g. TEAM SOUL / GODLIKE"
                      className="w-full bg-[#080A0C] border border-white/15 px-3.5 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF6A00] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-orbitron text-[#B8C0C2] uppercase tracking-wider mb-1.5">
                      Captain / Contact Email <span className="text-[#FF6A00]">*</span>
                    </label>
                    <input
                      type="email"
                      name="captainEmail"
                      required
                      value={formData.captainEmail}
                      onChange={handleChange}
                      placeholder="captain@squad.com"
                      className="w-full bg-[#080A0C] border border-white/15 px-3.5 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF6A00] transition-colors"
                    />
                  </div>
                </div>

                {/* BGMI In-Game ID & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-orbitron text-[#B8C0C2] uppercase tracking-wider mb-1.5">
                      BGMI Character UID / IGN
                    </label>
                    <input
                      type="text"
                      name="inGameId"
                      value={formData.inGameId}
                      onChange={handleChange}
                      placeholder="e.g. 5123456789 (CLUTCH)"
                      className="w-full bg-[#080A0C] border border-white/15 px-3.5 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF6A00] transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-orbitron text-[#B8C0C2] uppercase tracking-wider mb-1.5">
                      Issue Category <span className="text-[#FF6A00]">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-[#080A0C] border border-white/15 px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF6A00] transition-colors cursor-pointer"
                    >
                      {SUPPORT_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id} className="bg-[#111518] text-white">
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Urgency Level Selector */}
                <div>
                  <label className="block text-xs font-orbitron text-[#B8C0C2] uppercase tracking-wider mb-1.5">
                    Operational Priority Level
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {URGENCY_LEVELS.map((lvl) => {
                      const isSelected = formData.urgency === lvl.id;
                      return (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, urgency: lvl.id }))}
                          className={`p-2.5 text-left border transition-all cursor-pointer ${
                            isSelected 
                              ? `${lvl.color} border-current ring-1 ring-current` 
                              : "border-white/10 bg-black/40 text-[#B8C0C2] hover:border-white/30"
                          }`}
                        >
                          <div className="font-rajdhani font-bold uppercase tracking-wider text-sm flex items-center justify-between">
                            <span>{lvl.label}</span>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-current"></span>}
                          </div>
                          <div className="text-[10px] text-[#B8C0C2] opacity-80 mt-0.5 font-mono">{lvl.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-orbitron text-[#B8C0C2] uppercase tracking-wider mb-1.5">
                    Subject Brief <span className="text-[#FF6A00]">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Room ID Not Received for Slot 12 Match 3"
                    className="w-full bg-[#080A0C] border border-white/15 px-3.5 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF6A00] transition-colors"
                  />
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-xs font-orbitron text-[#B8C0C2] uppercase tracking-wider mb-1.5">
                    Detailed Message & Evidence Links <span className="text-[#FF6A00]">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Provide full match details, screenshot drive link if disputing points, and timestamp..."
                    className="w-full bg-[#080A0C] border border-white/15 p-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF6A00] transition-colors resize-none leading-relaxed"
                  />
                  <p className="text-[11px] text-[#B8C0C2] mt-1 font-mono">
                    For screenshots/videos, paste an accessible Google Drive, Imgur, or YouTube unlisted link.
                  </p>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold text-base uppercase tracking-widest py-3.5 transition-all shadow-lg shadow-[#FF6A00]/25 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Radio className="w-5 h-5 animate-spin" />
                        <span>Transmitting Dispatch...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Submit Priority Dispatch</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Match Day Advisory & Quick FAQ (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Match Day Urgent Advisory Card */}
            <div className="bg-red-500/10 border border-red-500/30 p-6 hud-border">
              <div className="flex items-center gap-2 mb-3">
                <AlertOctagon className="w-5 h-5 text-red-500" />
                <h3 className="font-rajdhani text-xl font-bold uppercase tracking-wider text-red-400">
                  Match Day Protocol Warning
                </h3>
              </div>
              <p className="text-xs text-[#B8C0C2] leading-relaxed mb-3">
                If your assigned match is scheduled to start in <strong>under 15 minutes</strong> and you have not received Room credentials:
              </p>
              <ul className="text-xs text-[#B8C0C2] space-y-2 font-mono list-disc list-inside">
                <li>Check your Captain Dashboard at <code className="text-[#FF6A00]">/panel/dashboard</code></li>
                <li>Verify your spam/junk folder for automated credentials</li>
                <li>Reach out immediately on WhatsApp Hotline: <span className="text-white font-bold">+91 9967747153</span></li>
                <li>Do NOT enter unauthorized slots once inside room</li>
              </ul>
            </div>

            {/* Quick FAQ Accordion Teaser */}
            <div className="bg-[#111518]/90 border border-white/10 p-6 hud-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#FF6A00]" />
                  <h3 className="font-rajdhani text-lg font-bold uppercase tracking-wider text-white">
                    Common Resolutions
                  </h3>
                </div>
                <Link
                  href="/faq"
                  className="text-[10px] font-orbitron text-[#FF6A00] hover:text-white uppercase tracking-wider"
                >
                  View All &rarr;
                </Link>
              </div>

              <div className="space-y-3">
                {TOP_FAQS.map((faq, idx) => (
                  <div key={idx} className="bg-black/40 border border-white/5 p-3 rounded">
                    <p className="font-rajdhani font-bold text-sm text-white mb-1">
                      {faq.q}
                    </p>
                    <p className="text-xs text-[#B8C0C2] leading-relaxed mb-1.5">
                      {faq.a}
                    </p>
                    <Link
                      href={faq.link}
                      className="text-[10px] font-orbitron text-[#FF6A00] hover:underline uppercase tracking-widest inline-block"
                    >
                      Read Protocol Directives &rarr;
                    </Link>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/faq"
                  className="w-full inline-block bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 text-xs font-orbitron uppercase tracking-widest transition-colors text-center"
                >
                  Explore Complete 15+ FAQ Intel
                </Link>
              </div>
            </div>

            {/* SLA Guarantee Box */}
            <div className="bg-[#111518]/60 border border-white/10 p-4 text-center font-mono text-[11px] text-[#B8C0C2] flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-[#FF6A00]" />
              <span>Official Support SLA: Routine &lt; 12h • Match Day &lt; 15 mins</span>
            </div>

          </div>
        </div>

      </div>

      {/* Shared Tactical Footer */}
      <Footer />
    </div>
  );
}

