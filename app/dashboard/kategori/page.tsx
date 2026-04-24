"use client";

import { DataTable } from "@/components/data-table";
import { categoryColumns } from "./column";
import { useSession } from "@/lib/client-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import { createCategorySchema, CreateCategorySchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/api-client";
import { toast } from "sonner";
import Loading from "@/components/loading";
import { Controller, useForm } from "react-hook-form";
import { Tags, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

const CategoryPage = () => {
  const { user, isLoading } = useSession();
  const router = useRouter();
  const isUserValid = user?.role === "admin" && !isLoading;

  const { data: categories, isLoading: isLoadingCategories } = useSWR(
    isUserValid ? "/api/category" : null,
  );

  const form = useForm<CreateCategorySchema>({
    resolver: zodResolver(createCategorySchema),
    mode: "onChange",
    defaultValues: { name: "" },
  });

  const onSubmit = async (values: CreateCategorySchema) => {
    const res = await apiRequest({
      url: "/api/category",
      method: "POST",
      data: values,
      revalidate: "/api/category",
    });
    if (res && typeof res !== "string") {
      form.reset();
    }
  };

  useEffect(() => {
    if (!isUserValid && !isLoading && user) {
      toast.error("Akses ditolak. Hanya untuk Admin.");
      router.replace("/dashboard");
    }
  }, [isUserValid, isLoading, user, router]);

  if (isLoadingCategories || isLoading) return <Loading />;
  if (!isUserValid) return null;

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Tags className="h-8 w-8" />
          Manajemen Kategori
        </h1>
        <p className="text-muted-foreground mt-2">
          Kelola data kategori spesialisasi dalam sistem.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kategori</CardTitle>
          <CardDescription>
            Semua kategori spesialisasi yang terdaftar dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <DataTable
            columns={categoryColumns}
            data={categories || []}
            filterColumn="name"
            filterPlaceholder="Filter kategori..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Tambah Kategori Baru
          </CardTitle>
          <CardDescription>
            Isi formulir di bawah ini untuk membuat kategori baru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nama Kategori</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Contoh: PENYAKIT DALAM"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              {form.formState.isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryPage;
