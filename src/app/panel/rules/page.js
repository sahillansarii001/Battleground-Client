"use client";
import { useState, useEffect } from 'react';
import { BookOpen, ShieldAlert, Crosshair, AlertTriangle, Download } from 'lucide-react';
import api from '@/lib/api';

export default function Rules() {
  const [rulebook, setRulebook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRulebook();
  }, []);

  const fetchRulebook = async () => {
    try {
      const res = await api.get('/rules/current');
      if (res.success) {
        setRulebook(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch rulebook', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <BookOpen className="w-12 h-12 text-[#FF6A00] mx-auto mb-4" />
        <h2 className="font-rajdhani text-4xl font-bold text-white uppercase tracking-widest">Tournament Rulebook</h2>
        <p className="font-orbitron text-[10px] text-[#B8C0C2] uppercase tracking-widest mt-2 border-t border-b border-white/10 py-2 inline-block">Standard Operating Procedures</p>
      </div>

      {loading ? (
        <div className="text-white text-center py-10 font-rajdhani text-xl">Loading Rulebook...</div>
      ) : rulebook && rulebook.content ? (
        <div className="bg-[#111518]/90 border border-[#FF6A00]/50 p-8 mb-8 border-l-4 border-l-[#FF6A00]">
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <h3 className="font-rajdhani text-3xl font-bold text-white uppercase tracking-widest">{rulebook.title || 'Official Rulebook'}</h3>
            <span className="font-orbitron text-xs text-[#B8C0C2] uppercase">Version: {rulebook.version}</span>
          </div>
          <div className="prose prose-invert prose-orange max-w-none font-inter text-[#B8C0C2]">
            {/* Simple split by newline, you can add a real markdown parser like react-markdown if installed */}
            {rulebook.content.split('\n').map((line, i) => (
              <p key={i} className="mb-2">{line}</p>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#111518]/90 border border-white/10 p-6 text-center text-[#B8C0C2] mb-8">
          No official rulebook has been published yet.
        </div>
      )}
    </div>
  );
}
