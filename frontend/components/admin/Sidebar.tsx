"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Globe,
  CalendarCheck,
  FileText,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/destinations", label: "Destinations", icon: Globe },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 w-64 bg-white border-r border-neutral-100 h-screen flex flex-col z-30">
      <div className="flex items-center gap-2 px-6 py-6 border-b border-neutral-100">
        <Shield className="w-6 h-6 text-accent" />
        <span className="text-lg font-bold text-neutral-900">TraveMe Admin</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                isActive
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-neutral-100">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition"
        >
          <ExternalLink className="w-5 h-5 flex-shrink-0" />
          <span>Back to Site</span>
        </Link>
      </div>
    </aside>
  );
}
