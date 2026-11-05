"use client";
import { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Edit, Save, Upload, Trash2, X, Eye, Columns, 
  FileText, CheckCircle, AlertTriangle, Sparkles, ExternalLink, 
  Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, 
  Quote, Table, RotateCcw, Clock, Shield, CheckSquare
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import ActionModal from '@/components/admin/ActionModal';
import ReactMarkdown from 'react-markdown';

// Standard BGMI Official Esports Rulebook Preset Template (14 Official Directives)
const OFFICIAL_BGMI_TEMPLATE = `# BATTLEGROUNDS MOBILE INDIA
## OFFICIAL TOURNAMENT RULEBOOK & DIRECTIVES

---

### 01 DEVICE & EQUIPMENT RULES
1. **Only mobile phones are allowed** for participation in the tournament.
2. **Tablets, iPads, emulators, laptops, PCs, or any other devices are strictly prohibited.**
3. Every player must use their **registered BGMI account** throughout the tournament.
4. Players are not allowed to switch accounts or play using another player's account.
5. Players are responsible for ensuring that their device has sufficient battery, storage, internet connection, and the required BGMI version before every match.
6. Players must keep their devices ready before the scheduled match time.

---

### 02 HACKING, CHEATING & UNFAIR PLAY — ZERO TOLERANCE
1. The use of **hacks, cheats, scripts, injectors, game-file modifications, config modifications, unauthorized applications, or any third-party tools** that provide an unfair advantage is strictly prohibited.
2. Any attempt to gain an unfair advantage will be treated as a serious violation.
3. The tournament will use **Advanced Room Cards**, and the organizers reserve the right to **remove or ban a player immediately** if cheating, hacking, or suspicious activity is detected.
4. A player found using cheats or hacks may be **immediately disqualified from the tournament.**
5. A banned player will **not be allowed to participate in any remaining matches** of the tournament.
6. Depending on the severity of the violation, the **entire team may also be disqualified.**
7. Claiming that the hack/cheat was accidental, borrowed, or caused by another person will not automatically excuse the violation.

> ⛔ **ZERO TOLERANCE:** NO HACKS • NO CHEATS • NO THIRD-PARTY TOOLS • PLAY FAIR

---

### 03 SLOT & BOOTCAMP ALLOCATION
1. The organizers will assign every team a **specific Slot/Bootcamp Number.**
2. Once your respective slot number is announced, your team must **stay in its assigned slot.**
3. Players are **not allowed** to move to, sit in, or occupy another team's slot/Bootcamp.
4. Players must not switch slots during a match without permission from the tournament organizers.
5. Players from different teams must not intentionally gather in another team's assigned Bootcamp.
6. If a player needs to leave their assigned slot for any genuine reason, they must first **inform the organizer and receive permission.**
7. Repeatedly ignoring slot instructions may result in a **warning, penalty, or disqualification.**

> ⚠️ **YOUR SLOT IS YOUR TEAM'S DESIGNATED AREA — DO NOT MOVE TO ANOTHER TEAM'S SLOT**

---

### 04 MATCH & ROOM RULES
1. Players must join their respective room before the scheduled match start time.
2. Players must join the **correct room assigned by the organizers.**
3. Room ID and password will be provided by the organizers.
4. Room ID and password must **not be shared** with non-participating players.
5. Players must follow all instructions given by the room administrators and tournament organizers.
6. Once the match has started, late entry may not be guaranteed.
7. Players must not intentionally disrupt the room or delay the start of a match.
8. Players must remain in their assigned physical slot/Bootcamp during the match unless permission is given by the organizer.

---

### 05 AFTER ELIMINATION
1. Once a player or team is eliminated from a match, they must **remain in their respective assigned Bootcamp/slot.**
2. Eliminated players are **not allowed** to move to another team's Bootcamp or slot.
3. Eliminated players must wait until the **entire match has officially ended.**
4. Eliminated players must not provide any information to teams that are still playing.
5. **No coaching, enemy-location information, callouts, or strategic information** may be given to active players after elimination.
6. Players must not intentionally communicate with active players for the purpose of influencing the ongoing match.
7. Players may leave their assigned Bootcamp only after the match has completely ended and the organizer permits them to do so.

> 🛑 **ELIMINATED? STAY IN YOUR BOOTCAMP UNTIL THE MATCH ENDS**

---

### 06 TEAM & PLAYER RULES
1. Only registered players are allowed to participate.
2. No unregistered player may play in place of a registered player.
3. Players cannot change teams after the tournament has started.
4. Players must use their registered in-game identity/details.
5. Players must not intentionally help another team.
6. Teaming or collusion between teams is strictly prohibited.
7. Any attempt to manipulate the result of a match may result in immediate disqualification.

---

### 07 FAIR PLAY & SPORTSMANSHIP
All players are expected to maintain proper sportsmanship throughout the tournament. The following behaviour is prohibited:
- Abusive or offensive language toward organizers or players
- Threatening behaviour
- Fighting or physical confrontation
- Deliberately disturbing another team
- Intentionally distracting players during a match
- Harassment of other participants
- Disrespectful behaviour toward tournament staff
- Deliberate damage to tournament property or equipment

> ⚠️ **SERIOUS MISCONDUCT MAY RESULT IN IMMEDIATE REMOVAL FROM THE TOURNAMENT**

---

### 08 BUGS, GLITCHES & EXPLOITS
1. Players are not allowed to intentionally exploit any game bug or glitch to gain an unfair advantage.
2. If a player discovers a serious game-breaking issue, they must report it to the tournament organizers.
3. Deliberately abusing an unintended game mechanic may result in a penalty or disqualification.
4. The organizers will decide how to handle major technical or gameplay issues.

---

### 09 TECHNICAL ISSUES
1. Every player is responsible for their own mobile phone, battery, internet connection, BGMI installation, and device performance.
2. Players should ensure their devices are fully charged before every match.
3. Players should have a stable internet connection before entering the room.
4. Individual device, battery, network, or connectivity problems will generally **not result in a match restart.**
5. If a major server or game-related issue affects multiple teams, the organizers will decide whether the match should be restarted, continued, or otherwise handled.
6. The organizer's decision regarding technical issues will be final.

---

### 10 ROOM CARD & TOURNAMENT ADMINISTRATION
1. The tournament will use **Advanced Room Cards** for the matches.
2. Tournament organizers and room administrators will have the authority to manage the room and participating players.
3. If a player violates tournament rules, the organizers may remove the player from the room.
4. A player removed or banned for a serious violation may **not be permitted** to participate in any remaining matches.
5. Players must cooperate with organizers and room administrators at all times.

---

### 11 MATCH RESULTS & SCORING
1. Match results will be recorded by the tournament organizers.
2. Players must not interfere with the score-recording process.
3. Any scoring dispute must be reported to the organizer immediately after the match.
4. Once the results have been verified and finalized, changes may not be permitted unless an official error is identified.
5. The final tournament ranking will be determined according to the **official scoring system announced by the organizers.**

---

### 12 PROHIBITED COMMUNICATION
1. Players must not communicate with active players from another team during an ongoing match.
2. Eliminated players must not provide information about enemy locations, rotations, player health, loot, vehicles, zone information, or opponent strategies.
3. Spectators, eliminated players, and other participants must not interfere with active teams.
4. Any attempt to provide outside information to an active player may be treated as **unfair play.**

---

### 13 DISQUALIFICATION & BAN POLICY
A player or team may be immediately disqualified for:

| Violation | Violation |
| :--- | :--- |
| Hacking or cheating | Using prohibited devices |
| Using tablets or iPads | Using emulators |
| Unauthorized third-party software | Scripts, injectors, or modified files |
| Exploiting serious bugs/glitches | Teaming or collusion |
| Using an unregistered player | Info sharing after elimination |
| Entering another team's slot | Deliberately disrupting a team |
| Match manipulation | Serious misconduct / abuse |
| Refusing organizer instructions | Using Self-AED / Self-Aid Kit |

> 🚫 **SELF-AID BAN:** Using Self-AED / Self-Revive kit is strictly prohibited in all competitive lobbies. Any use or possession of a Self-AED results in immediate match disqualification.

> 🚨 **THE TOURNAMENT ORGANIZERS RESERVE THE RIGHT TO REMOVE, DISQUALIFY, OR BAN ANY PLAYER OR TEAM THAT VIOLATES THE TOURNAMENT RULES OR GAINS AN UNFAIR ADVANTAGE. A BANNED PLAYER WILL NOT BE ALLOWED TO PARTICIPATE IN ANY REMAINING MATCHES.**

---

### 14 ORGANIZER'S FINAL AUTHORITY
1. All participants must follow the instructions of the **Tournament Organizers, Referees, Room Administrators, and authorized staff.**
2. The organizers have the authority to take action against rule violations.
3. In situations not specifically covered by these rules, the organizers will decide the appropriate action.
4. The decision of the Tournament Organizers regarding **rule violations, disputes, technical issues, penalties, disqualifications, and match administration will be final.**

---

## PLAY FAIR. PLAY CLEAN. RESPECT THE GAME.

\`MOBILE ONLY\` • \`NO TABS / IPADS\` • \`NO EMULATORS\` • \`NO HACKS\` • \`NO CHEATS\` • \`NO THIRD-PARTY TOOLS\` • \`NO TEAMING\` • \`NO SLOT INTRUSION\` • \`NO INFO SHARING AFTER ELIMINATION\`

- **Stay in your assigned Slot/Bootcamp.**
- **If eliminated, stay in your Bootcamp until the match ends.**
- **Follow the organizer's instructions at all times.**
- **Any serious rule violation can result in immediate removal and tournament-wide ban.**

**PLAY FAIR • RESPECT EVERY TEAM • GIVE YOUR BEST**
`;

export default function AdminRules() {
  const [rulebooks, setRulebooks] = useState([]);
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionModal, setActionModal] = useState({ isOpen: false });
  const [viewMode, setViewMode] = useState('split'); // 'edit', 'split', 'preview'
  const textareaRef = useRef(null);

  const fetchRulebooks = async () => {
    try {
      const res = await api.get('/rules');
      if (res?.success) {
        const data = res.data || [];
        setRulebooks(data);
        
        // If nothing is being edited, pre-fill with published rulebook or prompt to create
        const published = data.find(r => r.status === 'PUBLISHED');
        if (published && !editingId && !title && !content) {
          setTitle(published.title);
          setVersion(published.version);
          setContent(published.content);
          setEditingId(published._id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch rulebooks:", error?.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRulebooks();
  }, []);

  // Helper to insert markdown tags at cursor position
  const insertFormatting = (prefix, suffix = '', defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultText;
    const replacement = prefix + selectedText + suffix;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  const handleInsertTemplate = () => {
    if (content.trim().length > 0) {
      setActionModal({
        isOpen: true,
        title: 'Overwrite Content?',
        message: 'Loading the official tournament template will replace your current editor content. Do you want to proceed?',
        confirmText: 'Load Template',
        isDanger: true,
        onConfirm: () => {
          setTitle('BATTLEGROUNDS MOBILE INDIA - OFFICIAL TOURNAMENT DIRECTIVES');
          setVersion('2.0.0');
          setContent(OFFICIAL_BGMI_TEMPLATE);
          setActionModal({ isOpen: false });
        }
      });
    } else {
      setTitle('BATTLEGROUNDS MOBILE INDIA - OFFICIAL TOURNAMENT DIRECTIVES');
      setVersion('2.0.0');
      setContent(OFFICIAL_BGMI_TEMPLATE);
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim() || !version.trim() || !content.trim()) {
      setActionModal({
        isOpen: true,
        isAlert: true,
        title: 'Missing Required Fields',
        message: 'Please fill in Document Title, Version, and Rulebook Content before saving.',
        confirmText: 'OK',
        onConfirm: () => setActionModal({ isOpen: false })
      });
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await api.put(`/rules/${editingId}`, { title, version, content });
        setActionModal({
          isOpen: true,
          isAlert: true,
          title: 'Draft Saved',
          message: `Rulebook "${title}" v${version} updated successfully.`,
          confirmText: 'OK',
          onConfirm: () => setActionModal({ isOpen: false })
        });
      } else {
        const res = await api.post('/rules', { title, version, content });
        if (res?.data?._id) setEditingId(res.data._id);
        setActionModal({
          isOpen: true,
          isAlert: true,
          title: 'Draft Created',
          message: `New rulebook draft "${title}" v${version} created.`,
          confirmText: 'OK',
          onConfirm: () => setActionModal({ isOpen: false })
        });
      }
      fetchRulebooks();
    } catch (error) {
      setActionModal({
        isOpen: true,
        isAlert: true,
        title: 'Save Failed',
        message: error?.message || 'Failed to save rulebook draft.',
        confirmText: 'OK',
        onConfirm: () => setActionModal({ isOpen: false })
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndPublish = async () => {
    if (!title.trim() || !version.trim() || !content.trim()) {
      setActionModal({
        isOpen: true,
        isAlert: true,
        title: 'Missing Required Fields',
        message: 'Please fill in Document Title, Version, and Rulebook Content before publishing.',
        confirmText: 'OK',
        onConfirm: () => setActionModal({ isOpen: false })
      });
      return;
    }

    setActionModal({
      isOpen: true,
      title: 'Publish Rulebook Live?',
      message: `Are you sure you want to deploy "${title}" v${version} globally? This rulebook will immediately be visible to all operatives at /rules.`,
      confirmText: 'Publish Live',
      onConfirm: async () => {
        try {
          setSaving(true);
          let targetId = editingId;
          if (targetId) {
            await api.put(`/rules/${targetId}`, { title, version, content });
          } else {
            const res = await api.post('/rules', { title, version, content });
            targetId = res?.data?._id;
            setEditingId(targetId);
          }

          if (targetId) {
            await api.put(`/rules/${targetId}/publish`);
          }

          setActionModal({
            isOpen: true,
            isAlert: true,
            title: 'Protocol Published!',
            message: `"${title}" v${version} is now the LIVE official rulebook for the tournament!`,
            confirmText: 'OK',
            onConfirm: () => setActionModal({ isOpen: false })
          });
          fetchRulebooks();
        } catch (error) {
          setActionModal({
            isOpen: true,
            isAlert: true,
            title: 'Publish Error',
            message: error?.message || 'Failed to publish rulebook globally.',
            confirmText: 'OK',
            onConfirm: () => setActionModal({ isOpen: false })
          });
        } finally {
          setSaving(false);
        }
      }
    });
  };

  const handleEdit = (rulebook) => {
    setEditingId(rulebook._id);
    setTitle(rulebook.title);
    setVersion(rulebook.version);
    setContent(rulebook.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewDraft = () => {
    setEditingId(null);
    setTitle('');
    setVersion('');
    setContent('');
  };

  const handleDelete = async (id, rbTitle) => {
    setActionModal({
      isOpen: true,
      title: 'Delete Rulebook?',
      message: `Are you sure you want to permanently delete "${rbTitle}"? This action cannot be undone.`,
      confirmText: 'Delete',
      isDanger: true,
      onConfirm: async () => {
        try {
          await api.delete(`/rules/${id}`);
          if (editingId === id) {
            handleNewDraft();
          }
          fetchRulebooks();
          setActionModal({ isOpen: false });
        } catch (error) {
          setActionModal({
            isOpen: true,
            isAlert: true,
            title: 'Delete Failed',
            message: error?.message || 'Could not delete rulebook.',
            confirmText: 'OK',
            onConfirm: () => setActionModal({ isOpen: false })
          });
        }
      }
    });
  };

  const handlePublishDirect = async (id, rbTitle) => {
    setActionModal({
      isOpen: true,
      title: 'Publish Protocol Section?',
      message: `Deploy "${rbTitle}" as an active tournament rule? Operatives will see it immediately at /rules.`,
      confirmText: 'Make Active Rule',
      onConfirm: async () => {
        try {
          await api.put(`/rules/${id}/publish`);
          fetchRulebooks();
          setActionModal({
            isOpen: true,
            isAlert: true,
            title: 'Published!',
            message: `"${rbTitle}" is now live on the public directives portal.`,
            confirmText: 'OK',
            onConfirm: () => setActionModal({ isOpen: false })
          });
        } catch (error) {
          setActionModal({
            isOpen: true,
            isAlert: true,
            title: 'Publish Failed',
            message: error?.message || 'Could not publish rulebook section.',
            confirmText: 'OK',
            onConfirm: () => setActionModal({ isOpen: false })
          });
        }
      }
    });
  };

  const handleUnpublishDirect = async (id, rbTitle) => {
    setActionModal({
      isOpen: true,
      title: 'Move Section to Draft?',
      message: `Set "${rbTitle}" to Draft? It will be hidden from operatives until published again.`,
      confirmText: 'Set to Draft',
      isDanger: true,
      onConfirm: async () => {
        try {
          await api.put(`/rules/${id}/unpublish`);
          fetchRulebooks();
          setActionModal({
            isOpen: true,
            isAlert: true,
            title: 'Moved to Draft',
            message: `"${rbTitle}" is now a draft.`,
            confirmText: 'OK',
            onConfirm: () => setActionModal({ isOpen: false })
          });
        } catch (error) {
          setActionModal({
            isOpen: true,
            isAlert: true,
            title: 'Action Failed',
            message: error?.message || 'Could not update rule status.',
            confirmText: 'OK',
            onConfirm: () => setActionModal({ isOpen: false })
          });
        }
      }
    });
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));
  const publishedRulebooks = rulebooks.filter(r => r.status === 'PUBLISHED');
  const publishedRulebook = publishedRulebooks[0];

  if (loading) {
    return (
      <div className="p-12 text-center text-white font-rajdhani text-2xl tracking-widest flex items-center justify-center gap-3">
        <RotateCcw className="w-6 h-6 animate-spin text-[#FF6A00]" />
        LOADING PROTOCOL DIRECTIVES...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#111518]/90 border border-white/10 p-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF6A00]/10 border border-[#FF6A00]/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#FF6A00]" />
            </div>
            <div>
              <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest">
                Rulebook & Directives Editor
              </h2>
              <p className="font-inter text-xs text-[#B8C0C2]">
                Author, version, and deploy tournament Standard Operating Procedures.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {editingId && (
            <button
              type="button"
              onClick={handleNewDraft}
              className="flex items-center gap-1.5 bg-[#1A2023] border border-white/10 hover:border-white/30 text-[#B8C0C2] hover:text-white px-4 py-2 font-rajdhani font-bold text-sm uppercase tracking-wider transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> New Draft
            </button>
          )}

          <button
            type="button"
            onClick={handleInsertTemplate}
            className="flex items-center gap-1.5 bg-[#1A2023] border border-[#FF6A00]/30 hover:border-[#FF6A00] text-[#FF6A00] px-4 py-2 font-rajdhani font-bold text-sm uppercase tracking-wider transition-colors group"
            title="Load standard comprehensive BGMI esports tournament template"
          >
            <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Load BGMI Template
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="flex items-center gap-1.5 bg-[#1A2023] border border-white/20 hover:border-white text-white px-5 py-2 font-rajdhani font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {editingId ? 'Update Draft' : 'Save Draft'}
          </button>

          <button
            type="button"
            onClick={handleSaveAndPublish}
            disabled={saving}
            className="flex items-center gap-2 bg-[#FF6A00] hover:bg-white text-black px-6 py-2 font-rajdhani font-bold text-sm uppercase tracking-widest transition-colors shadow-lg shadow-[#FF6A00]/20 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            Deploy Live
          </button>
        </div>
      </div>

      {/* Main Grid: Editor on Left, Version History on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Editor & Preview Pane (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#111518]/90 border border-white/10 p-6 space-y-5">
            
            {/* Quick Rule Section Switcher */}
            {rulebooks.length > 0 && (
              <div className="pb-3 border-b border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-orbitron text-[#FF6A00] uppercase tracking-widest flex items-center gap-1.5 font-bold">
                    <BookOpen className="w-3.5 h-3.5" /> Rule Section Switcher ({rulebooks.length} Rules in Suite):
                  </span>
                  <button
                    type="button"
                    onClick={handleNewDraft}
                    className="text-[10px] font-orbitron text-[#B8C0C2] hover:text-[#FF6A00] uppercase tracking-wider underline cursor-pointer"
                  >
                    + Add New Rule Section
                  </button>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 custom-scrollbar">
                  {rulebooks.map((rb, idx) => {
                    const isCurrent = editingId === rb._id;
                    const short = rb.title.replace(/^\d+[\.\s]+/, '').split('&')[0].trim().slice(0, 14);
                    return (
                      <button
                        key={rb._id}
                        type="button"
                        onClick={() => handleEdit(rb)}
                        className={`px-2.5 py-1 text-xs font-orbitron uppercase tracking-wider shrink-0 transition-all border flex items-center gap-1 cursor-pointer ${
                          isCurrent
                            ? 'bg-[#FF6A00] text-black border-[#FF6A00] font-bold shadow-md shadow-[#FF6A00]/20'
                            : rb.status === 'PUBLISHED'
                            ? 'bg-[#080A0C] text-white border-white/20 hover:border-[#FF6A00]/50'
                            : 'bg-[#080A0C] text-[#B8C0C2] border-white/5 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <span className="text-[10px] opacity-75">v{rb.version}</span>
                        <span>{short || `Rule ${idx + 1}`}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Meta Row: Title & Version */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-orbitron text-[10px] text-[#FF6A00] uppercase tracking-widest mb-1.5">
                  Document Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. BATTLEGROUNDS Official Tournament Directives"
                  className="w-full bg-[#080A0C] border border-white/10 px-4 py-2.5 text-white font-inter text-sm focus:border-[#FF6A00] outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block font-orbitron text-[10px] text-[#FF6A00] uppercase tracking-widest mb-1.5">
                  Protocol Version
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="e.g. 1.0.0"
                  className="w-full bg-[#080A0C] border border-white/10 px-4 py-2.5 text-white font-mono text-sm focus:border-[#FF6A00] outline-none transition-colors"
                />
              </div>
            </div>

            {/* View Mode Switcher & Stats Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
              {/* Tab Pills */}
              <div className="inline-flex bg-[#080A0C] border border-white/10 p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode('edit')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-orbitron uppercase tracking-wider transition-colors ${
                    viewMode === 'edit'
                      ? 'bg-[#FF6A00] text-black font-bold'
                      : 'text-[#B8C0C2] hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Editor
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('split')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-orbitron uppercase tracking-wider transition-colors ${
                    viewMode === 'split'
                      ? 'bg-[#FF6A00] text-black font-bold'
                      : 'text-[#B8C0C2] hover:text-white'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" /> Split View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-orbitron uppercase tracking-wider transition-colors ${
                    viewMode === 'preview'
                      ? 'bg-[#FF6A00] text-black font-bold'
                      : 'text-[#B8C0C2] hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Live Preview
                </button>
              </div>

              {/* Document Statistics */}
              <div className="flex items-center gap-4 text-[11px] font-orbitron text-[#B8C0C2] uppercase tracking-wider">
                <span>{wordCount} Words</span>
                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                <span>{charCount} Chars</span>
                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                <span className="flex items-center gap-1 text-[#39B54A]">
                  <Clock className="w-3 h-3" /> {readTimeMinutes} min read
                </span>
              </div>
            </div>

            {/* Markdown Formatting Quick Toolbar */}
            {viewMode !== 'preview' && (
              <div className="flex flex-wrap items-center gap-1 p-2 bg-[#080A0C] border border-white/10 text-xs">
                <span className="text-[10px] font-orbitron text-[#FF6A00] uppercase tracking-widest px-2 mr-1">
                  Format:
                </span>
                
                <button
                  type="button"
                  onClick={() => insertFormatting('# ', '', 'Major Heading')}
                  className="px-2 py-1 bg-[#111518] hover:bg-[#FF6A00]/20 text-[#B8C0C2] hover:text-[#FF6A00] font-bold rounded transition-colors flex items-center gap-0.5"
                  title="Heading 1 (#)"
                >
                  <Heading1 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => insertFormatting('## ', '', 'Section Title')}
                  className="px-2 py-1 bg-[#111518] hover:bg-[#FF6A00]/20 text-[#B8C0C2] hover:text-[#FF6A00] font-bold rounded transition-colors flex items-center gap-0.5"
                  title="Heading 2 (##)"
                >
                  <Heading2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => insertFormatting('### ', '', 'Rule Clause')}
                  className="px-2 py-1 bg-[#111518] hover:bg-[#FF6A00]/20 text-[#B8C0C2] hover:text-[#FF6A00] font-bold rounded transition-colors flex items-center gap-0.5"
                  title="Heading 3 (###)"
                >
                  <Heading3 className="w-3.5 h-3.5" />
                </button>

                <div className="w-px h-5 bg-white/10 mx-1"></div>

                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**', 'bold text')}
                  className="px-2 py-1 bg-[#111518] hover:bg-[#FF6A00]/20 text-[#B8C0C2] hover:text-[#FF6A00] rounded transition-colors"
                  title="Bold (**text**)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*', 'italic text')}
                  className="px-2 py-1 bg-[#111518] hover:bg-[#FF6A00]/20 text-[#B8C0C2] hover:text-[#FF6A00] rounded transition-colors"
                  title="Italic (*text*)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>

                <div className="w-px h-5 bg-white/10 mx-1"></div>

                <button
                  type="button"
                  onClick={() => insertFormatting('- ', '', 'Bullet item')}
                  className="px-2 py-1 bg-[#111518] hover:bg-[#FF6A00]/20 text-[#B8C0C2] hover:text-[#FF6A00] rounded transition-colors"
                  title="Bullet List (- item)"
                >
                  <List className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => insertFormatting('1. ', '', 'Numbered item')}
                  className="px-2 py-1 bg-[#111518] hover:bg-[#FF6A00]/20 text-[#B8C0C2] hover:text-[#FF6A00] rounded transition-colors"
                  title="Numbered List (1. item)"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => insertFormatting('- [ ] ', '', 'Checklist requirement')}
                  className="px-2 py-1 bg-[#111518] hover:bg-[#FF6A00]/20 text-[#B8C0C2] hover:text-[#FF6A00] rounded transition-colors"
                  title="Checkbox Item (- [ ])"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                </button>

                <div className="w-px h-5 bg-white/10 mx-1"></div>

                <button
                  type="button"
                  onClick={() => insertFormatting('> ⚠️ **PENALTY:** ', '', 'Violation triggers immediate forfeit.')}
                  className="px-2.5 py-1 bg-[#111518] hover:bg-[#FF6A00]/20 text-[#B8C0C2] hover:text-[#FF6A00] rounded transition-colors flex items-center gap-1 text-[11px]"
                  title="Warning Callout Block"
                >
                  <Quote className="w-3.5 h-3.5" />
                  <span>Callout</span>
                </button>

                <button
                  type="button"
                  onClick={() => insertFormatting('\n| Rank | Points |\n| :--- | :--- |\n| #1 | 10 PTS |\n| #2 | 6 PTS |\n', '', '')}
                  className="px-2.5 py-1 bg-[#111518] hover:bg-[#FF6A00]/20 text-[#B8C0C2] hover:text-[#FF6A00] rounded transition-colors flex items-center gap-1 text-[11px]"
                  title="Insert Table Matrix"
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>

                <button
                  type="button"
                  onClick={() => insertFormatting('\n---\n', '', '')}
                  className="px-2 py-1 bg-[#111518] hover:bg-[#FF6A00]/20 text-[#B8C0C2] hover:text-[#FF6A00] text-[11px] rounded transition-colors"
                  title="Horizontal Section Divider"
                >
                  Divider
                </button>
              </div>
            )}

            {/* Editor / Preview Content Area */}
            <div className={`grid gap-4 ${viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              
              {/* Raw Textarea Editor */}
              {viewMode !== 'preview' && (
                <div className="flex flex-col">
                  <div className="flex items-center justify-between text-[10px] font-orbitron text-[#B8C0C2] uppercase tracking-widest mb-1.5 px-1">
                    <span>Markdown Source</span>
                    <span>Line Wrapped</span>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="# Write your tournament directives here in Markdown..."
                    className="w-full bg-[#080A0C] border border-white/10 px-4 py-4 text-white font-mono text-sm h-130 focus:border-[#FF6A00] outline-none custom-scrollbar leading-relaxed resize-y"
                  ></textarea>
                </div>
              )}

              {/* Rendered Live Markdown Preview */}
              {viewMode !== 'edit' && (
                <div className="flex flex-col">
                  <div className="flex items-center justify-between text-[10px] font-orbitron text-[#39B54A] uppercase tracking-widest mb-1.5 px-1">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Live Rendered View
                    </span>
                    <span className="text-[#B8C0C2]">Public Match</span>
                  </div>
                  <div className="w-full bg-[#080A0C] border border-white/10 p-6 text-white h-130 overflow-y-auto custom-scrollbar">
                    {content.trim() ? (
                      <div className="prose prose-invert prose-orange max-w-none font-inter text-[#B8C0C2] space-y-4">
                        <div className="border-b border-white/10 pb-4 mb-4">
                          <h1 className="font-rajdhani text-3xl font-bold text-white uppercase tracking-wider mb-1">
                            {title || 'Untitled Rulebook'}
                          </h1>
                          <div className="flex items-center gap-3">
                            <span className="font-orbitron text-xs text-[#FF6A00] font-bold uppercase">
                              Version: {version || 'Draft'}
                            </span>
                            <span className="text-white/20">•</span>
                            <span className="text-xs text-[#B8C0C2] font-inter">
                              {readTimeMinutes} min read
                            </span>
                          </div>
                        </div>
                        <ReactMarkdown>{content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-[#B8C0C2]/50 text-center p-8 space-y-2">
                        <FileText className="w-12 h-12 stroke-1" />
                        <p className="font-rajdhani text-lg uppercase tracking-wider">Preview is Empty</p>
                        <p className="text-xs max-w-xs">
                          Type markdown into the editor or click "Load BGMI Template" to see the live rendering.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

        {/* Right Sidebar: Version Archive & Live Status */}
        <div className="space-y-6">
          
          {/* Active Live Protocol Status Box */}
          <div className="bg-[#111518]/90 border border-white/10 p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="font-rajdhani text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#39B54A]" />
                Live Deployment
              </h3>
              <Link
                href="/rules"
                target="_blank"
                className="text-xs text-[#FF6A00] hover:text-white flex items-center gap-1 font-orbitron uppercase tracking-wider transition-colors"
              >
                <span>View Public</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {publishedRulebooks.length > 0 ? (
              <div className="bg-[#080A0C] border border-[#39B54A]/40 p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#39B54A]/5 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#39B54A] animate-pulse"></span>
                  <span className="font-orbitron text-[10px] font-bold text-[#39B54A] uppercase tracking-widest">
                    ACTIVE PROTOCOL SUITE
                  </span>
                </div>
                <h4 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider">
                  {publishedRulebooks.length} Active {publishedRulebooks.length === 1 ? 'Rule Section' : 'Rule Sections'}
                </h4>
                <div className="flex items-center gap-2 text-xs text-[#B8C0C2] font-inter mt-1 mb-4 flex-wrap">
                  <span className="font-mono text-[#FF6A00]">
                    v{publishedRulebooks[0]?.version} — v{publishedRulebooks[publishedRulebooks.length - 1]?.version}
                  </span>
                  <span>•</span>
                  <span className="text-[#39B54A]">Deployed Globally</span>
                </div>

                <Link
                  href="/rules"
                  target="_blank"
                  className="w-full bg-[#1A2023] hover:bg-[#FF6A00]/20 border border-white/10 hover:border-[#FF6A00] text-white py-2 text-xs font-rajdhani font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#FF6A00]" /> Inspect Live Rules (/rules)
                </Link>
              </div>
            ) : (
              <div className="bg-[#080A0C] border border-dashed border-white/10 p-6 text-center text-[#B8C0C2] text-xs">
                <AlertTriangle className="w-8 h-8 text-[#FF6A00] mx-auto mb-2 opacity-80" />
                <p className="font-bold text-white uppercase mb-1 font-rajdhani text-sm">No Live Rules</p>
                <p>Deploy a rule section to make your tournament directives publicly visible at /rules.</p>
              </div>
            )}
          </div>

          {/* Version History List */}
          <div className="bg-[#111518]/90 border border-white/10 p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="font-rajdhani text-lg font-bold text-white uppercase tracking-widest">
                Sections & Versions
              </h3>
              <span className="text-[10px] font-orbitron text-[#B8C0C2] uppercase">
                {rulebooks.length} {rulebooks.length === 1 ? 'Record' : 'Records'}
              </span>
            </div>

            <div className="space-y-3 max-h-125 overflow-y-auto custom-scrollbar pr-1">
              {rulebooks.map((rb) => {
                const isPublished = rb.status === 'PUBLISHED';
                const isCurrentEdit = editingId === rb._id;

                return (
                  <div
                    key={rb._id}
                    className={`bg-[#080A0C] border p-4 transition-all ${
                      isCurrentEdit
                        ? 'border-[#FF6A00] shadow-md shadow-[#FF6A00]/10'
                        : isPublished
                        ? 'border-[#39B54A]/30'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-bold font-orbitron uppercase tracking-widest px-2 py-0.5 ${
                              isPublished
                                ? 'bg-[#39B54A]/20 text-[#39B54A] border border-[#39B54A]/30'
                                : 'bg-white/5 text-[#B8C0C2] border border-white/10'
                            }`}
                          >
                            {rb.status}
                          </span>
                          <span className="font-mono text-xs text-[#FF6A00] font-bold">
                            v{rb.version}
                          </span>
                        </div>
                        <h4 className="font-rajdhani text-base font-bold text-white mt-1.5 uppercase line-clamp-1">
                          {rb.title || 'Untitled Rulebook'}
                        </h4>
                      </div>

                      {/* Item Quick Actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEdit(rb)}
                          className={`p-1.5 rounded transition-colors ${
                            isCurrentEdit
                              ? 'bg-[#FF6A00] text-black font-bold'
                              : 'text-[#B8C0C2] hover:text-white hover:bg-white/5'
                          }`}
                          title="Edit this rulebook"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(rb._id, rb.title)}
                          className="p-1.5 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          title="Delete this rulebook"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#B8C0C2] font-inter mt-3 pt-2 border-t border-white/5">
                      <span>{new Date(rb.updatedAt || rb.createdAt).toLocaleDateString()}</span>
                      
                      {isPublished ? (
                        <button
                          type="button"
                          onClick={() => handleUnpublishDirect(rb._id, rb.title)}
                          className="text-[#B8C0C2] hover:text-yellow-400 font-orbitron text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                          title="Move to Draft (Hide from public /rules)"
                        >
                          Move to Draft
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handlePublishDirect(rb._id, rb.title)}
                          className="text-[#39B54A] hover:text-white font-orbitron text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                          title="Publish to public /rules"
                        >
                          <Upload className="w-3 h-3" /> Make Live
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {rulebooks.length === 0 && (
                <div className="text-[#B8C0C2] text-center text-xs py-8">
                  No rulebook drafts archived yet.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {actionModal.isOpen && (
        <ActionModal
          isOpen={actionModal.isOpen}
          onClose={() => setActionModal({ isOpen: false })}
          title={actionModal.title}
          message={actionModal.message}
          confirmText={actionModal.confirmText}
          isDanger={actionModal.isDanger}
          onConfirm={actionModal.onConfirm}
          isAlert={actionModal.isAlert}
        />
      )}
    </div>
  );
}
