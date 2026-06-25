"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Menu, X } from "lucide-react";
import { useAuth } from "@/app/AuthContext";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const { user, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const transparent = isHome && !isScrolled;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destinations" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 border-b transition-all duration-300 ${
        transparent
          ? "bg-transparent border-transparent"
          : "backdrop-blur-md bg-white border-neutral-100 shadow-sm"
      }`}
    >
      <div className=" px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className={`flex items-center gap-2 font-bold text-xl transition-colors duration-300 ${
              transparent ? "text-white" : "text-black"
            }`}
          >
            <MapPin className="text-white" size={28} />
            TraveMe
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-300 ${
                  transparent
                    ? "text-white/90 hover:text-white"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className={`w-20 h-9 animate-pulse rounded-full ${
                transparent ? "bg-white/20" : "bg-neutral-100"
              }`} />
            ) : user ? (
              <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                <Button variant="secondary" size="sm">
                  {user.role === "admin" ? "Admin" : "Dashboard"}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant={transparent ? "outline" : "ghost"}
                    size="sm"
                    className={transparent ? "border-white/60 text-white hover:bg-white/10" : ""}
                  >
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
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
              transparent
                ? "hover:bg-white/10 text-white"
                : "hover:bg-neutral-100 text-neutral-700"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`md:hidden border-t ${
          transparent
            ? "border-white/10 bg-black/80 backdrop-blur-xl"
            : "border-neutral-100 bg-white"
        }`}>
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block text-sm font-medium transition ${
                  transparent
                    ? "text-white/70 hover:text-white"
                    : "text-neutral-600 hover:text-black"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className={transparent ? "border-white/10" : "border-neutral-100"} />
            {isLoading ? (
              <div className={`w-full h-9 animate-pulse rounded-full ${
                transparent ? "bg-white/20" : "bg-neutral-100"
              }`} />
            ) : user ? (
              <Link
                href={user.role === "admin" ? "/admin" : "/dashboard"}
                onClick={() => setMobileOpen(false)}
              >
                <Button variant="secondary" size="sm" className="w-full">
                  {user.role === "admin" ? "Admin" : "Dashboard"}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full ${transparent ? "text-white hover:bg-white/10" : ""}`}
                  >
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
