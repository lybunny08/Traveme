"use client";

import { useAuth } from "@/app/AuthContext";
import { useEffect, useState } from "react";
import { getDestinations, getBlogPosts, adminGetBookings } from "@/lib/api";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import {
  MapPin,
  CalendarCheck,
  DollarSign,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-neutral-900">{value}</p>
          <p className="text-sm text-neutral-500">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-neutral-200 rounded-xl ${className}`} />;
}

interface Booking {
  id: string;
  user_name?: string;
  user_email?: string;
  destination_name?: string;
  start_date?: string;
  end_date?: string;
  nb_travelers?: number;
  total_price?: number;
  status: string;
  notes?: string;
  created_at?: string;
  destination?: { name?: string };
  user?: { name?: string; email?: string };
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [destCount, setDestCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [destData, postData, bookingData] = await Promise.all([
          getDestinations({ limit: "1" }),
          getBlogPosts({ limit: "1" }),
          adminGetBookings(token, { limit: "100" }),
        ]);

        if (destData && destData.total) setDestCount(destData.total);
        else if (Array.isArray(destData)) setDestCount(destData.length);

        if (postData && postData.total) setPostCount(postData.total);
        else if (Array.isArray(postData)) setPostCount(postData.length);

        const bookings: Booking[] = bookingData?.data ?? bookingData?.bookings ?? bookingData ?? [];
        if (Array.isArray(bookings)) {
          setBookingCount(bookings.length);
          const totalRev = bookings.reduce(
            (sum: number, b: Booking) => sum + (b.total_price || 0),
            0
          );
          setRevenue(totalRev);
          const sorted = [...bookings].sort(
            (a: Booking, b: Booking) =>
              new Date(b.created_at || "").getTime() -
              new Date(a.created_at || "").getTime()
          );
          setRecentBookings(sorted.slice(0, 5));
        }
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-8">Dashboard</h1>
        <Card className="p-8 text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-accent hover:underline"
          >
            Try again
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12" />
                  <div className="space-y-2">
                    <Skeleton className="w-16 h-6" />
                    <Skeleton className="w-20 h-4" />
                  </div>
                </div>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatCard
              icon={<MapPin className="w-6 h-6 text-white" />}
              label="Total Destinations"
              value={destCount}
              color="bg-blue-500"
            />
            <StatCard
              icon={<CalendarCheck className="w-6 h-6 text-white" />}
              label="Total Bookings"
              value={bookingCount}
              color="bg-green-500"
            />
            <StatCard
              icon={<DollarSign className="w-6 h-6 text-white" />}
              label="Revenue"
              value={`$${revenue.toLocaleString()}`}
              color="bg-yellow-500"
            />
            <StatCard
              icon={<FileText className="w-6 h-6 text-white" />}
              label="Published Posts"
              value={postCount}
              color="bg-purple-500"
            />
          </>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-sm text-accent hover:underline">
            View all
          </Link>
        </div>
        <Card>
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">No bookings yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left px-4 py-3 font-medium text-neutral-500">User</th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-500">Destination</th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-500">Dates</th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-500">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-neutral-500">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                      <td className="px-4 py-3 text-neutral-800">
                        {booking.user_name || booking.user?.name || booking.user_email || booking.user?.email || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-neutral-800">
                        {booking.destination_name || booking.destination?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {booking.start_date
                          ? `${new Date(booking.start_date).toLocaleDateString()} - ${new Date(booking.end_date || "").toLocaleDateString()}`
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "accent"
                              : booking.status === "pending"
                              ? "outline"
                              : "default"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-neutral-800">
                        ${booking.total_price?.toLocaleString() || "0"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
