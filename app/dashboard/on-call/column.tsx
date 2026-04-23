"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Eye, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOnCallSchema, CreateOnCallSchema } from "@/lib/zod";
import { toast } from "sonner";
import { DateTimePicker } from "@/components/time-picker";

export const Columns = (): ColumnDef<OnCall>[] => [
  {
    accessorKey: "doctorName",
    header: "Dokter",
  },
  {
    accessorKey: "specialization ",
    header: "Spesialis",
  },
  {
    accessorKey: "room",
    header: "Ruangan",
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => (
      <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Jadwal <ArrowUpDown className="inline h-4 w-4" />
      </button>
    ),
    cell: ({ row }) =>
      new Date(row.original.startTime).toLocaleString("id-ID"),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <DetailDialog data={row.original} />
        <EditDialog data={row.original} />
        <DeleteDialog id={row.original.id} />
      </div>
    ),
  },
];

// DETAIL
function DetailDialog({ data }: { data: OnCall }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detail OnCall</DialogTitle>
        </DialogHeader>

        <div className="text-sm space-y-2">
          <p><b>Dokter:</b> {data.doctorName}</p>
          <p><b>Spesialis:</b> {data.specialization}</p>
          <p><b>Ruangan:</b> {data.room}</p>
          <p><b>Mulai:</b> {new Date(data.startTime).toLocaleString()}</p>
          <p><b>Selesai:</b> {new Date(data.endTime).toLocaleString()}</p>
          <p><b>Catatan:</b> {data.notes || "-"}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditDialog({ data }: { data: OnCall }) {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateOnCallSchema>({
    resolver: zodResolver(createOnCallSchema),
    defaultValues: {
      ...data,
      startTime: data.startTime.slice(0, 16),
      endTime: data.endTime.slice(0, 16),
    },
  });

  const onSubmit = async (values: CreateOnCallSchema) => {
    const res = await apiRequest({
      url: "/api/oncall",
      method: "PATCH",
      data: { id: data.id, ...values },
      revalidate: "/api/oncall",
    });

    if (res) {
      toast.success("Berhasil update");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit OnCall</DialogTitle>
        </DialogHeader>

       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">

          <Field form={form} name="doctorName" label="Dokter" />
          <Field form={form} name="specialization" label="Spesialis" /> {/* FIX spasi */}
          <Field form={form} name="room" label="Ruangan" />

          {/* START TIME */}
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mulai</FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* END TIME */}
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selesai</FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Field form={form} name="notes" label="Catatan" /> {/* FIX notes */}

          <Button type="submit">Simpan</Button>
        </form>
      </Form>
      </DialogContent>
    </Dialog>
  );
}

// DELETE
function DeleteDialog({ id }: { id: string }) {
  const handleDelete = async () => {
    await apiRequest({
      url: "/api/oncall",
      method: "DELETE",
      data: { id },
      revalidate: "/api/oncall",
    });

    toast.success("Terhapus");
  };

  return (
    <Button variant="destructive" size="icon" onClick={handleDelete}>
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

// reusable field
function Field({ form, name, label }: any) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }: any) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}