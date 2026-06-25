"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/api";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  AlertCircle,
  RefreshCw,
  Calendar,
  User,
  ArrowRight,
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

interface BlogResponse {
  data: BlogPost[];
  total: number;
  page: number;
  totalPages: number;
}

/* ------------------------------------------------------------------ */
/*  Loading Skeleton                                                   */
/* ------------------------------------------------------------------ */

function BlogSkeleton() {
  return (
    <div className="px-6 md:px-12 lg:px-24 max-w-8xl mx-auto py-16">
      <div className="mb-10">
        <div className="h-10 w-48 bg-neutral-200 rounded-lg animate-pulse" />
        <div className="h-5 w-52 bg-neutral-100 rounded mt-3 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
            <div className="h-56 bg-neutral-200 animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-20 bg-neutral-100 rounded-full animate-pulse" />
              <div className="h-6 w-full bg-neutral-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-neutral-100 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-neutral-100 rounded animate-pulse" />
              <div className="flex items-center gap-3 pt-2">
                <div className="h-4 w-24 bg-neutral-100 rounded animate-pulse" />
                <div className="h-4 w-20 bg-neutral-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty State                                                        */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
        <BookOpen size={36} className="text-neutral-300" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-700 mb-2">No blog posts yet</h3>
      <p className="text-neutral-500 max-w-md">
        Check back soon for travel stories, guides, and inspiration!
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Error State                                                        */
/* ------------------------------------------------------------------ */

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <AlertCircle size={36} className="text-red-400" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-700 mb-2">Something went wrong</h3>
      <p className="text-neutral-500 max-w-md mb-6">{message}</p>
      <Button variant="primary" size="md" onClick={onRetry} className="gap-2">
        <RefreshCw size={18} />
        Try Again
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pagination                                                         */
/* ------------------------------------------------------------------ */

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-neutral-200">
      <Button
        variant="secondary"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="gap-1.5"
      >
        <ChevronLeft size={16} />
        Previous
      </Button>

      <span className="text-sm text-neutral-500">
        Page {page} of {totalPages}
      </span>

      <Button
        variant="secondary"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="gap-1.5"
      >
        Next
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Content                                                       */
/* ------------------------------------------------------------------ */

function BlogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<BlogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      const page = searchParams.get("page");
      if (page) params.page = page;

      const result = await getBlogPosts(Object.keys(params).length > 0 ? params : undefined);

      if (result && Array.isArray(result.data)) {
        setData(result as BlogResponse);
      } else if (Array.isArray(result)) {
        setData({ data: result, total: result.length, page: 1, totalPages: 1 });
      } else {
        setData({ data: [], total: 0, page: 1, totalPages: 1 });
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    router.push(`/blog?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* -------- render -------- */

  return (
    <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto py-16">
      {/* Heading */}
      <div className="mb-12">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
          Our Blog
        </h1>
        <p className="text-neutral-500 mt-2 text-lg">
          Travel stories, guides, and inspiration
        </p>
      </div>

      {/* Loading */}
      {loading && <BlogSkeleton />}

      {/* Error */}
      {!loading && error && <ErrorState message={error} onRetry={fetchPosts} />}

      {/* Empty */}
      {!loading && !error && data && data.data.length === 0 && <EmptyState />}

      {/* Grid */}
      {!loading && !error && data && data.data.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.data.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-md transition-shadow duration-300"
              >
                {/* Cover image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={
                      post.cover_image || "/images/italy.jpg"
                    }
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                <div className="p-5">
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="accent">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge variant="default">+{post.tags.length - 2}</Badge>
                      )}
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="font-semibold text-xl text-neutral-900 group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-neutral-600 mt-2 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Author + Date */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-neutral-100 text-xs text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <User size={14} />
                      {post.author_name}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(post.published_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Read more */}
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-accent group-hover:underline">
                    Read Article
                    <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page export                                                        */
/* ------------------------------------------------------------------ */

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogSkeleton />}>
      <BlogContent />
    </Suspense>
  );
}