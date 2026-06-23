import Link from "next/link";
import { MapPin, Mail, Phone, MapPinned } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <MapPin className="text-accent" size={28} />
              TraveMe
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Discover breathtaking destinations curated for every kind of
              traveler.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-base mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Destinations", href: "/destinations" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 text-sm hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-base mb-4">Support</h3>
            <ul className="space-y-3">
              {[
                { label: "FAQ", href: "/faq" },
                { label: "Terms", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Help Center", href: "/help" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 text-sm hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-base mb-4">Contact</h3>
            <ul className="space-y-3 text-neutral-400 text-sm">
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 shrink-0" />
                <span>hello@traveme.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPinned size={16} className="mt-0.5 shrink-0" />
                <span>
                  123 Adventure Lane, Suite 100
                  <br />
                  New York, NY 10001
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-6">
          <p className="text-neutral-500 text-sm text-center">
            &copy; 2026 TraveMe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
