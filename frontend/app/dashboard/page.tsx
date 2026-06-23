"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/AuthContext";
import { getMyBookings } from "@/lib/api";
import { Loader2, MapPin, CalendarDays, Users, Banknote } from "lucide-react";
import Link from "next/link";

interface Booking {
  id: string;
  destination_id: string;
  start_date: string;
  end_date: string;
  nb_travelers: number;
  total_price: number;
  status: string;
  notes: string | null;
  created_at: string;
  destination_name: string;
  destination_slug: string;
  destination_location: string;
  destination_images: string[];
  destination_category: string;
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

export default function DashboardPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getMyBookings(token)
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Bookings</h1>
          <p className="text-neutral-500 mt-1">Manage your travel reservations</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin size={32} className="text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900">No bookings yet</h3>
          <p className="text-neutral-500 mt-1 mb-6">Start planning your next adventure!</p>
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-accent-hover transition"
          >
            Explore Destinations
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-sm transition"
            >
              <div className="flex flex-col md:flex-row">
                {booking.destination_images?.[0] && (
                  <div className="md:w-48 h-32 md:h-auto shrink-0">
                    <img
                      src={booking.destination_images[0]}
                      alt={booking.destination_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/destinations/${booking.destination_slug}`}
                        className="font-semibold text-neutral-900 hover:text-accent transition"
                      >
                        {booking.destination_name}
                      </Link>
                      <p className="text-sm text-neutral-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={14} />
                        {booking.destination_location}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-medium px-3 py-1 rounded-full capitalize ${
                        statusStyles[booking.status] || "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-neutral-600">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={16} className="text-neutral-400" />
                      {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={16} className="text-neutral-400" />
                      {booking.nb_travelers} traveler{booking.nb_travelers > 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-neutral-900">
                      <Banknote size={16} className="text-neutral-400" />
                      ${Number(booking.total_price).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
