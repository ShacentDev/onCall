"use client";

import { useSession } from "@/lib/client-session";
import Loading from "@/components/loading";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { OnCallPublic } from "@/components/landing/oncall-section";
import { Separator } from "@/components/ui/separator";
import { PieChart } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: isSessionLoading } = useSession();

  useEffect(() => {
    if (!isSessionLoading && !user) {
      toast.error("Anda harus login untuk mengakses dashboard.");
      router.replace("/login");
    }
  }, [user, isSessionLoading, router]);

  if (isSessionLoading) {
    return <Loading />;
  }

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <PieChart className="h-8 w-8" />
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
