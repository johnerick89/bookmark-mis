"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import LoginForm from "@/app/components/LoginForm";
import SignupForm from "@/app/components/SignupForm";

export default function Home() {
  const [isSignup, setIsSignup] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bookmark Manager
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isSignup ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        <div className="mb-4 flex rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
          <button
            type="button"
            onClick={() => setIsSignup(false)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              !isSignup
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsSignup(true)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              isSignup
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {isSignup ? <SignupForm /> : <LoginForm />}
      </div>
    </div>
  );
}
