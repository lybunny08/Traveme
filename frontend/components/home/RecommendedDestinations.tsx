"use client";

import { useEffect, useState } from 'react';
import { getDestinations } from '@/lib/api';
import DestinationCard from '@/components/destinations/DestinationCard';

interface Destination {
  _id: string;
  name: string;
  slug: string;
  location: string;
  country?: string;
  price: number;
  coverImage?: string;
  rating?: number;
  category?: string;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 animate-pulse">
      <div className="h-56 bg-neutral-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-neutral-200 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 rounded w-1/2" />
        <div className="flex justify-between items-center mt-4">
          <div className="h-6 bg-neutral-200 rounded w-1/3" />
          <div className="h-4 bg-neutral-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export default function RecommendedDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getDestinations({ limit: '8', is_featured: 'true' })
      .then((data) => {
        if (mounted) setDestinations(Array.isArray(data) ? data : data.destinations || []);
      })
      .catch(() => {
        // silently fail
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-semibold text-neutral-900 tracking-tight mb-10">
          Recommended Destination
        </h2>

        {loading ? (
          <div className="hidden md:grid md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Desktop: 4-column grid */}
            <div className="hidden md:grid md:grid-cols-4 gap-6">
              {destinations.slice(0, 8).map((dest) => (
                <DestinationCard key={dest._id} {...dest} />
              ))}
            </div>
            {/* Mobile: horizontal scroll */}
            <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-6 px-6">
              {destinations.slice(0, 8).map((dest) => (
                <div key={dest._id} className="snap-start shrink-0 w-[80vw] max-w-[320px]">
                  <DestinationCard {...dest} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
