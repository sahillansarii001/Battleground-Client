"use client";
import { useState, useEffect, useMemo } from "react";
import { 
  Shield, Search, Smartphone, AlertTriangle, Users, Swords, 
  Clock, Award, HelpCircle, CheckCircle, ChevronUp, Copy, Check,
  Radio, Lock, Flag, FileText, Sparkles, AlertOctagon, Terminal,
  Download, Printer
} from "lucide-react";
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';

// Structured 14 Official BGMI Tournament Rules matching tournament reference graphics
const OFFICIAL_RULES_DATA = [
  {
    id: "01",
    sectionNum: "01",
    version: "1.0",
    title: "DEVICE & EQUIPMENT RULES",
    shortTitle: "Devices",
    icon: Smartphone,
    items: [
      "Only mobile phones are allowed for participation in the tournament.",
      "Tablets, iPads, emulators, laptops, PCs, or any other devices are strictly prohibited.",
      "Every player must use their registered BGMI account throughout the tournament.",
      "Players are not allowed to switch accounts or play using another player's account.",
      "Players are responsible for ensuring that their device has sufficient battery, storage, internet connection, and the required BGMI version before every match.",
      "Players must keep their devices ready before the scheduled match time."
    ],
    callout: null
  },
  {
    id: "02",
    sectionNum: "02",
    version: "2.0",
    title: "HACKING, CHEATING & UNFAIR PLAY — ZERO TOLERANCE",
    shortTitle: "Anti-Cheat",
    icon: AlertOctagon,
    items: [
      "The use of hacks, cheats, scripts, injectors, game-file modifications, config modifications, unauthorized applications, or any third-party tools that provide an unfair advantage is strictly prohibited.",
      "Any attempt to gain an unfair advantage will be treated as a serious violation.",
      "The tournament will use Advanced Room Cards, and the organizers reserve the right to remove or ban a player immediately if cheating, hacking, or suspicious activity is detected.",
      "A player found using cheats or hacks may be immediately disqualified from the tournament.",
      "A banned player will not be allowed to participate in any remaining matches of the tournament.",
      "Depending on the severity of the violation, the entire team may also be disqualified.",
      "Claiming that the hack/cheat was accidental, borrowed, or caused by another person will not automatically excuse the violation."
    ],
    callout: "NO HACKS • NO CHEATS • NO THIRD-PARTY TOOLS • PLAY FAIR"
  },
  {
    id: "03",
    sectionNum: "03",
    version: "3.0",
    title: "SLOT & BOOTCAMP ALLOCATION",
    shortTitle: "Slots & Camps",
    icon: Radio,
    items: [
      "The organizers will assign every team a specific Slot/Bootcamp Number.",
      "Once your respective slot number is announced, your team must stay in its assigned slot.",
      "Players are not allowed to move to, sit in, or occupy another team's slot/Bootcamp.",
      "Players must not switch slots during a match without permission from the tournament organizers.",
      "Players from different teams must not intentionally gather in another team's assigned Bootcamp.",
      "If a player needs to leave their assigned slot for any genuine reason, they must first inform the organizer and receive permission.",
      "Repeatedly ignoring slot instructions may result in a warning, penalty, or disqualification."
    ],
    callout: "YOUR SLOT IS YOUR TEAM'S DESIGNATED AREA — DO NOT MOVE TO ANOTHER TEAM'S SLOT"
  },
  {
    id: "04",
    sectionNum: "04",
    version: "4.0",
    title: "MATCH & ROOM RULES",
    shortTitle: "Match & Room",
    icon: Swords,
    items: [
      "Players must join their respective room before the scheduled match start time.",
      "Players must join the correct room assigned by the organizers.",
      "Room ID and password will be provided by the organizers.",
      "Room ID and password must not be shared with non-participating players.",
      "Players must follow all instructions given by the room administrators and tournament organizers.",
      "Once the match has started, late entry may not be guaranteed.",
      "Players must not intentionally disrupt the room or delay the start of a match.",
      "Players must remain in their assigned physical slot/Bootcamp during the match unless permission is given by the organizer."
    ],
    callout: null
  },
  {
    id: "05",
    sectionNum: "05",
    version: "5.0",
    title: "AFTER ELIMINATION",
    shortTitle: "Elimination",
    icon: Clock,
    items: [
      "Once a player or team is eliminated from a match, they must remain in their respective assigned Bootcamp/slot.",
      "Eliminated players are not allowed to move to another team's Bootcamp or slot.",
      "Eliminated players must wait until the entire match has officially ended.",
      "Eliminated players must not provide any information to teams that are still playing.",
      "No coaching, enemy-location information, callouts, or strategic information may be given to active players after elimination.",
      "Players must not intentionally communicate with active players for the purpose of influencing the ongoing match.",
      "Players may leave their assigned Bootcamp only after the match has completely ended and the organizer permits them to do so."
    ],
    callout: "ELIMINATED? STAY IN YOUR BOOTCAMP UNTIL THE MATCH ENDS"
  },
  {
    id: "06",
    sectionNum: "06",
    version: "6.0",
    title: "TEAM & PLAYER RULES",
    shortTitle: "Squad Rules",
    icon: Users,
    items: [
      "Only registered players are allowed to participate.",
      "No unregistered player may play in place of a registered player.",
      "Players cannot change teams after the tournament has started.",
      "Players must use their registered in-game identity/details.",
      "Players must not intentionally help another team.",
      "Teaming or collusion between teams is strictly prohibited.",
      "Any attempt to manipulate the result of a match may result in immediate disqualification."
    ],
    callout: null
  },
  {
    id: "07",
    sectionNum: "07",
    version: "7.0",
    title: "FAIR PLAY & SPORTSMANSHIP",
    shortTitle: "Fair Play",
    icon: Shield,
    intro: "All players are expected to maintain proper sportsmanship throughout the tournament. The following behaviour is strictly prohibited:",
    bullets: [
      "Abusive or offensive language toward organizers or players",
      "Threatening behaviour",
      "Fighting or physical confrontation",
      "Deliberately disturbing another team",
      "Intentionally distracting players during a match",
      "Harassment of other participants",
      "Disrespectful behaviour toward tournament staff",
      "Deliberate damage to tournament property or equipment"
    ],
    callout: "SERIOUS MISCONDUCT MAY RESULT IN IMMEDIATE REMOVAL FROM THE TOURNAMENT"
  },
  {
    id: "08",
    sectionNum: "08",
    version: "8.0",
    title: "BUGS, GLITCHES & EXPLOITS",
    shortTitle: "Exploits",
    icon: AlertTriangle,
    items: [
      "Players are not allowed to intentionally exploit any game bug or glitch to gain an unfair advantage.",
      "If a player discovers a serious game-breaking issue, they must report it to the tournament organizers immediately.",
      "Deliberately abusing an unintended game mechanic may result in a penalty or disqualification.",
      "The organizers will decide how to handle major technical or gameplay issues."
    ],
    callout: null
  },
  {
    id: "09",
    sectionNum: "09",
    version: "9.0",
    title: "TECHNICAL ISSUES",
    shortTitle: "Tech Issues",
    icon: Terminal,
    items: [
      "Every player is responsible for their own mobile phone, battery, internet connection, BGMI installation, and device performance.",
      "Players should ensure their devices are fully charged before every match.",
      "Players should have a stable internet connection before entering the room.",
      "Individual device, battery, network, or connectivity problems will generally not result in a match restart.",
      "If a major server or game-related issue affects multiple teams, the organizers will decide whether the match should be restarted, continued, or otherwise handled.",
      "The organizer's decision regarding technical issues will be final."
    ],
    callout: null
  },
  {
    id: "10",
    sectionNum: "10",
    version: "10.0",
    title: "ROOM CARD & TOURNAMENT ADMINISTRATION",
    shortTitle: "Room Cards",
    icon: Lock,
    items: [
      "The tournament will use Advanced Room Cards for the matches.",
      "Tournament organizers and room administrators will have the authority to manage the room and participating players.",
      "If a player violates tournament rules, the organizers may remove the player from the room.",
      "A player removed or banned for a serious violation may not be permitted to participate in any remaining matches.",
      "Players must cooperate with organizers and room administrators at all times."
    ],
    callout: null
  },
  {
    id: "11",
    sectionNum: "11",
    version: "11.0",
    title: "MATCH RESULTS & SCORING",
    shortTitle: "Scoring",
    icon: Award,
    items: [
      "Match results will be recorded by the tournament organizers.",
      "Players must not interfere with the score-recording process.",
      "Any scoring dispute must be reported to the organizer immediately after the match.",
      "Once the results have been verified and finalized, changes may not be permitted unless an official error is identified.",
      "The final tournament ranking will be determined according to the official scoring system announced by the organizers."
    ],
    callout: null
  },
  {
    id: "12",
    sectionNum: "12",
    version: "12.0",
    title: "PROHIBITED COMMUNICATION",
    shortTitle: "Comms",
    icon: Radio,
    items: [
      "Players must not communicate with active players from another team during an ongoing match.",
      "Eliminated players must not provide information about enemy locations, rotations, player health, loot, vehicles, zone information, or opponent strategies.",
      "Spectators, eliminated players, and other participants must not interfere with active teams.",
      "Any attempt to provide outside information to an active player may be treated as unfair play."
    ],
    callout: null
  },
  {
    id: "13",
    sectionNum: "13",
    version: "13.0",
    title: "DISQUALIFICATION & BAN POLICY",
    shortTitle: "Disqualification",
    icon: AlertOctagon,
    isTable: true,
    intro: "A player or team may be immediately disqualified for any of the following offenses (including using Self-AED / Self-Aid kit):",
    matrix: [
      ["Hacking or cheating", "Using prohibited devices"],
      ["Using tablets or iPads", "Using emulators"],
      ["Unauthorized third-party software", "Scripts, injectors, or modified files"],
      ["Exploiting serious bugs/glitches", "Teaming or collusion"],
      ["Using an unregistered player", "Info sharing after elimination"],
      ["Entering another team's slot", "Deliberately disrupting a team"],
      ["Match manipulation", "Serious misconduct / abuse"],
      ["Refusing organizer instructions", "Using Self-AED / Self-Aid Kit (STRICTLY PROHIBITED)"]
    ],
    callout: "PROHIBITED: USING SELF-AED / SELF-REVIVE KIT IS NOT ALLOWED IN ANY OFFICIAL MATCHES. POSSESSION OR USAGE WILL RESULT IN IMMEDIATE ROUND DISQUALIFICATION."
  },
  {
    id: "14",
    sectionNum: "14",
    version: "14.0",
    title: "ORGANIZER'S FINAL AUTHORITY",
    shortTitle: "Final Authority",
    icon: Flag,
    items: [
      "All participants must follow the instructions of the Tournament Organizers, Referees, Room Administrators, and authorized staff.",
      "The organizers have the authority to take action against rule violations.",
      "In situations not specifically covered by these rules, the organizers will decide the appropriate action.",
      "The decision of the Tournament Organizers regarding rule violations, disputes, technical issues, penalties, disqualifications, and match administration will be final."
    ],
    callout: null
  }
];

