"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

const categories = [
  { value: '', label: 'All' },
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
    <div className="relative -mt-8 z-10">
      <div className="max-w-5xl mx-auto px-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Destination / City"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input
              type="date"
              placeholder="Date Range"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Select
              placeholder="Landscape / Category"
              options={categories}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Button type="submit" variant="primary" size="lg" className="gap-2">
              <Search size={18} />
              Search
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
