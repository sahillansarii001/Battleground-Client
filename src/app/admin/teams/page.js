"use client";
import { Search, Filter, Check, X, ShieldAlert } from 'lucide-react';

export default function AdminTeams() {
  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-[#111518]/90 border border-white/10 p-6">
        <div>
          <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
            Squad Operations
          </h2>
          <p className="font-inter text-xs text-[#B8C0C2] mt-1">Review and approve team deployments.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8C0C2]" />
            <input 
              type="text" 
              placeholder="SEARCH SQUADS..." 
              className="w-full bg-[#080A0C] border border-white/10 text-white font-orbitron text-[10px] uppercase tracking-widest pl-10 pr-4 py-2 focus:outline-none focus:border-[#FF6A00]"
            />
          </div>
          <button className="bg-[#080A0C] border border-white/10 p-2 text-[#B8C0C2] hover:text-[#FF6A00] transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Teams Table */}
      <div className="bg-[#111518]/90 border border-white/10 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#080A0C] border-b border-white/10 font-orbitron text-[9px] text-[#FF6A00] uppercase tracking-widest">
              <th className="p-4">Squad Name</th>
              <th className="p-4">Comms Email</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-inter text-sm text-white">
            {/* Sample Pending Row */}
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-4 font-rajdhani font-bold text-lg uppercase tracking-wider">TEAM SOUL</td>
              <td className="p-4 text-[#B8C0C2] text-xs">IGL@SOUL.COM</td>
              <td className="p-4">
                <span className="bg-[#FF6A00]/10 border border-[#FF6A00]/30 text-[#FF6A00] font-orbitron text-[8px] px-2 py-1 uppercase">SQUAD</span>
              </td>
              <td className="p-4">
                <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 font-orbitron text-[8px] px-2 py-1 uppercase">PENDING</span>
              </td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                  <button className="p-2 bg-[#39B54A]/10 text-[#39B54A] hover:bg-[#39B54A] hover:text-black border border-[#39B54A]/30 transition-colors" title="Approve">
                    <Check className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 transition-colors" title="Reject">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            {/* Sample Approved Row */}
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-4 font-rajdhani font-bold text-lg uppercase tracking-wider">GODLIKE</td>
              <td className="p-4 text-[#B8C0C2] text-xs">ADMIN@GODL.COM</td>
              <td className="p-4">
                <span className="bg-[#FF6A00]/10 border border-[#FF6A00]/30 text-[#FF6A00] font-orbitron text-[8px] px-2 py-1 uppercase">SQUAD</span>
              </td>
              <td className="p-4">
                <span className="bg-[#39B54A]/10 border border-[#39B54A]/30 text-[#39B54A] font-orbitron text-[8px] px-2 py-1 uppercase">APPROVED</span>
              </td>
              <td className="p-4 text-right">
                <button className="font-orbitron text-[9px] text-[#B8C0C2] hover:text-white uppercase tracking-widest border border-white/10 px-3 py-1.5 bg-[#080A0C]">
                  View Intel
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}