export default function Rules() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const handleCopyLink = (secId) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/rules#section-${secId}`;
      navigator.clipboard.writeText(url);
      setCopiedId(secId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownloadPDF = () => {
    setActiveTab("ALL");
    setSearchQuery("");
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const filteredRules = useMemo(() => {
    return OFFICIAL_RULES_DATA.filter((rule) => {
      const matchesTab = activeTab === "ALL" || rule.id === activeTab;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesTab;

      const inTitle = rule.title.toLowerCase().includes(q);
      const inItems = rule.items?.some((it) => it.toLowerCase().includes(q));
      const inBullets = rule.bullets?.some((b) => b.toLowerCase().includes(q));
      const inCallout = rule.callout?.toLowerCase().includes(q);
      const inMatrix = rule.matrix?.some((row) => row.some((cell) => cell.toLowerCase().includes(q)));

      return matchesTab && (inTitle || inItems || inBullets || inCallout || inMatrix);
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="flex-1 py-28 bg-[#080A0C] relative z-10 overflow-hidden min-h-screen">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-25 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[45vw] h-[45vw] bg-[#FF6A00]/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-0 w-[35vw] h-[35vw] bg-[#FF6A00]/5 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FF6A00]/10 border border-[#FF6A00]/30 px-4 py-1.5 mb-5 shadow-sm shadow-[#FF6A00]/10">
            <Shield className="w-4 h-4 text-[#FF6A00]" />
            <span className="font-orbitron text-[11px] font-bold text-[#FF6A00] tracking-widest uppercase">
              Official Tournament Directives // 14 Sections
            </span>
          </div>

          <h1 className="font-rajdhani text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 uppercase tracking-tight">
            Battlegrounds <span className="text-[#FF6A00]">Standard Protocol</span>
          </h1>

          <p className="font-inter text-sm sm:text-base text-[#B8C0C2] max-w-2xl mx-auto leading-relaxed">
            Mandatory Standard Operating Procedures for all registered squads, operatives, and lobby attendees.
            Ignorance of rules is not an excuse. Failure to comply results in immediate disqualification.
          </p>

          {/* Quick Metrics & Actions Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-[11px] font-orbitron uppercase text-[#B8C0C2]">
            <span className="bg-[#111518] border border-white/10 px-3 py-1 text-white font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#39B54A] animate-pulse"></span>
              Live Protocol Suite
            </span>
            <span className="bg-[#111518] border border-white/10 px-3 py-1 text-[#FF6A00] font-bold">
              Versions 1.0 — 14.0
            </span>
            <span className="bg-[#111518] border border-red-500/30 text-red-400 px-3 py-1 font-bold">
              Zero Tolerance Anti-Cheat
            </span>

            {/* Download PDF Button */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="no-print ml-1 inline-flex items-center gap-2 bg-[#FF6A00] hover:bg-white text-black px-4 py-1.5 text-xs font-rajdhani font-bold uppercase tracking-widest shadow-md shadow-[#FF6A00]/25 transition-all cursor-pointer transform hover:scale-105"
              title="Download entire 14-section rulebook as PDF"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download PDF Rulebook</span>
            </button>
          </div>
        </div>

        {/* Print-Only Official Header */}
        <div className="hidden print:block pb-6 mb-8 border-b-2 border-[#FF6A00] text-center">
          <h1 className="text-3xl font-bold font-rajdhani uppercase tracking-wider text-white">
            BATTLEGROUNDS MOBILE INDIA
          </h1>
          <h2 className="text-xl font-bold font-orbitron uppercase text-[#FF6A00] mt-1">
            OFFICIAL TOURNAMENT DIRECTIVES // VERSIONS 1.0 — 14.0
          </h2>
          <p className="text-xs text-[#B8C0C2] mt-1 font-mono">
            Standard Operating Procedures, Device Policies & Penalties Matrix
          </p>
        </div>

        {/* Search & Filter Command Center (Sticky) */}
        <div className="sticky top-20 z-30 mb-8 bg-[#0B0D0F]/95 backdrop-blur-md border border-white/10 p-4 shadow-xl no-print">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#FF6A00] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rules (e.g. iPad, emulator, bootcamp, penalty, remake)..."
                className="w-full bg-[#111518] border border-white/15 pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder:text-[#B8C0C2]/50 font-inter focus:border-[#FF6A00] outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#B8C0C2] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Stats Counter & Quick PDF Export */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="flex items-center gap-2 text-xs font-orbitron text-[#B8C0C2]">
                <span>Showing:</span>
                <span className="text-[#FF6A00] font-bold font-mono text-sm">{filteredRules.length}</span>
                <span>/ 14 Sections</span>
              </div>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="flex items-center gap-1.5 bg-[#1A2023] hover:bg-[#FF6A00] border border-white/10 hover:border-[#FF6A00] text-white hover:text-black px-3 py-1.5 font-rajdhani font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                title="Save / Export full document as PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF Export</span>
              </button>
            </div>
          </div>

          {/* Quick Category Nav Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 custom-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className={`px-3 py-1.5 text-xs font-orbitron uppercase tracking-wider shrink-0 transition-all border ${
                activeTab === "ALL"
                  ? "bg-[#FF6A00] text-black border-[#FF6A00] font-bold shadow-md shadow-[#FF6A00]/25"
                  : "bg-[#111518] text-[#B8C0C2] border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              All Directives ({OFFICIAL_RULES_DATA.length})
            </button>
            {OFFICIAL_RULES_DATA.map((rule) => {
              const isActive = activeTab === rule.id;
              return (
                <button
                  key={rule.id}
                  type="button"
                  onClick={() => setActiveTab(rule.id)}
                  className={`px-2.5 py-1.5 text-xs font-orbitron uppercase tracking-wider shrink-0 transition-all border flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#FF6A00] text-black border-[#FF6A00] font-bold shadow-md shadow-[#FF6A00]/25"
                      : "bg-[#111518] text-[#B8C0C2] border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <span className="text-[10px] opacity-70 font-mono">#{rule.sectionNum}</span>
                  <span>{rule.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rules Cards Container */}
        <div className="space-y-8">
          {filteredRules.map((rule) => {
            const IconComponent = rule.icon || Shield;
            return (
              <div
                key={rule.id}
                id={`section-${rule.id}`}
                className="bg-[#111518]/95 border border-white/10 shadow-xl transition-all duration-300 hover:border-[#FF6A00]/50 relative group print-card"
              >
                {/* Tactical Corner Marks */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#FF6A00] no-print"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#FF6A00] no-print"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#FF6A00] no-print"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#FF6A00] no-print"></div>

                {/* Card Header Bar */}
                <div className="bg-[#15191C] border-b border-white/10 px-5 sm:px-7 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* Section Number Badge */}
                    <div className="w-10 h-10 bg-[#FF6A00] text-black font-orbitron font-extrabold text-base flex items-center justify-center shrink-0 shadow-md shadow-[#FF6A00]/20 transform skew-x-[-6deg]">
                      <span className="transform skew-x-6">{rule.sectionNum}</span>
                    </div>

                    <div>
                      <h2 className="font-rajdhani text-xl sm:text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span>{rule.title}</span>
                      </h2>
                    </div>
                  </div>

                  {/* Version Tag & Quick Link */}
                  <div className="flex items-center gap-2.5 self-start sm:self-auto">
                    <span className="font-mono text-xs font-bold text-[#FF6A00] bg-[#080A0C] border border-[#FF6A00]/30 px-3 py-1">
                      VERSION {rule.version}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(rule.id)}
                      className="text-[#B8C0C2] hover:text-white p-1.5 hover:bg-white/5 transition-colors no-print"
                      title="Copy link to this section"
                    >
                      {copiedId === rule.id ? (
                        <Check className="w-4 h-4 text-[#39B54A]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 sm:p-8 space-y-4">
                  {/* Optional Intro */}
                  {rule.intro && (
                    <p className="font-inter text-sm sm:text-base text-white/90 font-medium mb-3">
                      {rule.intro}
                    </p>
                  )}

                  {/* Numbered Rule Items */}
                  {rule.items && (
                    <ol className="space-y-3.5">
                      {rule.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3.5 group/item">
                          <span className="font-orbitron font-bold text-xs text-[#FF6A00] bg-[#080A0C] border border-white/10 w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:border-[#FF6A00] transition-colors">
                            {idx + 1}
                          </span>
                          <span className="font-inter text-sm sm:text-base text-[#D0D7DE] leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}

                  {/* Bulleted Rule Items (for Sportsmanship) */}
                  {rule.bullets && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {rule.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 bg-[#080A0C] border border-white/5 p-3 hover:border-red-500/30 transition-colors">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0 mt-2"></span>
                          <span className="font-inter text-xs sm:text-sm text-[#D0D7DE]">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Disqualification Matrix Table (Section 13) */}
                  {rule.isTable && rule.matrix && (
                    <div className="overflow-x-auto mt-4 border border-white/10">
                      <table className="w-full text-left font-inter text-xs sm:text-sm">
                        <thead className="bg-[#080A0C] text-[#FF6A00] font-orbitron text-[10px] sm:text-xs uppercase tracking-wider border-b border-white/10">
                          <tr>
                            <th className="p-3 border-r border-white/10 w-1/2">Violation Category A</th>
                            <th className="p-3 w-1/2">Violation Category B</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {rule.matrix.map((row, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                              <td className="p-3 border-r border-white/10 text-white font-medium">
                                <span className="inline-block w-1.5 h-1.5 bg-red-500/80 rounded-full mr-2"></span>
                                {row[0]}
                              </td>
                              <td className="p-3 text-white font-medium">
                                {row[1] !== "—" && (
                                  <span className="inline-block w-1.5 h-1.5 bg-red-500/80 rounded-full mr-2"></span>
                                )}
                                {row[1]}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Red/Crimson Callout Banner */}
                  {rule.callout && (
                    <div className="mt-6 bg-red-950/25 border-l-4 border-l-red-500 border border-red-500/30 p-4 sm:p-5 text-center">
                      <div className="flex items-center justify-center gap-2 text-red-500 font-orbitron font-bold text-xs uppercase tracking-widest mb-1">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>MANDATORY PROTOCOL NOTICE</span>
                      </div>
                      <p className="font-orbitron font-bold text-xs sm:text-sm text-red-300 tracking-wider">
                        {rule.callout}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* No Search Results Fallback */}
          {filteredRules.length === 0 && (
            <div className="bg-[#111518]/90 border border-white/10 p-16 text-center text-[#B8C0C2]">
              <AlertTriangle className="w-12 h-12 text-[#FF6A00] mx-auto mb-3" />
              <h3 className="font-rajdhani text-2xl uppercase tracking-wider text-white mb-2 font-bold">
                No matching rules found
              </h3>
              <p className="text-xs sm:text-sm max-w-md mx-auto mb-5 text-[#B8C0C2]">
                No tournament directive matched your search for "{searchQuery}". Try searching for keywords like "device", "bootcamp", "ban", or "scoring".
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setActiveTab("ALL"); }}
                className="px-6 py-2.5 bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold text-xs uppercase tracking-widest transition-colors"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>

        {/* Bottom Official Tournament Creed Banner (Matching Image 4) */}
        <div className="mt-16 bg-[#111518]/90 border border-white/10 p-8 sm:p-12 text-center hud-border relative">
          <div className="max-w-3xl mx-auto space-y-6">
            
            <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-extrabold text-red-500 uppercase tracking-widest">
              PLAY FAIR. PLAY CLEAN. RESPECT THE GAME.
            </h2>

            {/* Glowing Tactical Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {[
                "MOBILE ONLY",
                "NO TABS / IPADS",
                "NO EMULATORS",
                "NO HACKS",
                "NO CHEATS",
                "NO THIRD-PARTY TOOLS",
                "NO TEAMING",
                "NO SLOT INTRUSION",
                "NO INFO SHARING AFTER ELIMINATION"
              ].map((pill, idx) => (
                <span
                  key={idx}
                  className="bg-[#080A0C] border border-red-500/40 text-red-300 px-3.5 py-1 text-[10px] sm:text-xs font-orbitron font-bold tracking-wider rounded-full shadow-sm shadow-red-500/10"
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* Core Directives Reminders */}
            <div className="space-y-1.5 text-xs sm:text-sm font-inter text-[#B8C0C2] pt-4">
              <p className="font-semibold text-white">Stay in your assigned Slot/Bootcamp.</p>
              <p>If eliminated, stay in your Bootcamp until the match ends.</p>
              <p>Follow the organizer's instructions at all times.</p>
              <p className="text-red-400 font-bold">
                Any serious rule violation can result in immediate removal and tournament-wide ban.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10">
              <p className="font-orbitron font-bold text-xs sm:text-sm text-yellow-500 tracking-widest uppercase">
                PLAY FAIR • RESPECT EVERY TEAM • GIVE YOUR BEST
              </p>
            </div>
          </div>
        </div>

        {/* Footer Acceptance Notice */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-3 text-[10px] font-orbitron uppercase text-[#B8C0C2]">
          <span>By entering match lobby or initializing deployment, you accept all directives.</span>
          <span className="font-mono text-[#FF6A00]">SYSTEM AUTH // BGMI TOURNAMENT PROTOCOL 2026</span>
        </div>

      </div>

      {/* Floating Scroll to Top Action */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-11 h-11 bg-[#FF6A00] hover:bg-white text-black font-bold flex items-center justify-center shadow-lg shadow-[#FF6A00]/30 transition-all transform hover:scale-110 no-print"
          title="Back to top"
        >
          <ChevronUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
}
