"use client";

import Image from 'next/image';
import { MapPin, Globe, Users, Award, Shield, Headphones, Heart, Plane } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const stats = [
  { icon: Globe, value: '50+', label: 'Countries' },
  { icon: Users, value: '10K+', label: 'Happy Travelers' },
  { icon: Award, value: '12', label: 'Years Experience' },
  { icon: MapPin, value: '500+', label: 'Destinations' },
];

const values = [
  {
    icon: Heart,
    title: 'Passionate Travel',
    desc: 'We live and breathe travel. Every trip is crafted with genuine love for exploration.',
  },
  {
    icon: Shield,
    title: 'Safe & Reliable',
    desc: 'Your safety is our priority. We partner with trusted providers worldwide.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: 'Our team is available around the clock to assist you before and during your trip.',
  },
  {
    icon: Plane,
    title: 'Tailor-Made Trips',
    desc: 'No two travelers are the same. We customize every itinerary to fit your needs.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2000"
          alt="About TraveMe"
          fill
          className="object-cover brightness-50"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
            About TraveMe
          </h1>
          <p className="text-lg md:text-xl text-white/80 mt-4 max-w-2xl mx-auto">
            We believe every journey tells a story. Let us help you write yours.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="text-center">
                  <Icon size={32} className="text-accent mx-auto" />
                  <p className="text-3xl font-bold text-neutral-900 mt-3">{s.value}</p>
                  <p className="text-sm text-neutral-500 mt-1">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <div className="relative h-[400px] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=800"
                  alt="Travel adventure"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="text-4xl font-semibold text-neutral-900 tracking-tight">
                Our Story
              </h2>
              <p className="text-neutral-600 mt-6 leading-relaxed">
                TraveMe was founded in 2013 by a group of passionate travelers who believed that
                travel should be accessible, personal, and unforgettable. What started as a small
                blog sharing hidden gems has grown into a trusted travel agency serving thousands
                of explorers every year.
              </p>
              <p className="text-neutral-600 mt-4 leading-relaxed">
                From the sun-kissed beaches of Greece to the vibrant streets of Tokyo, we have
                curated experiences that go beyond the typical tourist trail. Our team of local
                experts ensures every detail is taken care of, so you can focus on what matters
                most — creating memories that last a lifetime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-semibold text-neutral-900 tracking-tight">
            Our Mission
          </h2>
          <p className="text-lg text-neutral-600 mt-4 max-w-3xl mx-auto leading-relaxed">
            To make travel effortless, meaningful, and sustainable. We connect people with
            authentic experiences, support local communities, and promote responsible tourism
            that respects cultures and preserves our planet for future generations.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-neutral-900 tracking-tight text-center mb-14">
            Why Choose TraveMe
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-white border border-neutral-100 rounded-2xl p-6 text-center hover:shadow-sm transition"
                >
                  <Icon size={32} className="text-accent mx-auto" />
                  <h3 className="font-semibold text-neutral-900 mt-4">{v.title}</h3>
                  <p className="text-sm text-neutral-500 mt-2">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-semibold text-white tracking-tight">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-neutral-400 mt-4 text-lg max-w-xl mx-auto">
            Browse our destinations and start planning the trip of your dreams today.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link href="/destinations">
              <Button variant="primary" size="lg">Explore Destinations</Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
