interface CardProps {
  children: React.ReactNode;
  className?: string;
}
export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 ${className}`}
    >
      {children}
    </div>
  );
}
