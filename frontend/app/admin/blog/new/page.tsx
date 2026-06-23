"use client";

import { useAuth } from "@/app/AuthContext";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { adminCreatePost, adminUploadImage } from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { Upload, ArrowLeft } from "lucide-react";

export default function NewBlogPost() {
  const { token } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    cover_image_url: "",
    tags: "",
    is_published: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.content.trim()) newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !token) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const tagsArray = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: Record<string, any> = {
        title: form.title.trim(),
        content: form.content.trim(),
        excerpt: form.excerpt.trim() || undefined,
        cover_image_url: form.cover_image_url || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        published: form.is_published,
      };

      await adminCreatePost(payload, token);
      router.push("/admin/blog");
    } catch (err: any) {
      setSubmitError(err.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/blog"
          className="p-2 rounded-xl hover:bg-neutral-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">
          Create Blog Post
        </h1>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Input
            label="Title *"
            name="title"
            placeholder="Post title"
            value={form.title}
            onChange={handleChange}
            error={errors.title}
          />

          {/* Content */}
          <Textarea
            label="Content *"
            name="content"
            placeholder="Write your blog content here..."
            value={form.content}
            onChange={handleChange}
            error={errors.content}
            rows={12}
          />

          {/* Excerpt */}
          <Textarea
            label="Excerpt"
            name="excerpt"
            placeholder="Short summary of the post (optional)"
            value={form.excerpt}
            onChange={handleChange}
            rows={3}
          />

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

          {/* Tags */}
          <Input
            label="Tags"
            name="tags"
            placeholder="e.g. travel, adventure, europe (comma separated)"
            value={form.tags}
            onChange={handleChange}
          />

          {/* Is Published */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_published"
              checked={form.is_published}
              onChange={handleChange}
              className="w-4 h-4 rounded border-neutral-300 text-accent focus:ring-accent"
            />
            <span className="text-sm text-neutral-700">Publish immediately</span>
          </label>

          {/* Submit Error */}
          {submitError && (
            <p className="text-sm text-red-500">{submitError}</p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <Link href="/admin/blog">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Post"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
