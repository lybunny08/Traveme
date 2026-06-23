"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/app/AuthContext";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password);
      window.location.href = "/";
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-neutral-900">
          Create an account
        </h1>
        <p className="text-neutral-500 mt-1 mb-6">
          Start your journey with TraveMe
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <Input
            label="Name"
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-accent font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
