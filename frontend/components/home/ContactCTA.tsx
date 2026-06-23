"use client";

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ContactCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Handle subscription logic here
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2000"
          alt="Contact background"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
          Reach Out Anytime For Travel Tips Or Info.
        </h2>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <div className="flex-1">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              required
            />
          </div>
          <Button type="submit" variant="primary" size="lg">
            Submit
          </Button>
        </form>

        {submitted && (
          <p className="text-green-400 mt-4 text-sm">
            Thank you! We&rsquo;ll be in touch.
          </p>
        )}
      </div>
    </section>
  );
}
