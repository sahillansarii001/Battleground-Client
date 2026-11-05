"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  HelpCircle, Search, ChevronDown, ChevronUp, Shield, 
  ArrowLeft, MessageSquare, AlertTriangle, CheckCircle2, 
  Copy, Check, ExternalLink, Flame, Users, Radio, 
  Headphones, Sparkles, Filter 
} from "lucide-react";
import Footer from "@/components/common/Footer";

const FAQ_CATEGORIES = [
  { id: "ALL", label: "All Directives" },
  { id: "REGISTRATION", label: "Registration & Roster" },
  { id: "MATCHDAY", label: "Match Day & Rooms" },
  { id: "DEVICES", label: "Devices & Fair Play" },
  { id: "SCORING", label: "Scoring & Points" },
  { id: "TECHNICAL", label: "Technical Issues" },
  { id: "BOOTCAMP", label: "Bootcamp & Comms" },
];

const FAQ_ITEMS = [
  {
    id: "registration-flow",
    category: "REGISTRATION",
    categoryLabel: "Registration & Roster",
    question: "How do I register our squad for official tournaments?",
    answer: "Captains can register their squad by clicking 'Register' in the top navigation. You will need your Squad Name, Team Tag, Captain's verified email and WhatsApp number, along with the BGMI In-Game Names (IGN) and character UIDs for all 4 primary players and optional 1 substitute.",
    ruleRef: "Rule 06: Team & Player Rules",
    ruleLink: "/rules#section-6",
    highlight: "All players must be registered under their active personal BGMI accounts."
  },
  {
    id: "unregistered-players",
    category: "REGISTRATION",
    categoryLabel: "Registration & Roster",
    question: "Can our squad participate with an unregistered player or substitute?",
    answer: "Strictly prohibited. In accordance with Rule 06, no unregistered players may play in place of registered squad members. Ringers, account sharers, or unregistered stand-ins will lead to the immediate disqualification of your entire team.",
    ruleRef: "Rule 06: Team & Player Rules",
    ruleLink: "/rules#section-6",
    highlight: "Zero tolerance for unverified stand-ins or account sharing."
  },
  {
    id: "roster-locks",
    category: "REGISTRATION",
    categoryLabel: "Registration & Roster",
    question: "Can players switch squads or change in-game IDs during tournament stages?",
    answer: "No. Team rosters and in-game identities are strictly locked once tournament brackets are generated. Players cannot change squads during an active tournament, nor play for two teams simultaneously.",
    ruleRef: "Rule 06 & Rule 13",
    ruleLink: "/rules#section-6",
    highlight: "Rosters lock 24 hours prior to Stage 1 lobby launches."
  },
  {
    id: "captain-responsibilities",
    category: "REGISTRATION",
    categoryLabel: "Registration & Roster",
    question: "What are the team captain's mandatory responsibilities on match days?",
    answer: "The Team Captain is the sole authorized communication point between the organizers and the squad. Captains must ensure all 4 operators have updated BGMI clients, are seated in their assigned slot, and submit end-game summary screenshots if requested.",
    ruleRef: "Rule 01 & Rule 14",
    ruleLink: "/rules#section-14",
    highlight: "Captains must be reachable on WhatsApp and in-game lobby."
  },
  {
    id: "room-credentials",
    category: "MATCHDAY",
    categoryLabel: "Match Day & Rooms",
    question: "When and where are Room ID and Password distributed?",
    answer: "Room credentials are systematically distributed 15 to 20 minutes prior to scheduled match time. Captains can access credentials on their Squad Dashboard (/panel/dashboard) and via automated email. Sharing Room ID or Password with outsiders leads to permanent disqualification.",
    ruleRef: "Rule 04: Match & Room Rules",
    ruleLink: "/rules#section-4",
    highlight: "Credentials are confidential to registered participating squads only."
  },
  {
    id: "slot-bootcamp-allocation",
    category: "MATCHDAY",
    categoryLabel: "Match Day & Rooms",
    question: "What is our assigned Slot / Bootcamp number?",
    answer: "Every squad is allocated a specific Slot / Bootcamp Number announced on the match schedule. Under Rule 03, your team must remain strictly in your assigned slot. Entering another team's slot causes room delays and will result in point penalties or room kicks.",
    ruleRef: "Rule 03: Slot & Bootcamp Allocation",
    ruleLink: "/rules#section-3",
    highlight: "Your assigned slot is your only authorized lobby seat."
  },
  {
    id: "late-lobby-entry",
    category: "MATCHDAY",
    categoryLabel: "Match Day & Rooms",
    question: "What happens if a player joins late or misses room launch?",
    answer: "Matches start strictly on schedule. Once the host initiates the match launch countdown, late entry cannot be guaranteed or reversed. Matches will not be delayed for tardy or missing players. Teams must drop as a 3-man or 2-man squad if teammates fail to join on time.",
    ruleRef: "Rule 04: Match & Room Rules",
    ruleLink: "/rules#section-4",
    highlight: "Be inside your slot at least 5 minutes before scheduled start time."
  },
  {
    id: "devices",
    category: "DEVICES",
    categoryLabel: "Devices & Fair Play",
    question: "Are iPads, tablets, or PC emulators allowed?",
    answer: "Strictly prohibited! In accordance with Rule 01 (Device & Equipment Rules), only standard mobile phones (smartphones) are permitted. Tablets, iPads, PC emulators (Gameloop, BlueStacks, etc.), and hardware triggers are prohibited. Detection triggers automatic disqualification and ban.",
    ruleRef: "Rule 01: Device & Equipment Rules",
    ruleLink: "/rules#section-1",
    highlight: "Mobile phones only. Emulators and iPads result in instant bans."
  },
  {
    id: "self-aid",
    category: "DEVICES",
    categoryLabel: "Devices & Fair Play",
    question: "Is using Self-AED / Self-Aid kit allowed in competitive matches?",
    answer: "Strictly prohibited! In accordance with Rule 13 (Disqualification & Ban Policy), using or activating a Self-AED / Self-Aid / Self-Revive kit is not allowed in any official tournament matches. Any squad caught using Self-Aid will receive 0 placement points for that round.",
    ruleRef: "Rule 13: Disqualification Policy",
    ruleLink: "/rules#section-13",
    highlight: "Self-AED usage is strictly banned across all competitive stages."
  },
  {
    id: "hacks-third-party-tools",
    category: "DEVICES",
    categoryLabel: "Devices & Fair Play",
    question: "What third-party software, configs, or gfx tools are permitted?",
    answer: "Zero tolerance. Any modified game files, custom config files (e.g. 90 FPS unlockers, iPad view configs), scripts, injectors, rooting tools, or third-party crosshairs will be flagged by our referee telemetry and result in an immediate lifetime ban under Rule 02.",
    ruleRef: "Rule 02: Hacking & Cheating",
    ruleLink: "/rules#section-2",
    highlight: "Zero tolerance anti-cheat: Lifetime ban for all detected tools."
  },
  {
    id: "scoring-dispute",
    category: "SCORING",
    categoryLabel: "Scoring & Points",
    question: "How is tournament scoring calculated (Placement & Finishes)?",
    answer: "Scoring follows the official 10-point BGMI standard: 1st (WWCD): 10 pts, 2nd: 6 pts, 3rd: 5 pts, 4th: 4 pts, 5th: 3 pts, 6th: 2 pts, 7th–8th: 1 pt, 9th–16th: 0 pts. In addition, each confirmed kill (finish) awards 1 kill point.",
    ruleRef: "Rule 11: Match Results & Scoring",
    ruleLink: "/rules#section-11",
    highlight: "Total Score = Placement Points + Total Squad Finishes."
  },
  {
    id: "scoring-disputes",
    category: "SCORING",
    categoryLabel: "Scoring & Points",
    question: "What is the procedure and timeline for disputing match results?",
    answer: "Under Rule 11, any scoring dispute must be reported to tournament organizers within 15 minutes of match conclusion via the Support Desk or WhatsApp Hotline. Submissions must include unedited end-game result screenshots or VOD timestamps.",
    ruleRef: "Rule 11: Match Results & Scoring",
    ruleLink: "/rules#section-11",
    highlight: "Disputes must be raised within 15 minutes of match completion."
  },
  {
    id: "disconnects-restarts",
    category: "TECHNICAL",
    categoryLabel: "Technical Issues",
    question: "Will a match be restarted if a player disconnects or ping spikes?",
    answer: "No. Under Rule 09 (Technical Issues), individual phone battery drain, ISP drops, or client crashes will not cause a match restart. A lobby restart is only considered if an official Krafton server breakdown impacts 40%+ of the lobby before the flight path starts.",
    ruleRef: "Rule 09: Technical Issues",
    ruleLink: "/rules#section-9",
    highlight: "Individual internet/device issues do not qualify for a lobby restart."
  },
  {
    id: "game-glitches",
    category: "TECHNICAL",
    categoryLabel: "Technical Issues",
    question: "What should squads do if they discover an in-game bug or glitch?",
    answer: "Under Rule 08 (Bugs, Glitches & Exploits), players are strictly prohibited from exploiting bugs to gain unfair advantage. If you discover a glitch, avoid exploiting it and report it to organizers immediately after the match.",
    ruleRef: "Rule 08: Bugs, Glitches & Exploits",
    ruleLink: "/rules#section-8",
    highlight: "Exploiting map or game glitches results in disqualification."
  },
  {
    id: "bootcamp-callouts",
    category: "BOOTCAMP",
    categoryLabel: "Bootcamp & Comms",
    question: "Can eliminated players give callouts or communicate with active teams?",
    answer: "No. Under Rule 05 & Rule 12, eliminated players must stay in their assigned Bootcamp/seat. No coaching, enemy location info, callouts, or zone strategies may be communicated to active operators. Doing so is treated as illegal coaching and collusion.",
    ruleRef: "Rule 05 & Rule 12: Comms",
    ruleLink: "/rules#section-12",
    highlight: "Strict radio silence from eliminated players until the match concludes."
  }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState({ "room-credentials": true, "devices": true });
  const [copiedId, setCopiedId] = useState(null);

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyLink = (id) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/faq#${id}`;
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCat = activeCategory === "ALL" || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;

      const inQuestion = item.question.toLowerCase().includes(q);
      const inAnswer = item.answer.toLowerCase().includes(q);
      const inCategory = item.categoryLabel.toLowerCase().includes(q);
      const inRule = item.ruleRef.toLowerCase().includes(q);

      return matchesCat && (inQuestion || inAnswer || inCategory || inRule);
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex-1 min-h-screen bg-[#080A0C] text-white relative overflow-hidden flex flex-col">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-25 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[45vw] h-[45vw] bg-[#FF6A00]/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-0 w-[40vw] h-[40vw] bg-[#FF6A00]/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10 flex-1 w-full">
        
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
            href="/support"
            className="inline-flex items-center gap-2 text-xs font-orbitron text-[#FF6A00] hover:text-white uppercase tracking-wider transition-colors"
          >
            <Headphones className="w-4 h-4" />
            <span>Open Support Desk &rarr;</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FF6A00]/10 border border-[#FF6A00]/30 px-4 py-1.5 mb-5 shadow-sm shadow-[#FF6A00]/10">
            <HelpCircle className="w-4 h-4 text-[#FF6A00]" />
            <span className="font-orbitron text-[11px] font-bold text-[#FF6A00] tracking-widest uppercase">
              Intel & Knowledge Base // 15 Critical Directives
            </span>
          </div>

          <h1 className="font-rajdhani text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 uppercase tracking-tight">
            Frequently Asked <span className="text-[#FF6A00]">Questions</span>
          </h1>

          <p className="font-inter text-sm sm:text-base text-[#B8C0C2] max-w-2xl mx-auto leading-relaxed">
            Essential directives, room credential timelines, device policies, anti-cheat regulations, and match day standard operating procedures.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-[11px] font-orbitron uppercase text-[#B8C0C2]">
            <span className="bg-[#111518] border border-white/10 px-3 py-1 text-white">
              15 Standard FAQs
            </span>
            <span className="bg-[#111518] border border-white/10 px-3 py-1 text-[#FF6A00] font-bold">
              Updated for 2026 Protocol
            </span>
            <span className="bg-[#111518] border border-red-500/30 text-red-400 px-3 py-1 font-bold">
              Mandatory Player Compliance
            </span>
          </div>
        </div>

        {/* Search & Category Filter Section (Sticky Bar) */}
        <div className="sticky top-20 z-30 mb-10 bg-[#0B0D0F]/95 backdrop-blur-md border border-white/10 p-4 shadow-xl">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#FF6A00] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search protocols, rules, self-aid, scoring..."
                className="w-full bg-[#111518] border border-white/15 pl-10 pr-4 py-2 text-xs sm:text-sm font-inter text-white placeholder:text-[#B8C0C2]/50 focus:outline-none focus:border-[#FF6A00] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#B8C0C2] hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const allOpen = {};
                  FAQ_ITEMS.forEach((it) => { allOpen[it.id] = true; });
                  setOpenItems(allOpen);
                }}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[#B8C0C2] hover:text-white text-xs font-orbitron uppercase tracking-wider transition-colors cursor-pointer"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={() => setOpenItems({})}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[#B8C0C2] hover:text-white text-xs font-orbitron uppercase tracking-wider transition-colors cursor-pointer"
              >
                Collapse
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-3 border-t border-white/5 mt-3 scrollbar-none">
            {FAQ_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              const count = cat.id === "ALL" 
                ? FAQ_ITEMS.length 
                : FAQ_ITEMS.filter((i) => i.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 text-xs font-orbitron tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#FF6A00] text-black font-bold shadow-md shadow-[#FF6A00]/20"
                      : "bg-[#111518] hover:bg-white/10 text-[#B8C0C2] hover:text-white border border-white/10"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                    isSelected ? "bg-black/30 text-black font-bold" : "bg-white/10 text-white"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 mb-16">
          {filteredFaqs.map((item, idx) => {
            const isOpen = !!openItems[item.id];
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                id={item.id}
                className={`bg-[#111518]/90 border transition-all hud-border ${
                  isOpen ? "border-[#FF6A00]/40 shadow-lg shadow-[#FF6A00]/5" : "border-white/10 hover:border-white/25"
                }`}
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
                    {/* Index Badge */}
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#FF6A00] bg-[#FF6A00]/10 border border-[#FF6A00]/30 px-2 py-1 shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    <div>
                      {/* Category Tag */}
                      <span className="text-[10px] font-orbitron text-[#B8C0C2] uppercase tracking-wider block mb-1">
                        {item.categoryLabel}
                      </span>
                      {/* Question Text */}
                      <h3 className="font-rajdhani text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  <div className="shrink-0 text-[#FF6A00] p-1">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                    )}
                  </div>
                </button>

                {/* Accordion Expanded Body */}
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-white/5 space-y-4 text-sm font-inter text-[#B8C0C2] leading-relaxed">
                    <p className="text-white/90">
                      {item.answer}
                    </p>

                    {item.highlight && (
                      <div className="bg-black/50 border-l-2 border-[#FF6A00] p-3 text-xs font-mono text-white">
                        {item.highlight}
                      </div>
                    )}

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-[#FF6A00]" />
                        <span className="text-[#B8C0C2]">Governing Protocol:</span>
                        <Link 
                          href={item.ruleLink}
                          className="font-orbitron font-bold text-[#FF6A00] hover:text-white underline uppercase text-[11px]"
                        >
                          {item.ruleRef}
                        </Link>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyLink(item.id)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-orbitron text-[#B8C0C2] hover:text-white uppercase transition-colors cursor-pointer"
                        title="Copy direct link to this FAQ item"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#39B54A]" />
                            <span className="text-[#39B54A]">Link Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* No Results Fallback */}
          {filteredFaqs.length === 0 && (
            <div className="bg-[#111518]/90 border border-white/10 p-12 text-center text-[#B8C0C2]">
              <AlertTriangle className="w-10 h-10 text-[#FF6A00] mx-auto mb-3" />
              <h3 className="font-rajdhani text-2xl uppercase tracking-wider text-white mb-2 font-bold">
                No matching questions found
              </h3>
              <p className="text-xs sm:text-sm max-w-md mx-auto mb-5 text-[#B8C0C2]">
                No FAQ matched "{searchQuery}". Try keywords like "room", "ipad", "scoring", or "disqualification".
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setActiveCategory("ALL"); }}
                className="px-5 py-2 bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>

        {/* Need Direct Assistance Banner */}
        <div className="bg-[#111518]/90 border border-[#FF6A00]/30 p-8 sm:p-12 hud-border text-center relative overflow-hidden mb-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/30 flex items-center justify-center mx-auto text-[#FF6A00]">
              <Headphones className="w-6 h-6" />
            </div>

            <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold uppercase tracking-wider text-white">
              Still Have Questions Or Need Live Match Support?
            </h2>

            <p className="text-sm font-inter text-[#B8C0C2] leading-relaxed">
              Our 24/7 Match Referee Desk is standing by to assist with emergency room credential access, scoring discrepancies, and roster disputes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/support"
                className="w-full sm:w-auto bg-[#FF6A00] hover:bg-white text-black px-6 py-3 font-rajdhani font-bold text-sm uppercase tracking-widest shadow-lg shadow-[#FF6A00]/30 transition-all cursor-pointer"
              >
                Transmit Support Ticket
              </Link>
              <a
                href="https://wa.me/919967747153?text=BGMI%20Tournament%20Support%20Inquiry"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 font-rajdhani font-bold text-sm uppercase tracking-widest transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>WhatsApp Hotline</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Shared Tactical Footer */}
      <Footer />
    </div>
  );
}
