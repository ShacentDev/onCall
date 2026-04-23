"use client";

import { useSession } from "@/lib/client-session";
import Loading from "@/components/loading";

export default function DashboardPage() {
  const { user, isLoading: isSessionLoading } = useSession();

  if (isSessionLoading) {
    return <Loading />;
  }

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Selamat datang kembali,{" "}
            <span className="font-medium text-slate-700">{user.name}</span>.
          </p>
        </div>
      </div>
      </div>
  );
}