"use client";

import { useAuth } from "@/app/AuthContext";
import { useEffect, useState } from "react";
import { getDestinations, adminDeleteDestination } from "@/lib/api";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Link from "next/link";
import { Plus, Edit, Trash2, Star, StarOff, ChevronLeft, ChevronRight } from "lucide-react";

interface Destination {
  id: string;
  name: string;
  slug?: string;
  location?: string;
  country?: string;
  price_per_person?: number;
  category?: string;
  is_featured?: boolean;
  cover_image_url?: string;
  created_at?: string;
}

const ITEMS_PER_PAGE = 10;

export default function AdminDestinations() {
  const { token } = useAuth();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<Destination | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDestinations = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await getDestinations({ limit: String(ITEMS_PER_PAGE), page: String(page) });
      if (data && data.data) {
        setDestinations(data.data);
        setTotalCount(data.total ?? data.data.length);
      } else if (Array.isArray(data)) {
        setDestinations(data);
        setTotalCount(data.length);
      } else {
        setDestinations([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load destinations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [token, page]);

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;
    setDeleting(true);
    try {
      await adminDeleteDestination(deleteTarget.id, token);
      setDeleteTarget(null);
      fetchDestinations();
    } catch (err: any) {
      alert(err.message || "Failed to delete destination");
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Destinations</h1>
        <Link href="/admin/destinations/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </Link>
      </div>

      {error && (
        <Card className="p-6 mb-6 text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <Button variant="secondary" onClick={fetchDestinations}>Retry</Button>
        </Card>
      )}

      {loading && !error && (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-neutral-200 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-neutral-200 animate-pulse rounded" />
                  <div className="h-3 w-24 bg-neutral-200 animate-pulse rounded" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && destinations.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-neutral-500 mb-4">No destinations found.</p>
          <Link href="/admin/destinations/new">
            <Button><Plus className="w-4 h-4 mr-2" />Add Your First Destination</Button>
          </Link>
        </Card>
      )}

      {!loading && !error && destinations.length > 0 && (
        <>
          <div className="lg:hidden space-y-4">
            {destinations.map((dest) => (
              <Card key={dest.id} className="p-4">
                <div className="flex items-start gap-4">
                  {dest.cover_image_url ? (
                    <img src={dest.cover_image_url} alt={dest.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs flex-shrink-0">No img</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 truncate">{dest.name}</h3>
                    {dest.slug && <p className="text-xs text-neutral-400 truncate">{dest.slug}</p>}
                    <p className="text-sm text-neutral-600 mt-1">{dest.location}{dest.location && dest.country ? ", " : ""}{dest.country || ""}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-semibold text-sm">${dest.price_per_person || 0}</span>
                      {dest.category && <Badge>{dest.category}</Badge>}
                      {dest.is_featured ? <Star className="w-4 h-4 text-yellow-500" /> : <StarOff className="w-4 h-4 text-neutral-300" />}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Link href={`/admin/destinations/${dest.id}/edit`}>
                      <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(dest)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="hidden lg:block">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100">
                      <th className="text-left px-4 py-3 font-medium text-neutral-500">Image</th>
                      <th className="text-left px-4 py-3 font-medium text-neutral-500">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-neutral-500">Location</th>
                      <th className="text-left px-4 py-3 font-medium text-neutral-500">Price</th>
                      <th className="text-left px-4 py-3 font-medium text-neutral-500">Category</th>
                      <th className="text-center px-4 py-3 font-medium text-neutral-500">Featured</th>
                      <th className="text-left px-4 py-3 font-medium text-neutral-500">Created</th>
                      <th className="text-right px-4 py-3 font-medium text-neutral-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {destinations.map((dest) => (
                      <tr key={dest.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                        <td className="px-4 py-3">
                          {dest.cover_image_url ? (
                            <img src={dest.cover_image_url} alt={dest.name} className="w-12 h-12 rounded-lg object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs">No img</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-neutral-900">{dest.name}</p>
                          {dest.slug && <p className="text-xs text-neutral-400">{dest.slug}</p>}
                        </td>
                        <td className="px-4 py-3 text-neutral-600">{dest.location}{dest.location && dest.country ? ", " : ""}{dest.country || ""}</td>
                        <td className="px-4 py-3 font-medium">${dest.price_per_person || 0}</td>
                        <td className="px-4 py-3">{dest.category && <Badge>{dest.category}</Badge>}</td>
                        <td className="px-4 py-3 text-center">
                          {dest.is_featured ? <Star className="w-4 h-4 text-yellow-500 inline" /> : <StarOff className="w-4 h-4 text-neutral-300 inline" />}
                        </td>
                        <td className="px-4 py-3 text-neutral-500 text-xs">
                          {dest.created_at ? new Date(dest.created_at).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/admin/destinations/${dest.id}/edit`}>
                              <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(dest)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button key={p} variant={p === page ? "primary" : "secondary"} size="sm" onClick={() => setPage(p)}>{p}</Button>
              ))}
              <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Destination">
        <p className="text-neutral-600 mb-6">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button onClick={handleDelete} disabled={deleting} className="bg-red-500 hover:bg-red-600 text-white">
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
