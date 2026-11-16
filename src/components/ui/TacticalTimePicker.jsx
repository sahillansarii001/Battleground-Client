'use client';

import { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function TacticalTimePicker({
  value = '',
  onChange,
  placeholder = 'Select Time',
  name = 'startTime',
  preferredPlacement = 'up',
  required = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState(preferredPlacement);
  const containerRef = useRef(null);
  const hourListRef = useRef(null);
  const minuteListRef = useRef(null);

  // Parse 24h "HH:mm" or "HH:mm AM/PM" into { hour12, minute, period }
  const parseTime = (val) => {
    if (!val) {
      return { hour12: 12, minute: 0, period: 'PM' };
    }
    const match = String(val).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (match) {
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      let p = match[3] ? match[3].toUpperCase() : null;

      if (!p) {
        // Assume 24h format
        if (h >= 12) {
          p = 'PM';
          if (h > 12) h -= 12;
        } else {
          p = 'AM';
          if (h === 0) h = 12;
        }
      }
      return { hour12: h === 0 ? 12 : h, minute: isNaN(m) ? 0 : m, period: p || 'PM' };
    }
    return { hour12: 12, minute: 0, period: 'PM' };
  };

  const current = parseTime(value);
  const [selectedHour, setSelectedHour] = useState(current.hour12);
  const [selectedMinute, setSelectedMinute] = useState(current.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(current.period);

  // Sync state when external value changes
  useEffect(() => {
    if (value) {
      const p = parseTime(value);
      setSelectedHour(p.hour12);
      setSelectedMinute(p.minute);
      setSelectedPeriod(p.period);
    }
  }, [value]);

  // Determine smart placement
  useEffect(() => {
    if (isOpen) {
      if (preferredPlacement === 'auto' && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < 280) {
          setPlacement('up');
        } else {
          setPlacement('down');
        }
      } else {
        setPlacement(preferredPlacement);
      }
    }
  }, [isOpen, preferredPlacement]);

  // Click outside to close & Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Scroll to selected hour and minute when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (hourListRef.current) {
          const hourEl = hourListRef.current.querySelector(`[data-hour="${selectedHour}"]`);
          if (hourEl) {
            hourEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
          }
        }
        if (minuteListRef.current) {
          const minEl = minuteListRef.current.querySelector(`[data-minute="${selectedMinute}"]`);
          if (minEl) {
            minEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
          }
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, selectedHour, selectedMinute]);

  const emitChange = (h12, min, period) => {
    let h24 = h12;
    if (period === 'PM' && h24 < 12) h24 += 12;
    if (period === 'AM' && h24 === 12) h24 = 0;
    const formatted = `${String(h24).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    onChange?.(formatted);
  };

  const handleSelectHour = (h) => {
    setSelectedHour(h);
    emitChange(h, selectedMinute, selectedPeriod);
  };

  const handleSelectMinute = (m) => {
    setSelectedMinute(m);
    emitChange(selectedHour, m, selectedPeriod);
  };

  const handleSelectPeriod = (p) => {
    setSelectedPeriod(p);
    emitChange(selectedHour, selectedMinute, p);
  };

  const handleNow = () => {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const p = h >= 12 ? 'PM' : 'AM';
    if (h >= 12 && h > 12) h -= 12;
    if (h === 0) h = 12;
    setSelectedHour(h);
    setSelectedMinute(m);
    setSelectedPeriod(p);
    emitChange(h, m, p);
  };

  const getDisplayText = () => {
    if (!value) return '';
    const p = parseTime(value);
    return `${String(p.hour12).padStart(2, '0')}:${String(p.minute).padStart(2, '0')} ${p.period}`;
  };

  // 1 to 12
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  // 0 to 59
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const positionClass = placement === 'up'
    ? 'bottom-full right-0 mb-1.5'
    : 'top-full right-0 mt-1.5';

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Hidden input for HTML form submission */}
      <input type="hidden" name={name} value={value} required={required} />

      {/* Input Display Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#080A0C] border px-3.5 py-2.5 text-left text-sm font-mono flex items-center justify-between transition-colors cursor-pointer ${
          isOpen ? 'border-[#FF6A00] ring-1 ring-[#FF6A00]/40' : 'border-white/10 hover:border-white/20'
        }`}
      >
        <span className={value ? 'text-white font-medium' : 'text-zinc-500'}>
          {value ? getDisplayText() : placeholder}
        </span>
        <Clock className="w-4 h-4 text-white shrink-0 ml-2" />
      </button>

      {/* Custom 3-Column Time Dropdown */}
      {isOpen && (
        <div className={`absolute ${positionClass} z-50 w-64 bg-[#111518] border border-white/20 p-3 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150`}>
          {/* Tactical Corner Accents */}
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#FF6A00]" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#FF6A00]" />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#FF6A00]" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#FF6A00]" />

          {/* Selected Time Banner */}
          <div className="bg-[#080A0C] border border-white/10 py-1.5 px-3 mb-2.5 text-center">
            <span className="text-[10px] font-mono text-[#FF6A00] uppercase tracking-widest block">
              SET TIME //
            </span>
            <span className="font-mono text-base font-bold text-white tracking-widest">
              {String(selectedHour).padStart(2, '0')} : {String(selectedMinute).padStart(2, '0')}{' '}
              <span className="text-[#FF6A00]">{selectedPeriod}</span>
            </span>
          </div>

          {/* 3 Columns: Hour | Minute | Period */}
          <div className="grid grid-cols-3 gap-2">
            {/* Hours Column */}
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase text-center mb-1">
                HR
              </span>
              <div
                ref={hourListRef}
                className="h-36 overflow-y-auto space-y-1 pr-1 bg-[#080A0C]/60 border border-white/5 p-1 rounded-sm scrollbar-thin [scrollbar-color:#3f3f46_transparent]"
              >
                {hours.map((h) => {
                  const isSelected = selectedHour === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      data-hour={h}
                      onClick={() => handleSelectHour(h)}
                      className={`w-full py-1 text-center font-mono text-xs rounded-sm transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FF6A00] text-black font-bold shadow-sm shadow-[#FF6A00]/30 scale-105'
                          : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {String(h).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minutes Column */}
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase text-center mb-1">
                MIN
              </span>
              <div
                ref={minuteListRef}
                className="h-36 overflow-y-auto space-y-1 pr-1 bg-[#080A0C]/60 border border-white/5 p-1 rounded-sm scrollbar-thin [scrollbar-color:#3f3f46_transparent]"
              >
                {minutes.map((m) => {
                  const isSelected = selectedMinute === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      data-minute={m}
                      onClick={() => handleSelectMinute(m)}
                      className={`w-full py-1 text-center font-mono text-xs rounded-sm transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FF6A00] text-black font-bold shadow-sm shadow-[#FF6A00]/30 scale-105'
                          : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {String(m).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Period Column */}
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase text-center mb-1">
                AM/PM
              </span>
              <div className="h-36 flex flex-col justify-start space-y-2 bg-[#080A0C]/60 border border-white/5 p-1 rounded-sm">
                {['AM', 'PM'].map((p) => {
                  const isSelected = selectedPeriod === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleSelectPeriod(p)}
                      className={`w-full py-3 text-center font-mono text-xs font-bold rounded-sm transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FF6A00] text-black shadow-sm shadow-[#FF6A00]/30'
                          : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Controls: Now & Done */}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={handleNow}
              className="text-zinc-400 hover:text-[#FF6A00] text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Now
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-[#FF6A00] hover:bg-[#FF7A00] text-black text-xs font-bold font-rajdhani uppercase px-3.5 py-1 tracking-wider transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
