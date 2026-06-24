"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, CalendarDays, Sun, ChevronDown } from 'lucide-react';

const categories = [
  { value: '', label: 'Tout' },
  { value: 'beach', label: 'Beach' },
  { value: 'mountain', label: 'Mountain' },
  { value: 'city', label: 'City' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'family', label: 'Family' },
];

export default function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set('location', location.trim());
    if (date) params.set('date', date);
    if (category) params.set('category', category);
    const qs = params.toString();
    router.push(`/destinations${qs ? `?${qs}` : ''}`);
  };

  return (
    <div className="bg-zinc-950 p-6 md:p-12">
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end gap-6 md:gap-10"
      >
        {/* Champ Lieu */}
        <div className="relative flex-1 w-full flex items-center border-b border-gray-700 focus-within:border-white transition-colors">
          <MapPin className="text-white mr-3" size={24} />
          <input
            type="text"
            placeholder="City or address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent pb-3 pt-3 text-white placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Champ Date */}
        <div className="relative flex-1 w-full flex items-center border-b border-gray-700 focus-within:border-white transition-colors">
          <CalendarDays className="text-white mr-3" size={24} />
          <input
            type="text"
            placeholder="Add Dates"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-transparent pb-3 pt-3 text-white placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Champ Landscape */}
        <div className="relative flex-1 w-full flex items-center border-b border-gray-700 focus-within:border-white transition-colors">
          <Sun className="text-white mr-3" size={24} />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-transparent pb-3 pt-3 text-white focus:outline-none appearance-none cursor-pointer"
          >
            <option value="" className="text-gray-900">Landscape Type</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value} className="text-gray-900">
                {cat.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-0 text-gray-400 pointer-events-none" size={20} />
        </div>

        {/* Bouton Recherche */}
        <button
          type="submit"
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0 mx-auto md:mx-0 mt-6 md:mt-0 shadow-lg"
        >
          <Search className="text-black" size={32} />
        </button>
      </form>
    </div>
  );
}