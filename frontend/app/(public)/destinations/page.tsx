"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDestinations } from "@/lib/api";
import DestinationCard from "@/components/destinations/DestinationCard";
import DestinationFilters from "@/components/destinations/DestinationFilters";
import Button from "@/components/ui/Button";
import { Compass, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  category: string;
  price_per_person: number;
  cover_image_url?: string;
  images?: string[];
  is_featured: boolean;
  avg_rating: number;
  review_count: number;
}

interface DestinationsResponse {
  data: Destination[];
  total: number;
  page: number;
  totalPages: number;
}

/* ------------------------------------------------------------------ */
/*  Loading Skeleton                                                   */
/* ------------------------------------------------------------------ */

function DestinationsSkeleton() {
  return (
    <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto py-16">
      <div className="mb-10">
        <div className="h-10 w-48 bg-neutral-200 rounded-lg animate-pulse" />
        <div className="h-5 w-36 bg-neutral-100 rounded mt-3 animate-pulse" />
      </div>
      <div className="flex flex-wrap gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-11 w-40 bg-neutral-200 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
            <div className="h-56 bg-neutral-200 animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-5 w-3/4 bg-neutral-200 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-neutral-100 rounded animate-pulse" />
              <div className="flex justify-between pt-2">
                <div className="h-6 w-20 bg-neutral-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-neutral-100 rounded animate-pulse" />
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
        <Compass size={36} className="text-neutral-300" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-700 mb-2">No destinations found</h3>
      <p className="text-neutral-500 max-w-md">
        Try adjusting your filters or search criteria to discover more amazing places.
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
/*  Main Content (inside Suspense because of useSearchParams)          */
/* ------------------------------------------------------------------ */

function DestinationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<DestinationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};

      const location = searchParams.get("location");
      const category = searchParams.get("category");
      const minPrice = searchParams.get("minPrice");
      const maxPrice = searchParams.get("maxPrice");
      const page = searchParams.get("page");

      if (location) params.location = location;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (page) params.page = page;

      const result = await getDestinations(Object.keys(params).length > 0 ? params : undefined);

      // Normalise response shape
      if (result && Array.isArray(result.data)) {
        setData(result as DestinationsResponse);
      } else if (Array.isArray(result)) {
        setData({ data: result, total: result.length, page: 1, totalPages: 1 });
      } else {
        setData({ data: [], total: 0, page: 1, totalPages: 1 });
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load destinations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    router.push(`/destinations?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* -------- render -------- */

  return (
    <div className="px-6 md:px-12 lg:px-24 max-w-8xl mx-auto py-16">
      {/* Heading */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
          Destinations
        </h1>
        <p className="text-neutral-500 mt-2 text-lg">Find your next adventure</p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <DestinationFilters />
      </div>

      {/* Loading */}
      {loading && <DestinationsSkeleton />}

      {/* Error */}
      {!loading && error && <ErrorState message={error} onRetry={fetchDestinations} />}

      {/* Empty */}
      {!loading && !error && data && data.data.length === 0 && <EmptyState />}

      {/* Grid */}
      {!loading && !error && data && data.data.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {data.data.map((dest) => (
              <DestinationCard
                key={dest.id}
                name={dest.name}
                slug={dest.slug}
                location={dest.location}
                description={dest.description}
                price={dest.price_per_person}
                coverImage={dest.cover_image_url}
                rating={dest.avg_rating}
                category={dest.category}
              />
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
/*  Page export (Suspense boundary)                                    */
/* ------------------------------------------------------------------ */

export default function DestinationsPage() {
  return (
    <Suspense fallback={<DestinationsSkeleton />}>
      <DestinationsContent />
    </Suspense>
  );
}
