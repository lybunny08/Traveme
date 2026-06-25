"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDestination, createReview } from "@/lib/api";
import { useAuth } from "@/app/AuthContext";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Textarea from "@/components/ui/Textarea";
import {
  MapPin,
  Tag,
  Star,
  ChevronRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  User,
  Calendar,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Review {
  id: string;
  user: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  rating: number;
  comment: string;
  created_at: string;
}

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
  reviews?: Review[];
}

/* ------------------------------------------------------------------ */
/*  Star Rating Component                                              */
/* ------------------------------------------------------------------ */

function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`transition-colors ${
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          }`}
        >
          <Star
            size={20}
            className={
              star <= value
                ? "fill-accent text-accent"
                : "fill-none text-neutral-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading Skeleton                                                   */
/* ------------------------------------------------------------------ */

function DetailSkeleton() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="h-[60vh] bg-neutral-200 animate-pulse" />
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12">
        {/* Breadcrumb */}
        <div className="h-4 w-64 bg-neutral-200 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-3/4 bg-neutral-200 rounded animate-pulse" />
            <div className="flex gap-4">
              <div className="h-5 w-32 bg-neutral-100 rounded animate-pulse" />
              <div className="h-5 w-24 bg-neutral-100 rounded animate-pulse" />
              <div className="h-5 w-20 bg-neutral-100 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-neutral-100 rounded animate-pulse" />
              <div className="h-4 w-full bg-neutral-100 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-neutral-100 rounded animate-pulse" />
            </div>
          </div>
          {/* Right sidebar */}
          <div className="h-64 bg-neutral-100 rounded-2xl animate-pulse" />
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
        Destination not found
      </h2>
      <p className="text-neutral-500 max-w-md mb-6">{message}</p>
      <Link href="/destinations">
        <Button variant="secondary" size="md" className="gap-2">
          <ArrowLeft size={18} />
          Back to Destinations
        </Button>
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function DestinationDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { user, token } = useAuth();
  const slug = params.slug;

  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    getDestination(slug)
      .then((result) => {
        // The API might return { data: {...} } or the object directly
        const dest: Destination = result.data ?? result;
        setDestination(dest);
        setReviews(dest.reviews ?? []);
      })
      .catch((err: any) => {
        setError(err?.message || "Could not load destination details.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !destination) return;
    setSubmittingReview(true);
    setReviewError(null);
    setReviewSuccess(false);

    try {
      const response = await createReview(
        {
          destination_id: destination.id,
          rating: reviewRating,
          comment: reviewComment,
        },
        token
      );

      // Optimistically add the new review to the list
      const newReview: Review = response.data ?? response;
      setReviews((prev) => [newReview, ...prev]);
      setReviewSuccess(true);
      setReviewComment("");
      setReviewRating(5);
    } catch (err: any) {
      setReviewError(err?.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  /* -------- render -------- */

  if (loading) return <DetailSkeleton />;
  if (error || !destination) return <ErrorState message={error || "Destination not found."} />;

  const heroSrc =
    destination.cover_image_url || "/images/hero1.jpg";

  return (
    <div>
      {/* ========== HERO ========== */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src={heroSrc}
          alt={destination.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 lg:px-24 pb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            {destination.name}
          </h1>
          <p className="text-white/80 text-lg mt-2 flex items-center gap-1.5">
            <MapPin size={18} />
            {destination.location}
          </p>
        </div>
      </div>

      {/* ========== CONTENT ========== */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/destinations" className="hover:text-accent transition-colors">
            Destinations
          </Link>
          <ChevronRight size={14} />
          <span className="text-neutral-800 font-medium">{destination.name}</span>
        </nav>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ---------- LEFT COLUMN (2/3) ---------- */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key details chips */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-sm text-neutral-600 bg-neutral-100 rounded-full px-4 py-2">
                <MapPin size={16} className="text-accent" />
                {destination.location}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-neutral-600 bg-neutral-100 rounded-full px-4 py-2">
                <Tag size={16} className="text-accent" />
                {destination.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-800 bg-neutral-100 rounded-full px-4 py-2">
                <span className="text-accent">$</span>
                {destination.price_per_person}
                <span className="font-normal text-neutral-500">/person</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-neutral-600 bg-neutral-100 rounded-full px-4 py-2">
                <StarRating value={Math.round(destination.avg_rating)} readonly />
                <span className="ml-1 font-semibold">
                  {Number(destination.avg_rating).toFixed(1)}
                </span>
                <span className="text-neutral-400">
                  ({destination.review_count})
                </span>
              </span>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">About this destination</h2>
              <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                {destination.description}
              </p>
            </div>

            {/* Book button (mobile) */}
            <div className="lg:hidden">
              <Button
                variant="primary"
                size="lg"
                className="w-full gap-2"
                onClick={() => router.push(`/booking/${destination.slug}`)}
              >
                <Calendar size={20} />
                Book This Trip
              </Button>
            </div>

            {/* ---------- REVIEWS ---------- */}
            <section className="pt-8 border-t border-neutral-200">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
                Reviews ({reviews.length})
              </h2>

              {reviews.length === 0 && (
                <p className="text-neutral-500">No reviews yet. Be the first to share your experience!</p>
              )}

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white border border-neutral-100 rounded-2xl p-5"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {review.user.avatar_url ? (
                          <Image
                            src={review.user.avatar_url}
                            alt={review.user.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <User size={20} className="text-accent" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-neutral-900">
                            {review.user.name}
                          </span>
                          <StarRating value={review.rating} readonly />
                        </div>
                        <p className="text-neutral-700 mt-2">{review.comment}</p>
                        <p className="text-xs text-neutral-400 mt-2">
                          {new Date(review.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Review Form */}
              {user ? (
                <form onSubmit={handleSubmitReview} className="mt-8 bg-neutral-50 rounded-2xl p-6 border border-neutral-200">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                    Write a Review
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Your Rating
                    </label>
                    <StarRating value={reviewRating} onChange={setReviewRating} />
                  </div>

                  <div className="mb-4">
                    <Textarea
                      label="Your Comment"
                      placeholder="Tell us about your experience..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                    />
                  </div>

                  {reviewError && (
                    <p className="text-sm text-red-500 mb-3">{reviewError}</p>
                  )}

                  {reviewSuccess && (
                    <p className="text-sm text-green-600 mb-3">
                      Thank you! Your review has been submitted.
                    </p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={submittingReview || !reviewComment.trim()}
                    className="gap-2"
                  >
                    {submittingReview ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </form>
              ) : (
                <div className="mt-8 bg-neutral-50 rounded-2xl p-6 border border-neutral-200 text-center">
                  <p className="text-neutral-600 mb-3">
                    Please sign in to leave a review.
                  </p>
                  <Link href="/login">
                    <Button variant="secondary" size="sm">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </section>
          </div>

          {/* ---------- RIGHT COLUMN (1/3) — Booking Sidebar ---------- */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
              <p className="text-3xl font-bold text-neutral-900 mb-1">
                ${destination.price_per_person}
                <span className="text-base font-normal text-neutral-500">/person</span>
              </p>

              <div className="flex items-center gap-1.5 mt-3 mb-6">
                <StarRating value={Math.round(destination.avg_rating)} readonly />
                <span className="text-sm text-neutral-500 ml-1">
                  {Number(destination.avg_rating).toFixed(1)} ({destination.review_count} reviews)
                </span>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full gap-2"
                onClick={() => router.push(`/booking/${destination.slug}`)}
              >
                <Calendar size={20} />
                Book This Trip
              </Button>

              <p className="text-xs text-neutral-400 text-center mt-3">
                No upfront payment required
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}