"use client";

import { useAuth } from "@/app/AuthContext";
import { useEffect, useState } from "react";
import { adminGetBookings, adminUpdateBookingStatus } from "@/lib/api";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { Loader2 } from "lucide-react";

interface Booking {
  id: string;
  user_name?: string;
  user_email?: string;
  destination_name?: string;
  check_in?: string;
  check_out?: string;
  travelers?: number;
  total_price?: number;
  status: string;
  notes?: string;
  created_at?: string;
  destination?: { name?: string };
  user?: { name?: string; email?: string };
}

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

const STATUS_ACTIONS: Record<string, { label: string; nextStatus: string }[]> = {
  pending: [
    { label: "Confirm", nextStatus: "confirmed" },
    { label: "Cancel", nextStatus: "cancelled" },
  ],
  confirmed: [
    { label: "Mark Completed", nextStatus: "completed" },
    { label: "Cancel", nextStatus: "cancelled" },
  ],
  cancelled: [],
  completed: [],
};

function StatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, string> = {
    pending: "outline",
    confirmed: "accent",
    cancelled: "default",
    completed: "default",
  };
  const colorMap: Record<string, string> = {
    pending: "",
    confirmed: "",
    cancelled: "bg-red-100 text-red-600",
    completed: "bg-blue-100 text-blue-600",
  };
  const variant = variantMap[status] || "default";
  const extraClass = colorMap[status] || "";

  return (
    <Badge variant={variant as "default" | "accent" | "outline"} className={extraClass}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export default function AdminBookings() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionTarget, setActionTarget] = useState<{
    booking: Booking;
    nextStatus: string;
  } | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchBookings = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const params: Record<string, string> = { limit: "200" };
      if (statusFilter) params.status = statusFilter;
      const data = await adminGetBookings(token, params);
      const list: Booking[] = data?.bookings ?? data ?? [];
      setBookings(Array.isArray(list) ? list : []);
    } catch (err: any) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token, statusFilter]);

  const handleStatusChange = async () => {
    if (!actionTarget || !token) return;
    setUpdating(true);
    try {
      await adminUpdateBookingStatus(token, actionTarget.booking.id, actionTarget.nextStatus);
      setActionTarget(null);
      fetchBookings();
    } catch (err: any) {
      alert(err.message || "Failed to update booking status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">Bookings</h1>

      {/* Filter */}
      <div className="mb-6 max-w-xs">
        <Select
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && (
        <Card className="p-6 mb-6 text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <Button variant="secondary" onClick={fetchBookings}>
            Retry
          </Button>
        </Card>
      )}

      {/* Loading */}
      {loading && !error && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      )}

      {/* Empty */}
      {!loading && !error && bookings.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-neutral-500">No bookings found.</p>
        </Card>
      )}

      {/* Bookings Table */}
      {!loading && !error && bookings.length > 0 && (
        <div className="overflow-x-auto">
          <Card>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">User</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Destination</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Check-in</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Check-out</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-500">Travelers</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-500">Total</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Notes</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const actions = STATUS_ACTIONS[booking.status] || [];
                  return (
                    <tr
                      key={booking.id}
                      className="border-b border-neutral-50 hover:bg-neutral-50"
                    >
                      <td className="px-4 py-3 font-medium text-neutral-800">
                        {booking.user_name || booking.user?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {booking.user_email || booking.user?.email || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-neutral-800">
                        {booking.destination_name || booking.destination?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {booking.check_in
                          ? new Date(booking.check_in).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {booking.check_out
                          ? new Date(booking.check_out).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-center text-neutral-800">
                        {booking.travelers || 1}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-4 py-3 text-neutral-500 max-w-[120px] truncate">
                        {booking.notes || "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {actions.length > 0 ? (
                          <div className="flex items-center justify-end gap-1">
                            {actions.map((action) => (
                              <Button
                                key={action.nextStatus}
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setActionTarget({
                                    booking,
                                    nextStatus: action.nextStatus,
                                  })
                                }
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* Status Change Confirmation Modal */}
      <Modal
        isOpen={!!actionTarget}
        onClose={() => setActionTarget(null)}
        title="Update Booking Status"
      >
        {actionTarget && (
          <>
            <p className="text-neutral-600 mb-6">
              Are you sure you want to change the status of{" "}
              <strong>
                {actionTarget.booking.destination_name ||
                  actionTarget.booking.destination?.name ||
                  "this booking"}
              </strong>{" "}
              to <strong>{actionTarget.nextStatus}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setActionTarget(null)}
              >
                Cancel
              </Button>
              <Button onClick={handleStatusChange} disabled={updating}>
                {updating ? "Updating..." : "Confirm"}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
