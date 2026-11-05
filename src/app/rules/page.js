"use client";
import { useState, useEffect, useMemo } from "react";
import { Shield, Search, BookOpen, Layers, CheckCircle2, ChevronRight, Hash } from "lucide-react";
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';

export default function Rules() {
  const [rulebook, setRulebook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRulebook();
  }, []);

  const fetchRulebook = async () => {
    try {
      const res = await api.get('/rules/current');
      if (res?.success) {
        setRulebook(res.data);
      }
    } catch (error) {
      console.warn('Notice: Failed to fetch rulebook', error?.message || error);
    } finally {
      setLoading(false);
    }
  };

  const sections = rulebook?.sections || [];

  const filteredSections = useMemo(() => {
    if (!sections || sections.length === 0) return [];
    
    return sections.filter((sec) => {
      const matchesTab = activeTab === 'ALL' || sec._id === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        sec.title?.toLowerCase().includes(q) || 
        sec.content?.toLowerCase().includes(q) ||
        sec.version?.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [sections, activeTab, searchQuery]);

  return (
    <div className="flex-1 py-28 bg-[#080A0C] relative z-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[#FF6A00]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FF6A00]/10 border border-[#FF6A00]/30 px-4 py-1 mb-5">
            <Shield className="w-4 h-4 text-[#FF6A00]" />
            <span className="font-orbitron text-[11px] font-bold text-[#FF6A00] tracking-widest uppercase">
              Official Directive Suite
            </span>
          </div>
          <h1 className="font-rajdhani text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 uppercase tracking-tight">
            Tournament <span className="text-[#FF6A00]">Directives</span>
          </h1>
          <p className="font-inter text-sm sm:text-base text-[#B8C0C2] max-w-2xl mx-auto">
            Mandatory Standard Operating Procedures for all participating operatives and squads. Failure to comply results in immediate disqualification.
          </p>

          {rulebook && (
            <div className="flex items-center justify-center gap-3 mt-4 text-xs font-orbitron uppercase text-[#B8C0C2]">
              <span className="px-2.5 py-0.5 bg-[#111518] border border-white/10 text-white font-mono">
                {rulebook.version ? `Suite ${rulebook.version}` : 'Version 1.0 - 14.0'}
              </span>
              <span>•</span>
              <span className="text-[#39B54A] flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {sections.length > 0 ? `${sections.length} Verified Rule Sections` : 'Official Verified Protocol'}
              </span>
            </div>
          )}
        </div>

        {/* Search & Filter Controls (If Multi-Section) */}
        {sections.length > 0 && (
          <div className="mb-8 space-y-4">
            {/* Search Input */}
            <div className="relative max-w-md mx-auto">
              <Search className="w-4 h-4 text-[#B8C0C2] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search directives (e.g. device, bootcamp, penalty, ban)..."
                className="w-full bg-[#111518] border border-white/10 pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-[#B8C0C2]/50 font-inter focus:border-[#FF6A00] outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#B8C0C2] hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Section Navigator Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 custom-scrollbar justify-start lg:justify-center">
              <button
                type="button"
                onClick={() => setActiveTab('ALL')}
                className={`px-3 py-1.5 text-xs font-orbitron uppercase tracking-wider shrink-0 transition-all border ${
                  activeTab === 'ALL'
                    ? 'bg-[#FF6A00] text-black border-[#FF6A00] font-bold shadow-md shadow-[#FF6A00]/20'
                    : 'bg-[#111518] text-[#B8C0C2] border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                All Sections ({sections.length})
              </button>
              {sections.map((sec, idx) => {
                const isActive = activeTab === sec._id;
                // Short label: e.g. "01 Device" or "02 Anti-Cheat"
                const shortTitle = sec.title.replace(/^\d+[\.\s]+/, '').split('&')[0].trim().slice(0, 14);
                return (
                  <button
                    key={sec._id}
                    type="button"
                    onClick={() => setActiveTab(sec._id)}
                    className={`px-2.5 py-1.5 text-xs font-orbitron uppercase tracking-wider shrink-0 transition-all border flex items-center gap-1 ${
                      isActive
                        ? 'bg-[#FF6A00] text-black border-[#FF6A00] font-bold shadow-md shadow-[#FF6A00]/20'
                        : 'bg-[#111518] text-[#B8C0C2] border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <span className="opacity-60 text-[10px]">R{idx + 1}</span>
                    <span>{shortTitle}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Content Box */}
        {loading ? (
          <div className="bg-[#111518]/90 border border-white/10 p-16 text-center text-white font-rajdhani text-2xl tracking-widest flex items-center justify-center gap-3">
            <Layers className="w-6 h-6 animate-spin text-[#FF6A00]" />
            DECRYPTING SYSTEM DIRECTIVES...
          </div>
        ) : sections.length > 0 ? (
          <div className="space-y-6">
            {filteredSections.map((sec, idx) => (
              <div
                key={sec._id}
                id={`section-${sec._id}`}
                className="bg-[#111518]/90 backdrop-blur-md border border-white/10 p-6 sm:p-8 hud-border hover:border-[#FF6A00]/40 transition-colors relative"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-white/10 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-[#FF6A00]/10 border border-[#FF6A00]/30 text-[#FF6A00] font-orbitron font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <h2 className="font-rajdhani text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
                      {sec.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="font-mono text-xs font-bold text-[#FF6A00] bg-[#080A0C] border border-[#FF6A00]/30 px-2.5 py-1">
                      Version {sec.version}
                    </span>
                    <span className="text-[10px] font-orbitron uppercase tracking-widest text-[#39B54A] bg-[#39B54A]/10 border border-[#39B54A]/30 px-2 py-1">
                      Active
                    </span>
                  </div>
                </div>

                {/* Markdown Content */}
                <div className="prose prose-invert prose-orange max-w-none font-inter text-[#B8C0C2] leading-relaxed">
                  <ReactMarkdown>{sec.content}</ReactMarkdown>
                </div>
              </div>
            ))}

            {filteredSections.length === 0 && (
              <div className="bg-[#111518]/90 border border-white/10 p-12 text-center text-[#B8C0C2]">
                <p className="font-rajdhani text-xl uppercase tracking-wider text-white mb-2">No matching rules found</p>
                <p className="text-xs mb-4">No directive matches your search query "{searchQuery}".</p>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setActiveTab('ALL'); }}
                  className="px-4 py-2 bg-[#FF6A00] text-black font-rajdhani font-bold text-xs uppercase tracking-widest"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        ) : rulebook && rulebook.content ? (
          /* Single Document View (Fallback) */
          <div className="bg-[#111518]/80 backdrop-blur-md border border-white/10 p-8 md:p-12 relative hud-border">
            <div className="border-b border-white/10 pb-6 mb-6">
              <h3 className="font-rajdhani text-3xl font-bold text-white uppercase tracking-widest">
                {rulebook.title || 'Official Rulebook'}
              </h3>
              <span className="font-orbitron text-xs text-[#FF6A00] uppercase">
                Version: {rulebook.version}
              </span>
            </div>
            <div className="prose prose-invert prose-orange max-w-none font-inter text-[#B8C0C2]">
              <ReactMarkdown>{rulebook.content}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="bg-[#111518]/90 border border-white/10 p-12 text-center text-[#B8C0C2] font-rajdhani text-xl tracking-widest uppercase mb-8">
            No official rulebook has been published by tournament administration yet.
          </div>
        )}

        {/* Footer Disclaimer */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="font-orbitron text-[10px] text-[#B8C0C2] tracking-widest uppercase">
            By initializing room deployment or entering match lobby, you accept all directives.
          </p>
          <span className="font-mono text-xs text-[#FF6A00]">
            BGMI TOURNAMENT PROTOCOL // AUTH V2
          </span>
        </div>

      </div>
    </div>
  );
}
