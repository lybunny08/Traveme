"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowRight } from 'lucide-react';

interface DestinationCardProps {
  name: string;
  slug: string;
  location: string;
  description?: string;
  price: number;
  coverImage?: string;
  rating?: number;
  category?: string;
}

export default function DestinationCard({ name, slug, location, description, price, coverImage, rating }: DestinationCardProps) {
  const imgSrc = coverImage || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600';
  
  return (
    <Link href={`/destinations/${slug}`} className="group block">
      {/* Container principal en flex pour aligner image et texte */}
      <div className='flex flex-col items-start gap-4 p-3 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300'>
        {/* Image */}
        <div className="relative w-full h-60 shrink-0 overflow-hidden rounded-lg">
          <Image 
            src={imgSrc} 
            alt={name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />

          {/* Overlay pays et note */}
          <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none">
            {location && (
              <span className="self-end text-xs font-semibold uppercase tracking-wider text-white bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                {location}
              </span>
            )}
            {rating !== undefined && (
              <span className="self-start flex items-center gap-1 text-xs font-semibold text-white bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                {Number(rating).toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Texte et Infos */}
        <div className="flex flex-col justify-between pt-2 w-full">
          <div>
            <h3 className="font-semibold text-neutral-900 text-lg leading-tight">{name}</h3>
            {description && (
              <p className="text-sm text-neutral-600 mt-2 line-clamp-2">
                {description.length > 200 ? `${description.slice(0, 200)}...` : description}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <span className="text-lg leading-none font-bold text-neutral-900">
              ${price}
              <span className="text-sm leading-none font-normal text-neutral-500">/pers</span>
            </span>
          </div>
          <div className="w-full border-t border-neutral-200 my-3"></div>
          <div className='flex w-full justify-between items-center gap-1.5 text-neutral-900 font-medium text-sm'>
            <span>Booking Now</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}