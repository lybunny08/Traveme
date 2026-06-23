"use client";

import { useAuth } from "@/app/AuthContext";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { getDestinations, adminUpdateDestination, adminUploadImage } from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { Upload, ArrowLeft, Loader2 } from "lucide-react";

const CATEGORIES = [
  { value: "beach", label: "Beach" },
  { value: "mountain", label: "Mountain" },
  { value: "city", label: "City" },
  { value: "cultural", label: "Cultural" },
  { value: "adventure", label: "Adventure" },
  { value: "wildlife", label: "Wildlife" },
  { value: "romantic", label: "Romantic" },
  { value: "family", label: "Family" },
];

interface Destination {
  id: string;
  name: string;
  description?: string;
  location?: string;
  country?: string;
  price_per_person?: number;
  category?: string;
  cover_image_url?: string;
  featured?: boolean;
}

export default function EditDestination() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    country: "",
    price_per_person: "",
    category: "",
    cover_image_url: "",
    featured: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Fetch destination data
  useEffect(() => {
    if (!token || !id) return;

    const fetchDestination = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const data = await getDestinations({ limit: "200" });
        let list: Destination[] = [];
        if (data && data.destinations) {
          list = data.destinations;
        } else if (Array.isArray(data)) {
          list = data;
        }
        const dest = list.find((d: Destination) => d.id === id);
        if (!dest) {
          setFetchError("Destination not found");
          return;
        }
        setForm({
          name: dest.name || "",
          description: dest.description || "",
          location: dest.location || "",
          country: dest.country || "",
          price_per_person: dest.price_per_person ? String(dest.price_per_person) : "",
          category: dest.category || "",
          cover_image_url: dest.cover_image_url || "",
          featured: dest.featured || false,
        });
      } catch (err: any) {
        setFetchError(err.message || "Failed to load destination");
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [token, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await adminUploadImage(formData, token);
      const url = result.url || result.secure_url || result.data?.url || "";
      if (url) {
        setForm((prev) => ({ ...prev, cover_image_url: url }));
      }
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !token) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        location: form.location.trim(),
        country: form.country.trim() || undefined,
        price_per_person: form.price_per_person ? Number(form.price_per_person) : undefined,
        category: form.category || undefined,
        cover_image_url: form.cover_image_url || undefined,
        featured: form.featured,
      };
      await adminUpdateDestination(id, payload, token);
      router.push("/admin/destinations");
    } catch (err: any) {
      setSubmitError(err.message || "Failed to update destination");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/destinations"
            className="p-2 rounded-xl hover:bg-neutral-100 transition"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">Edit Destination</h1>
        </div>
        <Card className="p-8 text-center">
          <p className="text-red-500 mb-4">{fetchError}</p>
          <Link href="/admin/destinations">
            <Button variant="secondary">Back to Destinations</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/destinations"
          className="p-2 rounded-xl hover:bg-neutral-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">
          Edit Destination
        </h1>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <Input
            label="Name *"
            name="name"
            placeholder="e.g. Santorini Sunset Villa"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />

          {/* Description */}
          <Textarea
            label="Description"
            name="description"
            placeholder="Describe the destination..."
            value={form.description}
            onChange={handleChange}
          />

          {/* Location & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location *"
              name="location"
              placeholder="e.g. Oia, Santorini"
              value={form.location}
              onChange={handleChange}
              error={errors.location}
            />
            <Input
              label="Country"
              name="country"
              placeholder="e.g. Greece"
              value={form.country}
              onChange={handleChange}
            />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Price per person ($)"
              name="price_per_person"
              type="number"
              min="0"
              placeholder="e.g. 299"
              value={form.price_per_person}
              onChange={handleChange}
            />
            <Select
              label="Category"
              name="category"
              options={CATEGORIES}
              placeholder="Select category"
              value={form.category}
              onChange={handleChange}
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Cover Image
            </label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Input
                  name="cover_image_url"
                  placeholder="Image URL"
                  value={form.cover_image_url}
                  onChange={handleChange}
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            {form.cover_image_url && (
              <div className="mt-3">
                <img
                  src={form.cover_image_url}
                  alt="Preview"
                  className="w-32 h-20 rounded-lg object-cover border border-neutral-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Featured */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="w-4 h-4 rounded border-neutral-300 text-accent focus:ring-accent"
            />
            <span className="text-sm text-neutral-700">Featured destination</span>
          </label>

          {/* Submit Error */}
          {submitError && (
            <p className="text-sm text-red-500">{submitError}</p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <Link href="/admin/destinations">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
