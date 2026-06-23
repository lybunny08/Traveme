interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "outline";
  className?: string;
}
export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variants = {
    default: "bg-neutral-100 text-neutral-700",
    accent: "bg-accent/10 text-accent",
    outline: "border border-neutral-300 text-neutral-600",
  };
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
