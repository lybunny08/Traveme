"use client";

import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000"
          alt="Travel destination"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <h1 className="text-[clamp(3rem,6vw,6rem)] font-extrabold tracking-tight leading-none text-white">
          Easy Trips, More Fun.
        </h1>
        <p className="text-lg text-white/80 mt-6 max-w-xl mx-auto">
          Discover breathtaking destinations curated for every kind of traveler.
        </p>
        <div className="mt-10 flex gap-4 justify-center flex-wrap">
          <Link href="/destinations">
            <Button variant="primary" size="lg">
              Explore Destinations
            </Button>
          </Link>
          <Link href="/blog">
            <Button
              variant="secondary"
              size="lg"
              className="text-white border-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
