"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getDestinations } from '@/lib/api';
import Button from '@/components/ui/Button';
import imagebg from '@/public/images/pool.jpg'

interface Destination {
  id: string;
  name: string;
  slug: string;
  location: string;
  price_per_person: number;
  images: string[];
}

export default function FeaturedStay() {
  const [featured, setFeatured] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getDestinations({ limit: '1', is_featured: 'true' })
      .then((data) => {
        if (!mounted) return;
        const list = data?.data || [];
        if (list.length > 0) {
          setFeatured(list[0]);
        }
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
    <section className="relative py-24 bg-dark overflow-hidden">
      {/* Background overlay image */}
      {/* {featured?.images?.[0] && ( */}
        <div className="absolute inset-0">
          <Image
            src={imagebg}
            alt=""
            fill
            className="object-cover opacity-30"
            sizes="100vw"
          />
        </div>
      {/* )} */}

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-white text-5xl font-semibold tracking-tight">
          Where Comfort Meets Convenience &mdash; Our Top Stay Picks for You
        </h2>

        {loading ? (
          <div className="mt-10 max-w-sm mx-auto">
            <div className="bg-white/10 rounded-2xl overflow-hidden animate-pulse">
              <div className="h-56 bg-white/10" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-white/10 rounded w-3/4" />
                <div className="h-4 bg-white/10 rounded w-1/2" />
                <div className="h-6 bg-white/10 rounded w-1/3 mt-4" />
              </div>
            </div>
          </div>
        ) : featured ? (
          <div className="mt-10 max-w-2xl mx-auto">
            {/* 2. Utilisation de grid pour un contrôle précis des colonnes */}
            <div className="bg-white p-4 grid grid-cols-[2fr,3fr] gap-6 rounded-2xl overflow-hidden shadow-lg items-center">
              
              {/* Côté Gauche (Image) */}
              <div className="relative h-56 rounded-xl overflow-hidden">
                <Image
                  src={featured.images?.[0] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600'}
                  alt={featured.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>

              {/* Côté Droite (Texte) - Prend maintenant 3 parts de la grille */}
              <div className="text-left pr-4">
                <h3 className="font-semibold text-neutral-900 text-xl">{featured.name}</h3>
                <p className="text-sm text-neutral-500 mt-1">{featured.location}</p>
                
                {/* Description ajoutée pour remplir l'espace si besoin */}
                <p className="text-sm text-neutral-600 mt-2 line-clamp-2">
                  Enjoy clean beaches and get more beautiful views with our exclusive stay package.
                </p>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-neutral-900">
                    ${featured.price_per_person}
                    <span className="text-sm font-normal text-neutral-500">/person</span>
                  </span>
                </div>
                
                <Link href={`/destinations/${featured.slug}`}>
                  <Button variant="primary" size="md" className="mt-4 w-full">
                    See More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-white/60 mt-10">No featured stay available at the moment.</p>
        )}
      </div>
    </section>
  );
}
