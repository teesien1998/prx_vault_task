"use client";
import { ReactNode, FormEventHandler } from "react";
import { MagicCard } from "@/components/ui/magic-card";

type AuthFormProps = {
  title: string;
  description?: string;
  header?: ReactNode;
  children: ReactNode;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  cardClassName?: string;
  formClassName?: string;
  gradientColor?: string;
};

export function AuthForm({
  title,
  description,
  children,
  onSubmit,
  cardClassName,
  formClassName,
}: AuthFormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <MagicCard
        className={`max-w-md w-full p-8 rounded-lg ${cardClassName || ""}`}
        gradientColor="#D9D9D955"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 text-center text-sm text-gray-600">
              {description}
            </p>
          ) : null}
        </div>

        <form
          className={`mt-8 space-y-6 ${formClassName || ""}`}
          onSubmit={onSubmit}
        >
          {children}
        </form>
      </MagicCard>
    </div>
  );
}
