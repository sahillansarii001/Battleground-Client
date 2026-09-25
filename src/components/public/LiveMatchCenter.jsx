"use client";
import { useState, useEffect } from 'react';
import { Activity, Map as MapIcon } from 'lucide-react';
import api from '@/lib/api';

export default function LiveMatchCenter() {
  const [liveMatch, setLiveMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveMatch();
  }, []);

  const fetchLiveMatch = async () => {
    try {
      const res = await api.get('/matches');
      if (res.success) {
        const live = res.data.find(m => m.status === 'LIVE');
        setLiveMatch(live || null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !liveMatch) return null; // Don't show anything if no live match

  return (
    <div className="bg-[#080A0C] border border-white/10 p-6 md:p-10 relative overflow-hidden hud-border">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        <div className="w-full lg:w-1/3 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-[#39B54A]/10 border border-[#39B54A]/30 px-3 py-1 mb-6">
            <Activity className="w-4 h-4 text-[#39B54A]" />
            <span className="font-orbitron text-[11px] font-bold text-[#39B54A] tracking-widest uppercase animate-pulse">Live</span>
          </div>
          <h3 className="font-rajdhani text-5xl font-bold text-white mb-2 uppercase">{liveMatch.matchName}</h3>
          <p className="font-orbitron text-sm text-[#FF6A00] tracking-widest uppercase flex items-center justify-center lg:justify-start gap-2">
            <MapIcon className="w-4 h-4" /> {liveMatch.map} <span className="text-white/20 mx-2">|</span> {liveMatch.mode}
          </p>
        </div>
        
        <div className="w-full lg:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Date', value: new Date(liveMatch.date).toLocaleDateString() },
            { label: 'Time', value: liveMatch.startTime },
            { label: 'Status', value: 'IN PROGRESS' },
            { label: 'Match No', value: `M${liveMatch.matchNumber}` },
          ].map((stat, i) => (
            <div key={i} className="bg-[#111518] border border-white/10 p-4 text-center">
              <div className="font-rajdhani text-xl sm:text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
