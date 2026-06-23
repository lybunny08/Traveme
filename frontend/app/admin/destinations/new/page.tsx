"use client";

import { useAuth } from "@/app/AuthContext";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { adminCreateDestination, adminUploadImage } from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { Upload, ArrowLeft } from "lucide-react";

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

export default function NewDestination() {
  const { token } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error on change
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
        description: form.description.trim(),
        location: form.location.trim(),
        country: form.country.trim(),
        price_per_person: form.price_per_person
          ? Number(form.price_per_person)
          : undefined,
        category: form.category || undefined,
        cover_image_url: form.cover_image_url || undefined,
        featured: form.featured,
      };
      await adminCreateDestination(payload, token);
      router.push("/admin/destinations");
    } catch (err: any) {
      setSubmitError(err.message || "Failed to create destination");
    } finally {
      setSubmitting(false);
    }
  };

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
          Add New Destination
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
              {submitting ? "Creating..." : "Create Destination"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
