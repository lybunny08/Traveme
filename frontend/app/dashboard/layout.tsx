"use client";

import { useAuth } from "@/app/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, LogOut, LayoutDashboard, User } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="w-64 bg-white border-r border-neutral-200 fixed inset-y-0 left-0 z-30">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-neutral-100">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-neutral-900">
              <span className="text-accent">&#9679;</span>
              TraveMe
            </Link>
          </div>

          <div className="flex-1 p-4">
            <div className="flex items-center gap-3 px-3 py-3 mb-4 bg-neutral-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <User size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{user.name}</p>
                <p className="text-xs text-neutral-500">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-accent bg-accent/5"
              >
                <LayoutDashboard size={18} />
                My Bookings
              </Link>
            </nav>
          </div>

          <div className="p-4 border-t border-neutral-100">
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-600 hover:text-red-600 hover:bg-red-50 w-full transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
