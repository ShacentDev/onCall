"use client";

import { DataTable } from "@/components/data-table";
import { personOnCallColumns } from "./column";
import { useSession } from "@/lib/client-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import { createPersonOnCallSchema, CreatePersonOnCallSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/api-client";
import { toast } from "sonner";
import Loading from "@/components/loading";
import { Controller, useForm } from "react-hook-form";
import { CalendarClock, Plus } from "lucide-react";
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
import { DateTimePicker } from "@/components/time-picker";

type Person = {
  id: string;
  name: string;
  code: string;
  category: { name: string };
};

const PersonOnCallPage = () => {
  const { user, isLoading } = useSession();
  const router = useRouter();
  const isUserValid = user?.role === "admin" && !isLoading;

  const { data: onCalls, isLoading: isLoadingOnCalls } = useSWR(
    isUserValid ? "/api/oncall" : null,
  );
  const { data: persons } = useSWR<Person[]>(
    isUserValid ? "/api/person" : null,
  );

  const form = useForm<CreatePersonOnCallSchema>({
    resolver: zodResolver(createPersonOnCallSchema),
    mode: "onChange",
    defaultValues: {
      personId: "",
      room: "",
      startTime: "",
      endTime: "",
      notes: "",
    },
  });

  const onSubmit = async (values: CreatePersonOnCallSchema) => {
    const res = await apiRequest({
      url: "/api/oncall",
      method: "POST",
      data: values,
      revalidate: "/api/oncall",
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

  if (isLoadingOnCalls || isLoading) return <Loading />;
  if (!isUserValid) return null;

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <CalendarClock className="h-8 w-8" />
          Manajemen Person On Call
        </h1>
        <p className="text-muted-foreground mt-2">
          Kelola jadwal on call person dalam sistem.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Daftar Jadwal On Call</CardTitle>
          <CardDescription>
            Semua jadwal on call yang terdaftar dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <DataTable
            columns={personOnCallColumns}
            data={onCalls || []}
            filterColumn="person.name"
            filterPlaceholder="Filter nama..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Tambah Jadwal On Call
          </CardTitle>
          <CardDescription>
            Isi formulir di bawah ini untuk menambah jadwal on call baru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <Controller
              control={form.control}
              name="personId"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Person</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Pilih person" />
                    </SelectTrigger>
                    <SelectContent>
                      {(persons || []).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.code} — {p.name} ({p.category.name})
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
            <Controller
              control={form.control}
              name="room"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Ruangan</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Contoh: IGD Lt. 1"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Controller
                control={form.control}
                name="startTime"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Waktu Mulai</FieldLabel>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pilih tanggal mulai"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="endTime"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Waktu Selesai</FieldLabel>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pilih tanggal selesai"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <Controller
              control={form.control}
              name="notes"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Catatan{" "}
                    <span className="text-muted-foreground font-normal">
                      (opsional)
                    </span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Catatan tambahan"
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

export default PersonOnCallPage;
