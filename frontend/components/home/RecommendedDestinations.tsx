"use client";

import { useEffect, useState, useRef } from 'react';
import { getDestinations } from '@/lib/api';
import DestinationCard from '@/components/destinations/DestinationCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  price: number;
  coverImage?: string;
  rating?: number;
  category?: string;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 animate-pulse shrink-0 w-[280px]">
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
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    dragState.current.isDown = true;
    dragState.current.startX = e.pageX - scrollRef.current.offsetLeft;
    dragState.current.scrollLeft = scrollRef.current.scrollLeft;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState.current.isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;
    scrollRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const handleMouseUp = () => {
    dragState.current.isDown = false;
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    dragState.current.isDown = false;
    setIsDragging(false);
  };

  useEffect(() => {
    let mounted = true;
    getDestinations({ limit: '8', is_featured: 'true' })
      .then((data) => {
        if (mounted) {
          const items = Array.isArray(data) ? data : data.data || [];
          const mapped = items.map((d: any) => ({
            id: d.id,
            name: d.name,
            slug: d.slug,
            location: d.location,
            description: d.description,
            price: Number(d.price_per_person),
            coverImage: d.images?.[0],
            rating: d.avg_rating ? Number(d.avg_rating) : undefined,
            category: d.category,
          }));
          setDestinations(mapped);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-4xl font-semibold text-neutral-900 tracking-tight">
            Recommended Destination
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition"
              aria-label="Previous"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition"
              aria-label="Next"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className={`flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {destinations.slice(0, 8).map((dest) => (
              <div key={dest.id} className={`snap-start shrink-0 w-[360px] ${isDragging ? 'pointer-events-none' : ''}`}>
                <DestinationCard
                  name={dest.name}
                  slug={dest.slug}
                  location={dest.location}
                  description={dest.description}
                  price={dest.price}
                  coverImage={dest.coverImage}
                  rating={dest.rating}
                  category={dest.category}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
