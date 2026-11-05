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

// Standard BGMI Official Esports Rulebook Preset Template
const OFFICIAL_BGMI_TEMPLATE = `# BATTLEGROUNDS MOBILE INDIA - OFFICIAL TOURNAMENT RULEBOOK

## 1. GENERAL PROVISIONS & ELIGIBILITY
- **Age Requirement:** All operatives must be at least 16 years of age to participate.
- **Account Eligibility:** All competitors must use their registered BGMI Character ID. Level 35+ and Tier Platinum or above is mandatory.
- **Roster Lock:** Squad compositions are finalized at the close of registration. Emergency substitutions require official admin authorization 2 hours prior to deployment.

> ⚠️ **ZERO TOLERANCE POLICY:** Any use of third-party plugins, configuration edits (GFX tools, config files, iPad views on phones), or rooting/jailbreak exploits will trigger an immediate permanent ban.

---

## 2. HARDWARE & DEVICE REGULATIONS
- **Permitted Devices:** Only handheld smartphones (Android / iOS) are permitted.
- **Strictly Prohibited:**
  - Emulators (Bluestacks, Gameloop, etc.)
  - Tablets / iPads
  - Physical triggers, gaming attachments, or Bluetooth controllers
- **Screen Recording:** Top 3 squads in every lobby may be asked to submit continuous POV screen-recording with audio upon admin request.

---

## 3. LOBBY ENTRY & MATCH PROTOCOL
1. **Room Credentials:** Room ID and Password will be dispatched via registered email and operative terminal 15 minutes before match start.
2. **Slot Allocation:** Squads must strictly enter their designated slot numbers as displayed in the Match Schedule.
3. **Punctuality:** The match will initiate precisely at the scheduled time. Unfilled slots will not trigger match remakes.

---

## 4. SCORING MATRIX & TIE-BREAKERS
Points are aggregated across all scheduled deployments as follows:

| Placement | Placement Points | Kill Value |
| :--- | :--- | :--- |
| **#1 (WWCD)** | 10 PTS | 1 PT Per Kill |
| **#2** | 6 PTS | 1 PT Per Kill |
| **#3** | 5 PTS | 1 PT Per Kill |
| **#4** | 4 PTS | 1 PT Per Kill |
| **#5 - #16** | 0 PTS | 1 PT Per Kill |

### Tie-Breaker Priority:
1. Total Chicken Dinners (WWCD count)
2. Total Placement Points accumulated
3. Total Kill Points accumulated
4. Placement in the final round

---

## 5. CODE OF CONDUCT & PENALTIES
- **Teaming & Collusion:** Immediate disqualification and forfeiture of all points and prize pool.
- **Toxic Conduct:** Unsportsmanlike behavior in lobby chat, Discord, or live stream comments will result in point deductions (-5 PTS).
- **Match Remakes:** Remakes are ONLY sanctioned if 25%+ of operatives disconnect simultaneously prior to the plane path initialization.

---

## 6. PROTESTS & DISPUTE RESOLUTION
All disputes, cheating accusations, or scoring anomalies must be submitted via the **Protest Protocol** within **15 minutes** of match conclusion, accompanied by video or screenshot evidence. Admin decisions are final.`;

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
          setTitle('BATTLEGROUNDS Official Tournament Directives');
          setVersion('1.0.0');
          setContent(OFFICIAL_BGMI_TEMPLATE);
          setActionModal({ isOpen: false });
        }
      });
    } else {
      setTitle('BATTLEGROUNDS Official Tournament Directives');
      setVersion('1.0.0');
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
      title: 'Publish Protocol Globally?',
      message: `Deploy "${rbTitle}" as the active tournament rulebook? All visitors will see these rules immediately.`,
      confirmText: 'Make Active Rulebook',
      onConfirm: async () => {
        try {
          await api.put(`/rules/${id}/publish`);
          fetchRulebooks();
          setActionModal({
            isOpen: true,
            isAlert: true,
            title: 'Published!',
            message: 'Rulebook is now live on the public portal.',
            confirmText: 'OK',
            onConfirm: () => setActionModal({ isOpen: false })
          });
        } catch (error) {
          setActionModal({
            isOpen: true,
            isAlert: true,
            title: 'Publish Failed',
            message: error?.message || 'Could not publish rulebook.',
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
  const publishedRulebook = rulebooks.find(r => r.status === 'PUBLISHED');

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
                    className="w-full bg-[#080A0C] border border-white/10 px-4 py-4 text-white font-mono text-sm h-[520px] focus:border-[#FF6A00] outline-none custom-scrollbar leading-relaxed resize-y"
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
                  <div className="w-full bg-[#080A0C] border border-white/10 p-6 text-white h-[520px] overflow-y-auto custom-scrollbar">
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
                        <FileText className="w-12 h-12 stroke-[1]" />
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

            {publishedRulebook ? (
              <div className="bg-[#080A0C] border border-[#39B54A]/40 p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#39B54A]/5 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#39B54A] animate-pulse"></span>
                  <span className="font-orbitron text-[10px] font-bold text-[#39B54A] uppercase tracking-widest">
                    ACTIVE PROTOCOL
                  </span>
                </div>
                <h4 className="font-rajdhani text-xl font-bold text-white uppercase tracking-wider">
                  {publishedRulebook.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-[#B8C0C2] font-inter mt-1 mb-4">
                  <span className="font-mono text-[#FF6A00]">v{publishedRulebook.version}</span>
                  <span>•</span>
                  <span>
                    Deployed: {new Date(publishedRulebook.updatedAt || publishedRulebook.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleEdit(publishedRulebook)}
                  className="w-full bg-[#1A2023] hover:bg-[#FF6A00]/20 border border-white/10 hover:border-[#FF6A00] text-white py-2 text-xs font-rajdhani font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-3.5 h-3.5 text-[#FF6A00]" /> Edit Live Protocol
                </button>
              </div>
            ) : (
              <div className="bg-[#080A0C] border border-dashed border-white/10 p-6 text-center text-[#B8C0C2] text-xs">
                <AlertTriangle className="w-8 h-8 text-[#FF6A00] mx-auto mb-2 opacity-80" />
                <p className="font-bold text-white uppercase mb-1 font-rajdhani text-sm">No Live Rulebook</p>
                <p>Deploy a draft to make your tournament rules publicly visible at /rules.</p>
              </div>
            )}
          </div>

          {/* Version History List */}
          <div className="bg-[#111518]/90 border border-white/10 p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="font-rajdhani text-lg font-bold text-white uppercase tracking-widest">
                Version History
              </h3>
              <span className="text-[10px] font-orbitron text-[#B8C0C2] uppercase">
                {rulebooks.length} {rulebooks.length === 1 ? 'Record' : 'Records'}
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
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
                      
                      {!isPublished && (
                        <button
                          type="button"
                          onClick={() => handlePublishDirect(rb._id, rb.title)}
                          className="text-[#FF6A00] hover:text-white font-orbitron text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
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
