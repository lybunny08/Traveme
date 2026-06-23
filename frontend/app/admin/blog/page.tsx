"use client";

import { useAuth } from "@/app/AuthContext";
import { useEffect, useState } from "react";
import { getBlogPosts, adminDeletePost } from "@/lib/api";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Link from "next/link";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  author?: string;
  author_name?: string;
  is_published?: boolean;
  published?: boolean;
  created_at?: string;
}

export default function AdminBlog() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await getBlogPosts({ limit: "100" });
      let list: BlogPost[] = [];
      if (data && data.data) {
        list = data.data;
      } else if (Array.isArray(data)) {
        list = data;
      }
      setPosts(list);
    } catch (err: any) {
      setError(err.message || "Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [token]);

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;
    setDeleting(true);
    try {
      await adminDeletePost(deleteTarget.id, token);
      setDeleteTarget(null);
      fetchPosts();
    } catch (err: any) {
      alert(err.message || "Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Blog Posts</h1>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </Link>
      </div>

      {error && (
        <Card className="p-6 mb-6 text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <Button variant="secondary" onClick={fetchPosts}>Retry</Button>
        </Card>
      )}

      {loading && !error && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-neutral-500 mb-4">No blog posts yet.</p>
          <Link href="/admin/blog/new">
            <Button><Plus className="w-4 h-4 mr-2" />Create Your First Post</Button>
          </Link>
        </Card>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="overflow-x-auto">
          <Card>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Author</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-500">Published</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-500">Date</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  const isPub = post.is_published ?? post.published ?? false;
                  return (
                    <tr key={post.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                      <td className="px-4 py-3 font-medium text-neutral-900 max-w-[300px] truncate">{post.title}</td>
                      <td className="px-4 py-3 text-neutral-600">{post.author_name || post.author || "N/A"}</td>
                      <td className="px-4 py-3 text-center">
                        {isPub ? <Badge variant="accent">Yes</Badge> : <Badge variant="outline">No</Badge>}
                      </td>
                      <td className="px-4 py-3 text-neutral-500 text-xs">
                        {post.created_at ? new Date(post.created_at).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/blog/${post.id}/edit`}>
                            <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                          </Link>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(post)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Post">
        <p className="text-neutral-600 mb-6">
          Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This action cannot be undone.
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
