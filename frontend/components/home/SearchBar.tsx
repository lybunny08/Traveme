"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, MapPin, CalendarDays, Sun, ChevronDown,
  ChevronLeft, ChevronRight,
  Waves, Mountain, Building2, Landmark, Compass, PawPrint, Heart, Users,
} from 'lucide-react';

const categoryIcons: Record<string, typeof Waves> = {
  beach: Waves,
  mountain: Mountain,
  city: Building2,
  cultural: Landmark,
  adventure: Compass,
  wildlife: PawPrint,
  romantic: Heart,
  family: Users,
};

const categories = [
  { value: '', label: 'Landscape Type' },
  { value: 'beach', label: 'Beach' },
  { value: 'mountain', label: 'Mountain' },
  { value: 'city', label: 'City' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'family', label: 'Family' },
];

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

function formatDisplay(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());

  const catRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
      if (calRef.current && !calRef.current.contains(e.target as Node)) setCalOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedLabel = categories.find((c) => c.value === category)?.label || 'Landscape Type';
  const SelectedIcon = category ? (categoryIcons[category] || Sun) : Sun;

  const calendarDays = useMemo(() => getCalendarDays(calYear, calMonth), [calYear, calMonth]);

  const handlePrevMonth = () => {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11); }
    else setCalMonth((m) => m - 1);
  };
  const handleNextMonth = () => {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0); }
    else setCalMonth((m) => m + 1);
  };

  const handleSelectDay = (day: number) => {
    const d = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setDate(d);
    setCalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set('location', location.trim());
    if (date) params.set('date', date);
    if (category) params.set('category', category);
    const qs = params.toString();
    router.push(`/destinations${qs ? `?${qs}` : ''}`);
  };

  const today = new Date();

  return (
    <div className="bg-black p-6 md:p-12">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10"
      >
        {/* Champ Lieu */}
        <div className="relative flex-1 w-full flex items-center border-b border-gray-700 focus-within:border-white transition-colors">
          <MapPin className="text-white mr-3 shrink-0" size={24} />
          <input
            type="text"
            placeholder="City or address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent pb-3 pt-3 text-white placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Champ Date - Calendar Picker */}
        <div ref={calRef} className="relative flex-1 w-full">
          <div
            className="flex items-center border-b border-gray-700 transition-colors cursor-pointer"
            onClick={() => { setCalOpen((v) => !v); setCatOpen(false); }}
          >
            <CalendarDays className="text-white mr-3 shrink-0" size={24} />
            <span className={`w-full pb-3 pt-3 text-left ${date ? 'text-white' : 'text-gray-400'}`}>
              {date ? formatDisplay(date) : 'Add Dates'}
            </span>
            <ChevronDown
              size={20}
              className={`text-gray-400 transition-transform duration-300 shrink-0 ${calOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {calOpen && (
            <div className="absolute top-full left-0 right-0 mt-3 z-50 bg-zinc-900 border border-zinc-700 rounded-2xl p-4 shadow-2xl shadow-black/50 backdrop-blur-xl">
              {/* Month/Year Header */}
              <div className="flex items-center justify-between mb-4">
                <button type="button" onClick={handlePrevMonth} className="p-1 text-gray-400 hover:text-white transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-medium text-white">
                  {MONTHS[calMonth]} {calYear}
                </span>
                <button type="button" onClick={handleNextMonth} className="p-1 text-gray-400 hover:text-white transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 mb-2">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="text-center text-[11px] font-medium text-gray-500 uppercase tracking-wider py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  if (day === null) return <div key={`e-${i}`} />;

                  const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
                  const isSelected = date === `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isPast = new Date(calYear, calMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={isPast}
                      onClick={() => handleSelectDay(day)}
                      className={`h-8 w-full rounded-lg text-sm transition-all ${
                        isSelected
                          ? 'bg-white text-black font-semibold'
                          : isPast
                            ? 'text-gray-600 cursor-not-allowed'
                            : isToday
                              ? 'text-white ring-1 ring-white/30 hover:bg-white/10'
                              : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Champ Landscape */}
        <div ref={catRef} className="relative flex-1 w-full">
          <div
            className="flex items-center border-b border-gray-700 transition-colors cursor-pointer"
            onClick={() => { setCatOpen((v) => !v); setCalOpen(false); }}
          >
            <SelectedIcon className="text-white mr-3 shrink-0" size={24} />
            <span className={`w-full pb-3 pt-3 text-left ${category ? 'text-white' : 'text-gray-400'}`}>
              {selectedLabel}
            </span>
            <ChevronDown
              size={20}
              className={`text-gray-400 transition-transform duration-300 shrink-0 ${catOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {catOpen && (
            <div className="absolute top-full left-0 right-0 mt-3 z-50 bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 backdrop-blur-xl">
              {categories.map((cat) => {
                const Icon = cat.value ? (categoryIcons[cat.value] || Sun) : Sun;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => { setCategory(cat.value); setCatOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      category === cat.value
                        ? 'bg-white/10 text-white'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon size={16} className={`shrink-0 ${category === cat.value ? 'text-white' : 'text-gray-500'}`} />
                    {cat.label}
                    {category === cat.value && (
                      <ChevronDown size={14} className="ml-auto -rotate-90 text-white/60" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bouton Recherche */}
        <button
          type="submit"
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0 mx-auto md:mx-0 mt-6 md:mt-0 shadow-lg"
        >
          <Search className="text-black" size={30} />
        </button>
      </form>
    </div>
  );
}
