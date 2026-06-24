"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Waves, User, Camera, Star } from 'lucide-react';
import paris from '@/public/images/paris.jpg'
import view from '@/public/images/view.jpg'
import pov from '@/public/images/pov.jpg'
import person from '@/public/images/person.jpg'
import villa from '@/public/images/villa.jpg'

const features = [
  { icon: Waves, title: 'Diving and Snorkeling', paragraph: "The travel package includes lending services for diving and snorkeling equipment" },
  { icon: User, title: 'Professional Tour Guide' ,paragraph: "A professional who can make your travel experience more enjoyable"},
  { icon: Camera, title: 'Memorable' , paragraph: "Every moment of yours is captured by professional photography staff provided by travel"},
  { icon: Star, title: 'Easy and Comfy' , paragraph: "Travel agency provides complete and reliable travel packages"},
];

const images = [
  paris,
  view,
  pov,
  person,
  villa,
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
          <div className="w-full lg:w-1/2 md:my-8">
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
                  >
                    <Icon className="text-black mb-2" size={24} />
                    <h4 className="font-medium text-neutral-800 text-base">
                      {feature.title}
                    </h4>
                    <p className='text-sm text-neutral-500 mt-2 leading-relaxed'>{feature.paragraph}</p>
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
                  key={index}
                  src={src}
                  alt={`Adventure ${index + 1}`}
                  fill
                  className={`object-cover transition-opacity duration-700 ${
                    index === current ? 'opacity-100' : 'opacity-0'
                  }`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ))}

              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <div className="bg-white flex flex-nowrap gap-2 p-2 rounded-xl overflow-hidden">
                  {images.map((src, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrent(index)}
                      className={`relative flex-shrink-0 h-10 w-14 rounded-lg overflow-hidden transition-all duration-300 ${
                        index === current
                          ? 'ring-2 ring-black scale-110'
                          : 'opacity-70 hover:opacity-100'
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
