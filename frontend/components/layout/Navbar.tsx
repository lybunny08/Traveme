"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Menu, X } from "lucide-react";
import { useAuth } from "@/app/AuthContext";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destinations" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-neutral-900">
            <MapPin className="text-accent" size={28} />
            TraveMe
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="w-20 h-9 bg-neutral-100 animate-pulse rounded-full" />
            ) : user ? (
              <>
                <Link
                  href={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="text-sm font-medium text-accent hover:text-accent-hover transition"
                >
                  {user.role === "admin" ? "Admin" : "Dashboard"}
                </Link>
                <span className="text-sm font-medium text-neutral-700">
                  {user.name}
                </span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition text-neutral-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white">
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm font-medium text-neutral-600 hover:text-neutral-900 transition"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-neutral-100" />
            {isLoading ? (
              <div className="w-full h-9 bg-neutral-100 animate-pulse rounded-full" />
            ) : user ? (
              <>
                <Link
                  href={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="block text-sm font-medium text-accent hover:text-accent-hover transition"
                  onClick={() => setMobileOpen(false)}
                >
                  {user.role === "admin" ? "Admin" : "Dashboard"}
                </Link>
                <span className="block text-sm font-medium text-neutral-700">
                  {user.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
