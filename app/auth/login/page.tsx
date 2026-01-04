"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthForm
      title="Sign in to your account"
      header={
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800 text-center">
            This is a demo page. Click{" "}
            <Link
              href="/auth/reset-password"
              className="font-semibold underline hover:text-blue-900"
            >
              Forgot Password
            </Link>{" "}
            to redirect to /auth/reset-password
          </p>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email address"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <div className="text-right">
          <Link
            href="/auth/reset-password"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Sign in
        </Button>
      </div>
    </AuthForm>
  );
}
