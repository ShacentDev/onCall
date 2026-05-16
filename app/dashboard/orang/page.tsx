"use client";

import { DataTable } from "@/components/data-table";
import { personColumns } from "./column";
import { useSession } from "@/lib/client-session";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { createPersonSchema, CreatePersonSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/api-client";
import { toast } from "sonner";
import Loading from "@/components/loading";
import { Controller, useForm } from "react-hook-form";
import { Users, Plus, Upload, FileSpreadsheet, Loader2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

type ParsedPerson = { kode: string; nama: string };

const PersonPage = () => {
  const { user, isLoading } = useSession();
  const router = useRouter();
  const isUserValid = user?.role === "admin" && !isLoading;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedPersons, setParsedPersons] = useState<ParsedPerson[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const { data: persons, isLoading: isLoadingPersons, mutate: mutatePersons } = useSWR<Person[]>(
    isUserValid ? "/api/person" : null,
  );
  const { data: categories } = useSWR<Category[]>(
    isUserValid ? "/api/category" : null,
  );

  const totalOnCalls = persons?.reduce(
    (sum, p) => sum + (p.onCalls?.length ?? 0),
    0,
  ) ?? 0;

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setParsedPersons([]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/person/excel/", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.message ?? "Gagal membaca file.");
        return;
      }

      setParsedPersons(json.persons);
      toast.success(`${json.persons.length} data berhasil dibaca dari file.`);
    } catch {
      toast.error("Terjadi kesalahan saat membaca file.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleApply = async () => {
    if (parsedPersons.length === 0) return;

    setIsApplying(true);

    try {
      const res = await apiRequest({
        url: "/api/person/excel/apply",
        method: "POST",
        data: { persons: parsedPersons },
        revalidate: "/api/person",
      });

      if (res && typeof res !== "string") {
        setParsedPersons([]);
      }
    } finally {
      setIsApplying(false);
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Manajemen Person
          </h1>
          <p className="text-muted-foreground mt-2">
            Kelola data person on call dalam sistem.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {persons?.length ?? 0} personal terdaftar
          </Badge>
        </div>
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
            <FileSpreadsheet className="h-5 w-5" />
            Import Nama dari Excel
          </CardTitle>
          <CardDescription>
            Upload file Excel dengan kolom <strong>kode</strong> dan{" "}
            <strong>nama</strong> untuk memperbarui nama person secara massal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isApplying}
              className="gap-2"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isUploading ? "Membaca file..." : "Pilih File Excel"}
            </Button>

            {parsedPersons.length > 0 && (
              <Button
                onClick={handleApply}
                disabled={isApplying}
                className="gap-2"
              >
                {isApplying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4" />
                )}
                {isApplying
                  ? "Mengupdate..."
                  : `Update ${parsedPersons.length} Nama`}
              </Button>
            )}
          </div>

          {parsedPersons.length > 0 && (
            <div className="rounded-md border overflow-hidden">
              <div className="bg-muted px-4 py-2 text-sm font-medium">
                Preview — {parsedPersons.length} data siap diupdate
              </div>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Kode</th>
                      <th className="px-4 py-2 text-left font-medium">Nama</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedPersons.map((p) => (
                      <tr key={p.kode} className="border-b last:border-0">
                        <td className="px-4 py-2 font-mono text-xs">{p.kode}</td>
                        <td className="px-4 py-2">{p.nama}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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