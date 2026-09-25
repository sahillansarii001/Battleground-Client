"use client";
import { useState, useEffect } from 'react';
import { Users, Crosshair, Swords, Trophy } from 'lucide-react';
import api from '@/lib/api';

export default function PublicStats() {
  const [stats, setStats] = useState({
    totalSquads: '--',
    activePlayers: '--',
    totalMatches: '--',
    prizePool: '--'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/public/stats');
        if (res.success) {
          setStats(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch public stats', error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Squads', value: stats.totalSquads, icon: Users },
    { label: 'Active Players', value: stats.activePlayers, icon: Crosshair },
    { label: 'Total Matches', value: stats.totalMatches, icon: Swords },
    { label: 'Prize Pool', value: stats.prizePool, icon: Trophy },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, i) => (
        <div key={i} className="bg-[#111518]/50 border border-white/5 p-6 backdrop-blur-sm relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#FF6A00] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <stat.icon className="w-6 h-6 text-[#B8C0C2] group-hover:text-[#FF6A00] transition-colors" />
            <span className="font-orbitron text-[10px] text-white/20 tracking-widest">0{i+1}</span>
          </div>
          <div className="font-rajdhani text-4xl font-bold text-white mb-1">{stat.value}</div>
          <div className="font-orbitron text-[10px] text-[#B8C0C2] uppercase tracking-widest">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
