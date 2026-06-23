"use client";

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'beach', label: 'Beach' },
  { value: 'mountain', label: 'Mountain' },
  { value: 'city', label: 'City' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'family', label: 'Family' },
];

export default function DestinationFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentLocation = searchParams.get('location') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/destinations?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    router.push('/destinations');
  };

  const hasFilters = currentLocation || currentCategory || currentMinPrice || currentMaxPrice;

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="w-full sm:w-auto sm:min-w-[200px]">
        <Input
          placeholder="Search destinations..."
          value={currentLocation}
          onChange={(e) => updateFilters('location', e.target.value)}
        />
      </div>
      <div className="w-full sm:w-auto sm:min-w-[180px]">
        <Select
          options={categories}
          value={currentCategory}
          onChange={(e) => updateFilters('category', e.target.value)}
        />
      </div>
      <div className="w-full sm:w-auto sm:min-w-[130px]">
        <Input
          type="number"
          placeholder="Min price"
          value={currentMinPrice}
          onChange={(e) => updateFilters('minPrice', e.target.value)}
        />
      </div>
      <div className="w-full sm:w-auto sm:min-w-[130px]">
        <Input
          type="number"
          placeholder="Max price"
          value={currentMaxPrice}
          onChange={(e) => updateFilters('maxPrice', e.target.value)}
        />
      </div>
      {hasFilters && (
        <Button
          variant="ghost"
          size="md"
          onClick={clearFilters}
          className="gap-1.5 text-neutral-500"
        >
          <X size={16} />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
