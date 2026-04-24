"use client";

import { DataTable } from "@/components/data-table";
import { personColumns } from "./column";
import { useSession } from "@/lib/client-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import { createPersonSchema, CreatePersonSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/api-client";
import { toast } from "sonner";
import Loading from "@/components/loading";
import { Controller, useForm } from "react-hook-form";
import { Users, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

type Category = { id: string; name: string };

const PersonPage = () => {
  const { user, isLoading } = useSession();
  const router = useRouter();
  const isUserValid = user?.role === "admin" && !isLoading;

  const { data: persons, isLoading: isLoadingPersons } = useSWR(
    isUserValid ? "/api/person" : null,
  );
  const { data: categories } = useSWR<Category[]>(
    isUserValid ? "/api/category" : null,
  );

  const form = useForm<CreatePersonSchema>({
    resolver: zodResolver(createPersonSchema),
    mode: "onChange",
    defaultValues: { name: "", code: "", categoryId: "" },
  });

  const onSubmit = async (values: CreatePersonSchema) => {
    const res = await apiRequest({
      url: "/api/person",
      method: "POST",
      data: values,
      revalidate: "/api/person",
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

  if (isLoadingPersons || isLoading) return <Loading />;
  if (!isUserValid) return null;

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-8 w-8" />
          Manajemen Person
        </h1>
        <p className="text-muted-foreground mt-2">
          Kelola data person on call dalam sistem.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Daftar Person</CardTitle>
          <CardDescription>
            Semua person yang terdaftar dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <DataTable
            columns={personColumns}
            data={persons || []}
            filterColumn="name"
            filterPlaceholder="Filter nama..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Tambah Person Baru
          </CardTitle>
          <CardDescription>
            Isi formulir di bawah ini untuk menambah person baru
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
                  <FieldLabel htmlFor={field.name}>Nama</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Nama lengkap"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="code"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Kode</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Contoh: PBIMD122"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="categoryId"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Kategori</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {(categories || []).map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default PersonPage;
