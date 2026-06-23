"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/app/AuthContext";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      const user = JSON.parse(localStorage.getItem("traveme_user") || "{}");
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
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
        <h1 className="text-2xl font-bold text-neutral-900">Welcome back</h1>
        <p className="text-neutral-500 mt-1 mb-6">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
              {error}
            </div>
          )}

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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-accent font-medium hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
