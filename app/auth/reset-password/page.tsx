"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Loader2Icon,
  Check,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import { Confetti } from "@/components/ui/confetti";
import { supabase } from "@/lib/supabase";

// Password validation schema
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch("password") || "";

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
      { regex: /[^A-Za-z0-9]/, text: "At least 1 special character" },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = useMemo(() => checkStrength(password), [password]);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  type ResetFormInputs = {
    password: string;
    confirmPassword: string;
  };

  const onSubmit = async (data: ResetFormInputs) => {
    setIsLoading(true);

    try {
      // Simulate Supabase password reset (no real call needed)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get user email (for demo purposes, using a placeholder)
      // In a real app, you'd get this from the reset token or session
      const userEmail = "user@example.com";
      const resetTime = new Date().toISOString();

      // Call Supabase Edge Function
      const { data: passwordResetData, error: passwordResetError } =
        await supabase.functions.invoke("log-password-reset", {
          body: {
            email: userEmail,
            resetTime: resetTime,
          },
        });

      if (passwordResetError) {
        console.error("Error logging password reset:", passwordResetError);
        throw passwordResetError;
      }

      // Log the response (you can see this in browser console)
      console.log("Edge Function response:", passwordResetData);

      // Show success message
      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
        <Confetti className="absolute top-0 left-0 z-0 size-full" />
        <div className="max-w-md w-full space-y-8 p-8 relative z-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Password Reset Successful!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <MagicCard
        className="max-w-md w-full p-8 rounded-lg"
        gradientColor="#D9D9D955"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>
        <form className="mt-8 space-y-6 " onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative" suppressHydrationWarning>
                <Input
                  {...register("password")}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="New Password"
                  disabled={isLoading}
                  aria-invalid={
                    strengthScore < 4 || errors.password ? "true" : "false"
                  }
                  aria-describedby="password-description"
                  className="pe-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  aria-controls="password"
                  disabled={isLoading}
                  suppressHydrationWarning
                >
                  {showPassword ? (
                    <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <Eye size={16} strokeWidth={2} aria-hidden="true" />
                  )}
                </button>
              </div>

              {password && (
                <>
                  <div
                    className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
                    role="progressbar"
                    aria-valuenow={strengthScore}
                    aria-valuemin={0}
                    aria-valuemax={4}
                    aria-label="Password strength"
                  >
                    <div
                      className={`h-full ${getStrengthColor(
                        strengthScore
                      )} transition-all duration-500 ease-out`}
                      style={{ width: `${(strengthScore / 4) * 100}%` }}
                    ></div>
                  </div>

                  <p
                    id="password-description"
                    className="mb-2 text-sm font-medium text-foreground"
                  >
                    {getStrengthText(strengthScore)}. Must contain:
                  </p>

                  <ul
                    className="space-y-1.5 mb-4"
                    aria-label="Password requirements"
                  >
                    {strength.map((req, index) => (
                      <li key={index} className="flex items-center gap-2">
                        {req.met ? (
                          <Check
                            size={16}
                            className="text-emerald-500 w-5 h-5"
                            aria-hidden="true"
                          />
                        ) : (
                          <X
                            size={16}
                            className="text-red-500"
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className={`text-sm ${
                            req.met ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {req.text}
                          <span className="sr-only">
                            {req.met
                              ? " - Requirement met"
                              : " - Requirement not met"}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative" suppressHydrationWarning>
                <Input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm Password"
                  disabled={isLoading}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  disabled={isLoading}
                  suppressHydrationWarning
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="shrink-0">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-400"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2Icon className="h-5 w-5 animate-spin" /> Processing...
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        </form>
      </MagicCard>
    </div>
  );
}
