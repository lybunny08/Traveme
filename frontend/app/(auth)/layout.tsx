import Link from "next/link";
import { MapPin } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="px-6 py-6">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-neutral-900">
          <MapPin className="text-accent" size={28} />
          TraveMe
        </Link>
      </div>
      {children}
    </div>
  );
}
