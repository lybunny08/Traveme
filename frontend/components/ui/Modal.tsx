"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal card */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto p-1 rounded-full hover:bg-neutral-100 transition text-neutral-500"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        {/* Body */}
        {children}
      </div>
    </div>
  );
}
