"use client";

import Image from 'next/image';
import { Star } from 'lucide-react';

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Large quote mark */}
        <div className="text-6xl text-accent/20 leading-none font-serif mb-6">
          &ldquo;
        </div>

        <blockquote className="text-2xl md:text-3xl text-neutral-700 leading-relaxed max-w-3xl mx-auto italic">
          &ldquo;Traveling alone was something I used to fear, but it turned out to be the most empowering experience of my life&rdquo;
        </blockquote>

        {/* Stars */}
        <div className="flex justify-center gap-1 mt-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={22}
              className="text-accent fill-accent"
            />
          ))}
        </div>

        {/* Reviewer */}
        <div className="flex flex-col items-center mt-8">
          <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-neutral-200">
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150"
              alt="Sarah Johnson"
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <p className="font-semibold text-neutral-900 mt-4">Sarah Johnson</p>
          <p className="text-sm text-neutral-500">Solo Traveler</p>
        </div>
      </div>
    </section>
  );
}
