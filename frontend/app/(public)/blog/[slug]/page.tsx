"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBlogPost } from "@/lib/api";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  ArrowLeft,
  Calendar,
  User,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  author_name: string;
  published_at: string;
  tags: string[];
}

/* ------------------------------------------------------------------ */
/*  Loading Skeleton                                                   */
/* ------------------------------------------------------------------ */

function PostSkeleton() {
  return (
    <div>
      <div className="h-80 bg-neutral-200 animate-pulse" />
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">
        <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
        <div className="h-10 w-3/4 bg-neutral-200 rounded animate-pulse" />
        <div className="flex gap-4">
          <div className="h-4 w-36 bg-neutral-100 rounded animate-pulse" />
          <div className="h-4 w-28 bg-neutral-100 rounded animate-pulse" />
        </div>
        <div className="space-y-3 pt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 w-full bg-neutral-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Error State                                                        */
/* ------------------------------------------------------------------ */

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <AlertCircle size={36} className="text-red-400" />
      </div>
      <h2 className="text-2xl font-semibold text-neutral-800 mb-2">
        Post not found
      </h2>
      <p className="text-neutral-500 max-w-md mb-6">{message}</p>
      <Link href="/blog">
        <Button variant="secondary" size="md" className="gap-2">
          <ArrowLeft size={18} />
          Back to Blog
        </Button>
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    getBlogPost(slug)
      .then((result) => {
        // The API might return { data: {...} } or the object directly
        const p: BlogPost = result.data ?? result;
        setPost(p);
      })
      .catch((err: any) => {
        setError(err?.message || "Could not load the blog post.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  /* -------- render -------- */

  if (loading) return <PostSkeleton />;
  if (error || !post) return <ErrorState message={error || "Post not found."} />;

  // Split content by double-newlines to render as paragraphs.
  // If content looks like HTML (contains tags), render it safely.
  const isHtml = /<[a-z][\s\S]*>/i.test(post.content);

  return (
    <div>
      {/* ========== COVER IMAGE ========== */}
      <div className="relative h-80 w-full overflow-hidden">
        <Image
          src={
            post.cover_image || "/images/italy.jpg"
          }
          alt={post.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* ========== ARTICLE ========== */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/blog" className="hover:text-accent transition-colors">
            Blog
          </Link>
          <ChevronRight size={14} />
          <span className="text-neutral-800 font-medium line-clamp-1">{post.title}</span>
        </nav>

        {/* Title */}
        <h1 className="text-4xl font-bold text-neutral-900 leading-tight mb-6">
          {post.title}
        </h1>

        {/* Author info row */}
        <div className="flex items-center gap-4 text-sm text-neutral-500 mb-8 pb-6 border-b border-neutral-200">
          <span className="flex items-center gap-1.5">
            <User size={16} />
            {post.author_name}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={16} />
            {new Date(post.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Content */}
        <div className="prose prose-neutral max-w-none">
          {isHtml ? (
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="leading-relaxed text-neutral-700 space-y-4"
            />
          ) : (
            post.content.split(/\n\n+/).map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed text-neutral-700 mb-5">
                {paragraph}
              </p>
            ))
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mt-10 pt-6 border-t border-neutral-200">
            <span className="text-sm font-medium text-neutral-600">Tags:</span>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="accent">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Back to Blog */}
        <div className="mt-12">
          <Link href="/blog">
            <Button variant="secondary" size="md" className="gap-2">
              <ArrowLeft size={18} />
              Back to Blog
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}