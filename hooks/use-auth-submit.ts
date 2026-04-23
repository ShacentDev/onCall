"use client";

import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type AuthType = "emailSignin";

interface AuthValues {
  email?: string;
  password?: string;
  name?: string;
  phoneNumber?: string;
  newPassword?: string;
  token?: string;
}

export function useAuthSubmit(type: AuthType) {
  const handleSubmit = async (values: AuthValues | undefined) => {
    try {
      if (type === "emailSignin") {
        await authClient.signIn.email(
          {
            email: values?.email!,
            password: values?.password!,
            callbackURL: "/dashboard",
            rememberMe: true,
          },
          {
            onSuccess: () => {
              toast.success("Berhasil login.");
            },
            onError: (ctx) => {
              toast.error(ctx.error.message || "Password atau email salah.");
            },
          }
        );
      } 
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Gagal login."
      );
    }
  };

  return { handleSubmit };
}
