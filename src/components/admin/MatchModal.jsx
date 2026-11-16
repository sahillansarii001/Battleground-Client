import { useState, useEffect } from 'react';
import { Calendar, Clock, Hash, Trophy, Compass, Users, X } from 'lucide-react';

export default function MatchModal({ isOpen, onClose, onSubmit, initialData = null, availableMaps = [], errorMsg = null }) {
  const [matchNum, setMatchNum] = useState('');
  const [matchName, setMatchName] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [map, setMap] = useState('ERANGEL');
  const [mode, setMode] = useState('SQUAD');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setMatchNum(initialData.matchNumber != null ? String(initialData.matchNumber) : '');
      setMatchName(initialData.matchName || '');
      if (initialData.date) {
        const d = new Date(initialData.date);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        setDate(`${d.getFullYear()}-${month}-${day}`);
      } else {
        setDate('');
      }
      setStartTime(initialData.startTime || '');
      setMap(initialData.map || (availableMaps?.[0] || 'ERANGEL'));
      setMode(initialData.mode || 'SQUAD');
    } else {
      setMatchNum('');
      setMatchName('');
      setDate('');
      setStartTime('');
      setMap(availableMaps?.[0] || 'ERANGEL');
      setMode('SQUAD');
    }
  }, [initialData, isOpen, availableMaps]);

  if (!isOpen) return null;

  const isEdit = !!initialData;

  const handleMatchNumChange = (e) => {
    const clean = e.target.value.replace(/\D/g, '');
    setMatchNum(clean);
  };

  const handleMatchNumKeyDown = (e) => {
    // Prevent 'e', 'E', '+', '-', '.', space and any other non-digit keys except editing keys
    if (['e', 'E', '+', '-', '.', ' ', ','].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleMatchNumPaste = (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    const clean = paste.replace(/\D/g, '');
    setMatchNum(clean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      matchNumber: Number(matchNum),
      matchName,
      date,
      startTime,
      map,
      mode
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative bg-[#111518] border border-white/10 p-6 md:p-8 w-full max-w-lg shadow-2xl">
        {/* Tactical Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF6A00]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF6A00]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#FF6A00] uppercase block">
              OPERATIONAL LOGISTICS //
            </span>
            <h2 className="text-white font-bold font-rajdhani text-2xl uppercase tracking-widest">
              {isEdit ? 'Edit Match Parameters' : 'Create New Match'}
            </h2>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-2.5 text-sm font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                {errorMsg}
              </div>
            )}

            {/* Match Number */}
            <div>
              <label className="flex items-center gap-1.5 text-[#B8C0C2] text-xs font-semibold uppercase tracking-wider mb-1.5">
                <Hash className="w-3.5 h-3.5 text-[#FF6A00]" />
                Match Number
              </label>
              <input 
                type="text" 
                inputMode="numeric"
                pattern="[0-9]*"
                name="matchNumber" 
                value={matchNum}
                onChange={handleMatchNumChange}
                onKeyDown={handleMatchNumKeyDown}
                onPaste={handleMatchNumPaste}
                placeholder="e.g. 1" 
                required 
                className="w-full bg-[#080A0C] border border-white/10 px-4 py-2.5 text-white font-mono text-sm focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]/50 outline-none transition-colors" 
              />
            </div>

            {/* Match Name */}
            <div>
              <label className="flex items-center gap-1.5 text-[#B8C0C2] text-xs font-semibold uppercase tracking-wider mb-1.5">
                <Trophy className="w-3.5 h-3.5 text-[#FF6A00]" />
                Match Name
              </label>
              <input 
                type="text" 
                name="matchName" 
                value={matchName}
                onChange={(e) => setMatchName(e.target.value)}
                placeholder="e.g. Erangel Qualifiers - Match 1"
                required 
                className="w-full bg-[#080A0C] border border-white/10 px-4 py-2.5 text-white font-mono text-sm focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]/50 outline-none transition-colors" 
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-[#B8C0C2] text-xs font-semibold uppercase tracking-wider mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FF6A00]" />
                  Date
                </label>
                <div className="relative">
                  <input 
                    type="date" 
                    name="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    onClick={(e) => {
                      try {
                        e.target.showPicker?.();
                      } catch (err) {}
                    }}
                    required 
                    className="w-full bg-[#080A0C] border border-white/10 px-3.5 py-2.5 text-white font-mono text-sm cursor-pointer [color-scheme:dark] focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]/50 outline-none transition-colors" 
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[#B8C0C2] text-xs font-semibold uppercase tracking-wider mb-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FF6A00]" />
                  Start Time
                </label>
                <div className="relative">
                  <input 
                    type="time" 
                    name="startTime" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    onClick={(e) => {
                      try {
                        e.target.showPicker?.();
                      } catch (err) {}
                    }}
                    required 
                    className="w-full bg-[#080A0C] border border-white/10 px-3.5 py-2.5 text-white font-mono text-sm cursor-pointer [color-scheme:dark] focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]/50 outline-none transition-colors" 
                  />
                </div>
              </div>
            </div>

            {/* Map and Mode */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-[#B8C0C2] text-xs font-semibold uppercase tracking-wider mb-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#FF6A00]" />
                  Map
                </label>
                <select 
                  name="map" 
                  value={map}
                  onChange={(e) => setMap(e.target.value)}
                  required 
                  className="w-full bg-[#080A0C] border border-white/10 px-3.5 py-2.5 text-white font-mono text-sm cursor-pointer focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]/50 outline-none transition-colors"
                >
                  {availableMaps && availableMaps.length > 0 ? (
                    availableMaps.map(m => (
                      <option key={m} value={m} className="bg-[#111518] text-white">{m}</option>
                    ))
                  ) : (
                    <option value="ERANGEL" className="bg-[#111518] text-white">ERANGEL</option>
                  )}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[#B8C0C2] text-xs font-semibold uppercase tracking-wider mb-1.5">
                  <Users className="w-3.5 h-3.5 text-[#FF6A00]" />
                  Mode
                </label>
                <select 
                  name="mode" 
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  required 
                  className="w-full bg-[#080A0C] border border-white/10 px-3.5 py-2.5 text-white font-mono text-sm cursor-pointer focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]/50 outline-none transition-colors"
                >
                  <option value="SQUAD" className="bg-[#111518] text-white">Squad</option>
                  <option value="TRIO" className="bg-[#111518] text-white">Trio</option>
                  <option value="DUO" className="bg-[#111518] text-white">Duo</option>
                  <option value="SOLO" className="bg-[#111518] text-white">Solo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/10">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 text-[#B8C0C2] hover:text-white uppercase text-xs font-bold font-mono tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-[#FF6A00] hover:bg-[#FF7A00] text-black font-bold uppercase tracking-widest px-6 py-2.5 text-sm transition-all shadow-lg shadow-[#FF6A00]/20 hover:shadow-[#FF6A00]/40 font-rajdhani cursor-pointer"
            >
              {isEdit ? 'Save Changes' : 'Create Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
