"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { UserSignInForm } from "@/components/auth/user-signin-form";

export default function AdminSignInPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.user && session.user.role === "ADMIN") {
      redirect("/admin/dashboard");
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Admin Sign In
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to access the admin dashboard
          </p>
        </div>
        <UserSignInForm />
      </div>
    </div>
  );
}
