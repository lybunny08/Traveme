"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Waves, Compass, Heart, Sofa } from 'lucide-react';

const features = [
  { icon: Waves, title: 'Diving and Snorkeling' },
  { icon: Compass, title: 'Professional Tour Guide' },
  { icon: Heart, title: 'Memorable' },
  { icon: Sofa, title: 'Easy and Comfy' },
];

const images = [
  'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
  'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
];

export default function ElevateSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch ">
          {/* Left Column */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl font-semibold text-neutral-900 tracking-tight">
              Elevate Your Adventures
            </h2>
            <p className="text-neutral-600 text-lg leading-relaxed mt-6">
              We are a travel agency that specializes in customizing trips according to your preferences, needs, and dreams.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-10">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="rounded-xl border border-neutral-100 p-4 hover:shadow-sm transition cursor-default"
                  >
                    <Icon className="text-accent mb-2" size={24} />
                    <h4 className="font-medium text-neutral-800 text-sm">
                      {feature.title}
                    </h4>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Rotating Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative h-full min-h-[400px] rounded-xl overflow-hidden">
              {images.map((src, index) => (
                <Image
                  key={src}
                  src={src}
                  alt={`Adventure ${index + 1}`}
                  fill
                  className={`object-cover transition-opacity duration-700 ${
                    index === current ? 'opacity-100' : 'opacity-0'
                  }`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ))}

              {/* Image indicators - montrent les images accessibles */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <div className='bg-white flex gap-2 p-2 rounded-xl'>
                  {images.map((src, index) => (
                    <button
                      key={src}
                      onClick={() => setCurrent(index)}
                      className={`relative h-10 w-14 rounded-lg overflow-hidden transition-all duration-300 ${
                        index === current
                          ? 'ring-2 ring-white scale-110' 
                          : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={src}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
