import { mutate } from "swr";
import { toast } from "sonner";

interface ApiRequestOptions {
  url: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  data?: any;
  revalidate?: string;
}

export async function apiRequest<T = any>({
  url,
  method = "GET",
  data,
  revalidate,
}: ApiRequestOptions): Promise<T | null> {
  try {
    const isFormData = data instanceof FormData;
    const response = await fetch(url, {
      method,
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });

    const resData = await response.json().catch(() => ({}));

    if (!response.ok) {
      toast.error(resData?.message || "Terjadi kesalahan pada server.");
      return resData.message;
    }

    if (resData?.message) {
      toast.success(resData.message);
    }

    if (revalidate) mutate(revalidate);

    return resData as T;
  } catch (err) {
    toast.error(
      err instanceof Error ? err.message : "Gagal terhubung ke server."
    );
    return null;
  }
}
