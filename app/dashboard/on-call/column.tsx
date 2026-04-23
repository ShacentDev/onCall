"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Trash2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/api-client";
import { toast } from "sonner";

export const Columns = (): ColumnDef<OnCall>[] => [
  {
    accessorKey: "doctorName",
    header: "Dokter",
  },
  {
    accessorKey: "specialization",
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