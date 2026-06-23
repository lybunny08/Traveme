import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface DestinationCardProps {
  name: string;
  slug: string;
  location: string;
  country?: string;
  price: number;
  coverImage?: string;
  rating?: number;
  category?: string;
}

export default function DestinationCard({ name, slug, location, country, price, coverImage, rating, category }: DestinationCardProps) {
  const imgSrc = coverImage || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600';
  
  return (
    <Link href={`/destinations/${slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-md transition-shadow duration-300">
        <div className="relative h-56 overflow-hidden">
          <Image src={imgSrc} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 25vw" />
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 text-xs font-medium rounded-full px-3 py-1.5 text-neutral-800 backdrop-blur-sm">
              {country || location}
            </span>
          </div>
          {rating && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
              <Star size={14} className="text-accent fill-accent" />
              <span className="text-xs font-semibold">{Number(rating).toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-neutral-900 text-lg">{name}</h3>
          <p className="text-sm text-neutral-500 mt-1">{location}</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-lg font-bold text-neutral-900">${price}<span className="text-sm font-normal text-neutral-500">/person</span></span>
            <span className="text-sm font-medium text-accent group-hover:underline">Booking Now &rarr;</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
