"use client";

import Image from 'next/image';
import { Waves, Compass, Heart, Sofa } from 'lucide-react';

const features = [
  { icon: Waves, title: 'Diving and Snorkeling' },
  { icon: Compass, title: 'Professional Tour Guide' },
  { icon: Heart, title: 'Memorable' },
  { icon: Sofa, title: 'Easy and Comfy' },
];

export default function ElevateSection() {
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

          {/* Right Column - Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative h-full min-h-[400px] rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=600"
                alt="Mountain adventure"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
