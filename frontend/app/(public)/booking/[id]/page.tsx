"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDestination, createBooking } from "@/lib/api";
import { useAuth } from "@/app/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import {
  MapPin,
  Star,
  Calendar,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
  LogIn,
} from "lucide-react";

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

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function daysBetween(start: string, end: string): number {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  const diff = e.getTime() - s.getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Loading Skeleton                                                   */
/* ------------------------------------------------------------------ */

function BookingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
      <div className="h-6 w-48 bg-neutral-200 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-6">
          <div className="h-8 w-3/4 bg-neutral-200 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-neutral-100 rounded animate-pulse" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-neutral-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
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
/*  Success State                                                      */
/* ------------------------------------------------------------------ */

function BookingSuccess({
  booking,
  destinationName,
  onBack,
}: {
  booking: any;
  destinationName: string;
  onBack: () => void;
}) {
  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <h2 className="text-3xl font-bold text-neutral-900 mb-3">Booking Confirmed!</h2>
      <p className="text-neutral-600 mb-8">
        Your trip to <span className="font-semibold">{destinationName}</span> has been booked
        successfully. We have sent the details to your email.
      </p>

      {booking && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 text-left mb-8 space-y-3">
          {booking.check_in && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Check-in</span>
              <span className="font-medium text-neutral-800">{formatDate(booking.check_in)}</span>
            </div>
          )}
          {booking.check_out && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Check-out</span>
              <span className="font-medium text-neutral-800">{formatDate(booking.check_out)}</span>
            </div>
          )}
          {booking.travelers && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Travelers</span>
              <span className="font-medium text-neutral-800">{booking.travelers}</span>
            </div>
          )}
          {booking.total_price && (
            <div className="flex justify-between text-sm pt-2 border-t border-neutral-200">
              <span className="font-semibold text-neutral-700">Total</span>
              <span className="font-bold text-neutral-900">${Number(booking.total_price).toFixed(2)}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="primary" size="md" onClick={onBack}>
          Book Another Trip
        </Button>
        <Link href="/">
          <Button variant="secondary" size="md">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function BookingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth();
  const slug = params.id; // URL param is the destination slug

  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [notes, setNotes] = useState("");

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<any | null>(null);

  // Fetch destination
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    getDestination(slug)
      .then((result) => {
        const dest: Destination = result.data ?? result;
        setDestination(dest);
      })
      .catch((err: any) => {
        setError(err?.message || "Could not load destination.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Price calculation
  const nights = useMemo(() => daysBetween(startDate, endDate), [startDate, endDate]);
  const totalPrice = useMemo(() => {
    if (!destination) return 0;
    const base = destination.price_per_person * travelers;
    return nights > 0 ? base * nights : base;
  }, [destination, travelers, nights]);

  // Form validation
  const canSubmit =
    !!user &&
    !!token &&
    !submitting &&
    !!startDate &&
    !!endDate &&
    nights >= 0 &&
    travelers >= 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !destination) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const bookingData: Record<string, any> = {
        destination_id: destination.id,
        travelers,
        notes,
      };

      // API field names may vary — send both variants for compatibility
      if (startDate) {
        bookingData.start_date = startDate;
        bookingData.check_in = startDate;
      }
      if (endDate) {
        bookingData.end_date = endDate;
        bookingData.check_out = endDate;
      }

      const result = await createBooking(bookingData, token);
      setBookingResult(result.data ?? result);
    } catch (err: any) {
      setSubmitError(err?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* -------- render: loading -------- */
  if (loading || authLoading) return <BookingSkeleton />;

  /* -------- render: error -------- */
  if (error || !destination) return <ErrorState message={error || "Destination not found."} />;

  /* -------- render: success -------- */
  if (bookingResult) {
    return (
      <BookingSuccess
        booking={bookingResult}
        destinationName={destination.name}
        onBack={() => router.push("/destinations")}
      />
    );
  }

  /* -------- render: form -------- */
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
        <Link href="/" className="hover:text-accent transition-colors">
          Home
        </Link>
        <span className="text-neutral-300">/</span>
        <Link href="/destinations" className="hover:text-accent transition-colors">
          Destinations
        </Link>
        <span className="text-neutral-300">/</span>
        <Link
          href={`/destinations/${destination.slug}`}
          className="hover:text-accent transition-colors"
        >
          {destination.name}
        </Link>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-800 font-medium">Book</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* ========== LEFT — FORM ========== */}
        <div className="lg:col-span-3">
          {/* Auth gate */}
          {!user ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <LogIn size={28} className="text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Sign in to book
              </h2>
              <p className="text-neutral-600 mb-6">
                Please sign in or create an account to continue with your booking.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/login">
                  <Button variant="primary" size="md" className="gap-2">
                    <LogIn size={18} />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="secondary" size="md">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h1 className="text-3xl font-bold text-neutral-900">
                Book Your Trip
              </h1>
              <p className="text-neutral-500">
                Complete the form below to reserve your spot.
              </p>

              {/* Destination summary */}
              <div className="flex items-center gap-4 bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={
                      destination.cover_image_url || "/images/pool.jpg"
                    }
                    alt={destination.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{destination.name}</p>
                  <p className="text-sm text-neutral-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={14} />
                    {destination.location}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={14} className="fill-accent text-accent" />
                    <span className="text-sm font-medium text-neutral-700">
                      {Number(destination.avg_rating).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Check-in Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
                <Input
                  label="Check-out Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              {/* Travelers */}
              <div>
                <Input
                  label="Number of Travelers"
                  type="number"
                  min={1}
                  max={50}
                  value={travelers}
                  onChange={(e) =>
                    setTravelers(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  required
                />
              </div>

              {/* Notes */}
              <Textarea
                label="Special Requests or Notes (optional)"
                placeholder="Any special requirements, dietary needs, or preferences..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />

              {/* Submit error */}
              {submitError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                  <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              )}

              {/* Submit button (mobile) */}
              <div className="lg:hidden">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full gap-2"
                  disabled={!canSubmit}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Calendar size={20} />
                      Confirm Booking
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* ========== RIGHT — SUMMARY SIDEBAR ========== */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg text-neutral-900 mb-4">
              Booking Summary
            </h3>

            {/* Destination */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-100">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={
                    destination.cover_image_url || "/images/pool.jpg"
                  }
                  alt={destination.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <p className="font-medium text-neutral-900 text-sm">{destination.name}</p>
                <p className="text-xs text-neutral-500">{destination.location}</p>
              </div>
            </div>

            {/* Line items */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Price per person</span>
                <span className="font-medium text-neutral-800">
                  ${destination.price_per_person}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Travelers</span>
                <span className="font-medium text-neutral-800">{travelers}</span>
              </div>

              {nights > 0 && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Nights</span>
                  <span className="font-medium text-neutral-800">{nights}</span>
                </div>
              )}

              {startDate && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Check-in</span>
                  <span className="font-medium text-neutral-800">
                    {formatDate(startDate)}
                  </span>
                </div>
              )}

              {endDate && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Check-out</span>
                  <span className="font-medium text-neutral-800">
                    {formatDate(endDate)}
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-200">
              <span className="font-semibold text-neutral-800">Total</span>
              <span className="text-2xl font-bold text-accent">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Confirm button (desktop) */}
            {user && (
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full gap-2 mt-6"
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                {submitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Calendar size={20} />
                    Confirm Booking
                  </>
                )}
              </Button>
            )}

            <p className="text-xs text-neutral-400 text-center mt-3">
              You will not be charged yet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}