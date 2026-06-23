"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts } from '@/lib/api';
import { CalendarDays } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image?: string;
  published_at?: string;
}

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    getBlogPosts({ limit: '3' })
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : data.data || [];
        setPosts(list.slice(0, 3));
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-semibold tracking-tight text-neutral-900">
            Although A Picture Is Worth A Thousand Words
          </h2>
          <p className="text-neutral-600 text-lg mt-4">
            Check out our latest travel stories and guides
          </p>
        </div>

        {loading && (
          <div className="grid md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-neutral-200 rounded-2xl" />
                <div className="mt-4 space-y-2">
                  <div className="h-5 bg-neutral-200 rounded w-3/4" />
                  <div className="h-4 bg-neutral-200 rounded w-full" />
                  <div className="h-4 bg-neutral-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-center text-neutral-400">
            Unable to load blog posts at this time.
          </p>
        )}

        {!loading && !error && posts.length === 0 && (
          <p className="text-center text-neutral-400">No blog posts yet.</p>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <Image
                    src={post.cover_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600'}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-4">
                  <CalendarDays size={14} />
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                    : 'Draft'}
                </div>
                <h3 className="font-semibold text-lg text-neutral-900 mt-1 group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-neutral-600 text-sm mt-2 line-clamp-2">
                  {post.excerpt}
                </p>
                <span className="inline-block mt-3 text-sm font-medium text-accent group-hover:underline">
                  Read More &rarr;
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
