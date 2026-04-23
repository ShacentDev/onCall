"use client";

import useSWR from "swr";
import { DataTable } from "@/components/data-table";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { useSession } from "@/lib/client-session";
import { Separator } from "@/components/ui/separator";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { apiRequest } from "@/lib/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOnCallSchema, CreateOnCallSchema } from "@/lib/zod";
import { Columns } from "./column";
import { Input } from "@/components/ui/input";

export default function OnCallPage() {
  const { user, isLoading } = useSession();

  const isValid = !!user && !isLoading;

  const { data, isLoading: loadingData } = useSWR(
    isValid ? "/api/oncall" : null
  );

  const form = useForm<CreateOnCallSchema>({
    resolver: zodResolver(createOnCallSchema),
    mode: "onChange",
    defaultValues: {
      doctorName: "",
      specialization : "",
      room: "",
      startTime: "",
      endTime: "",
      note: "",
    },
  });

  const onSubmit = async (values: CreateOnCallSchema) => {
    const res = await apiRequest({
      url: "/api/oncall",
      method: "POST",
      data: values,
      revalidate: "/api/oncall",
    });

    if (res) {
      form.reset();
    }
  };

  if (isLoading || loadingData) return <Loading />;
  if (!isValid) return null;

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">OnCall Dokter</h1>
        <p className="text-muted-foreground">
          Kelola jadwal dokter jaga
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Daftar OnCall</CardTitle>
          <CardDescription>
            Semua jadwal dokter yang aktif
          </CardDescription>
        </CardHeader>

        <CardContent>
          <DataTable
            columns={Columns()}
            data={data || []}
            filterColumn="doctorName"
            filterPlaceholder="Cari dokter..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tambah OnCall</CardTitle>
          <CardDescription>
            Tambahkan jadwal dokter baru
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">

              <Input placeholder="Nama Dokter" {...form.register("doctorName")} />
              <Input placeholder="Spesialis" {...form.register("specialization")} />
              <Input placeholder="Ruangan" {...form.register("room")} />

              <Input type="datetime-local" {...form.register("startTime")} />
              <Input type="datetime-local" {...form.register("endTime")} />

              <Input placeholder="Catatan" {...form.register("note")} />

              <Button
                type="submit"
                disabled={!form.formState.isValid}
              >
                Tambah
              </Button>

            </form>
          </Form>
        </CardContent>
      </Card>

    </div>
  );
}