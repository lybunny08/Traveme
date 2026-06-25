"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import hero1 from '@/public/images/hero1.jpg'
import hero2 from '@/public/images/hero2.jpg'
import hero3 from '@/public/images/hero3.jpg'
import hero4 from '@/public/images/hero4.jpg'
import hero5 from '@/public/images/hero5.jpg'
import hero6 from '@/public/images/hero6.jpg'
import { ArrowRight } from 'lucide-react';

const heroImages = [hero1, hero2, hero3, hero4, hero5, hero6];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    const tick = setInterval(() => {
      setProgress((prev) => Math.min(prev + 100 / (5000 / 50), 100));
    }, 50);
    return () => { clearInterval(interval); clearInterval(tick); };
  }, [current]);

  const goNext = () => setCurrent((prev) => (prev + 1) % heroImages.length);
  const goPrev = () => setCurrent((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  return (
    <section className="relative h-screen w-full overflow-hidden -mt-16">
      {/* Background Image */}
      <div className="absolute inset-0">
        {heroImages.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt="Travel destination"
            fill
            className={`object-cover transition-opacity duration-1000 ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
            priority={index === 0}
            sizes="100vw"
          />
        ))}
        {/* <div className="absolute inset-0 bg-black/10" /> */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-row items-end justify-between pb-10 h-full px-6">
        <div>
          <h1 className="text-[clamp(2rem,4vw,4rem)] font-bold tracking-tight leading-none text-white">
            Easy Trips, <br /> More Fun.
          </h1>
          <p className="text-md text-white/80 mt-3 max-w-sm ">
            Discover new way to travel that's fun,easy,and stress-free. 
            Turn your dream destinations into unforgettable realities
          </p>
          <div className="mt-5 flex gap-4 flex-wrap">
            <Link href="/destinations">
              <Button variant="primary" size="md" className='flex gap-4'>
                Explore Destinations
                <ArrowRight size={20} ></ArrowRight>
              </Button>
            </Link>
          </div>
        </div>
        <div className='text-white flex flex-col items-end gap-1'>
          <span className="text-sm font-medium tabular-nums">{current + 1}/{heroImages.length}</span>
          <div className='flex items-center gap-3'>
            <button onClick={goPrev} className="text-white/60 hover:text-white transition-colors text-lg leading-none pb-1" aria-label="Previous">&lsaquo;</button>
            <div className='w-24 h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer' onClick={goNext}>
              <div className='h-full bg-white rounded-full transition-all duration-[50ms] linear' style={{ width: `${progress}%` }} />
            </div>
            <button onClick={goNext} className="text-white/60 hover:text-white transition-colors text-lg leading-none pb-1" aria-label="Next">&rsaquo;</button>
          </div>
        </div>
      </div>
    </section>
  );
}
