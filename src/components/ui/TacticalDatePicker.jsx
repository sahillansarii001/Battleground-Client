'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function TacticalDatePicker({
  value = '',
  onChange,
  placeholder = 'Select Date',
  name = 'date',
  preferredPlacement = 'up',
  required = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState(preferredPlacement);
  const containerRef = useRef(null);

  // Parse initial view year and month from value or today
  const parseValue = (val) => {
    if (!val) {
      const today = new Date();
      return { y: today.getFullYear(), m: today.getMonth(), d: today.getDate() };
    }
    const parts = String(val).split('-').map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return { y: parts[0], m: parts[1] - 1, d: parts[2] };
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate() };
    }
    const today = new Date();
    return { y: today.getFullYear(), m: today.getMonth(), d: today.getDate() };
  };

  const parsed = parseValue(value);
  const [viewYear, setViewYear] = useState(parsed.y);
  const [viewMonth, setViewMonth] = useState(parsed.m);

  // Sync view when value changes externally
  useEffect(() => {
    if (value) {
      const p = parseValue(value);
      setViewYear(p.y);
      setViewMonth(p.m);
    }
  }, [value]);

  // Determine smart placement if auto or calculate bounds
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

  // Handle click outside to close
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

  // Format date helper: YYYY-MM-DD
  const formatYMD = (year, monthIndex, day) => {
    const mm = String(monthIndex + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Display text in input box
  const getDisplayText = () => {
    if (!value) return '';
    const p = parseValue(value);
    const mm = MONTH_NAMES[p.m]?.substring(0, 3) || '';
    return `${String(p.d).padStart(2, '0')} ${mm} ${p.y}`;
  };

  // Prev / Next month navigation
  const prevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const nextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  // Jump to Today
  const handleToday = (e) => {
    e.stopPropagation();
    const today = new Date();
    const formatted = formatYMD(today.getFullYear(), today.getMonth(), today.getDate());
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    onChange?.(formatted);
    setIsOpen(false);
  };

  // Clear Date
  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.('');
    setIsOpen(false);
  };

  // Select day
  const handleSelectDay = (year, monthIndex, day) => {
    const formatted = formatYMD(year, monthIndex, day);
    onChange?.(formatted);
    setIsOpen(false);
  };

  // Generate calendar days grid
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const calendarCells = [];

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const prevMonthIdx = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    calendarCells.push({
      day,
      month: prevMonthIdx,
      year: prevYear,
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({
      day: i,
      month: viewMonth,
      year: viewYear,
      isCurrentMonth: true
    });
  }

  // Next month leading days (fill up to complete weeks)
  const remaining = (7 - (calendarCells.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const nextMonthIdx = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
    calendarCells.push({
      day: i,
      month: nextMonthIdx,
      year: nextYear,
      isCurrentMonth: false
    });
  }

  const today = new Date();
  const todayYMD = formatYMD(today.getFullYear(), today.getMonth(), today.getDate());

  const positionClass = placement === 'up'
    ? 'bottom-full left-0 mb-1.5'
    : 'top-full left-0 mt-1.5';

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
        <Calendar className="w-4 h-4 text-white shrink-0 ml-2" />
      </button>

      {/* Custom Tactical Calendar Dropdown */}
      {isOpen && (
        <div className={`absolute ${positionClass} z-50 w-72 bg-[#111518] border border-white/20 p-3.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150`}>
          {/* Tactical Corner Accents */}
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#FF6A00]" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#FF6A00]" />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#FF6A00]" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#FF6A00]" />

          {/* Month / Year Header */}
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/10">
            <span className="font-rajdhani font-bold text-white uppercase text-base tracking-widest">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 mb-1 text-center">
            {DAYS_OF_WEEK.map((day) => (
              <span key={day} className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarCells.map((cell, idx) => {
              const cellYMD = formatYMD(cell.year, cell.month, cell.day);
              const isSelected = value === cellYMD;
              const isToday = todayYMD === cellYMD;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDay(cell.year, cell.month, cell.day)}
                  className={`h-7 w-7 text-xs font-mono font-medium rounded-sm flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FF6A00] text-black font-bold shadow-md shadow-[#FF6A00]/40 scale-105'
                      : isToday
                      ? 'border border-[#FF6A00] text-[#FF6A00] hover:bg-[#FF6A00]/15'
                      : cell.isCurrentMonth
                      ? 'text-zinc-200 hover:bg-white/10 hover:text-white'
                      : 'text-zinc-600 hover:bg-white/5 hover:text-zinc-400'
                  }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Footer Controls: Clear & Today */}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={handleClear}
              className="text-zinc-400 hover:text-red-400 transition-colors uppercase tracking-wider text-[11px] cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="text-[#FF6A00] hover:text-[#FF7A00] font-bold uppercase tracking-wider text-[11px] hover:underline cursor-pointer"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
