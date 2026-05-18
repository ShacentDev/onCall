"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Trash, ArrowUpDown } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editPersonOnCallSchema, EditPersonOnCallSchema } from "@/lib/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/api-client";
import { useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { DateTimePicker } from "@/components/time-picker";
import useSWR from "swr";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type PersonOnCall = {
  id: string;
  personId: string;
  person: Person;
  room: string;
  startTime: string;
  endTime: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

const formatDate = (iso: string) =>
  format(new Date(iso), "dd MMM yyyy", { locale: id });

export const personOnCallColumns: ColumnDef<PersonOnCall>[] = [
  {
    id: "personCode",
    header: "Kode",
    accessorFn: (row) => row.person?.code,
    cell: ({ row }) => (
      <div className="font-mono font-medium">{row.original.person?.code}</div>
    ),
  },
  {
    id: "personName",
    accessorFn: (row) => row.person?.name,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 hover:bg-transparent"
      >
        Nama
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.person?.name}</div>,
  },
  {
    id: "categoryName",
    accessorFn: (row) => row.person?.category?.name,
    header: "Kategori",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.person?.category?.name}</Badge>
    ),
  },
  {
    accessorKey: "room",
    id: "room",
    header: "Ruangan",
  },
  {
    accessorKey: "startTime",
    id: "startTime",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 hover:bg-transparent"
      >
        Tanggal Praktek
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-sm">{formatDate(row.getValue("startTime"))}</div>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const onCall = row.original;
      return (
        <div className="space-x-2">
          <ViewPersonOnCallDialog onCall={onCall} />
          <DeletePersonOnCallDialog onCall={onCall} />
          <EditPersonOnCallDialog onCall={onCall} />
        </div>
      );
    },
  },
];

function ViewPersonOnCallDialog({ onCall }: { onCall: PersonOnCall }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detail Jadwal On Call</DialogTitle>
          <DialogDescription>
            Informasi lengkap jadwal on call
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Kode</p>
              <p className="font-mono font-semibold">{onCall.person?.code}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Kategori</p>
              <Badge variant="secondary">{onCall.person?.category?.name}</Badge>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Nama</p>
            <p className="font-medium">{onCall.person?.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Ruangan</p>
            <p>{onCall.room}</p>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Tanggal Praktek
              </p>
              <p className="text-sm">{formatDate(onCall.startTime)}</p>
            </div>
          </div>
          {onCall.notes && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Catatan</p>
                <p className="text-sm whitespace-pre-wrap">{onCall.notes}</p>
              </div>
            </>
          )}
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <p className="mb-1">Dibuat</p>
              <p>{formatDate(onCall.createdAt)}</p>
            </div>
            <div>
              <p className="mb-1">Diperbarui</p>
              <p>{formatDate(onCall.updatedAt)}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Tutup</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditPersonOnCallDialog({ onCall }: { onCall: PersonOnCall }) {
  const [open, setOpen] = useState(false);
  const { data: persons } = useSWR<Person[]>("/api/person");

  const form = useForm<EditPersonOnCallSchema>({
    resolver: zodResolver(editPersonOnCallSchema),
    defaultValues: {
      id: onCall.id,
      personId: onCall.personId,
      room: onCall.room,
      startTime: onCall.startTime,
      endTime: onCall.endTime,
      notes: onCall.notes ?? "",
    },
  });

  const onSubmit = async (values: EditPersonOnCallSchema) => {
    await apiRequest({
      url: "/api/oncall",
      method: "PATCH",
      data: values,
      revalidate: "/api/oncall",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-green-600">
          <Edit color="green" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Jadwal On Call</DialogTitle>
          <DialogDescription>
            Ubah data jadwal on call di bawah ini.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
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
                  placeholder="Ruangan"
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
            name="startTime"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Tanggal Praktek</FieldLabel>
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
          <Controller
            control={form.control}
            name="notes"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Catatan (opsional)</FieldLabel>
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
            {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeletePersonOnCallDialog({ onCall }: { onCall: PersonOnCall }) {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    await apiRequest({
      url: "/api/oncall",
      method: "DELETE",
      data: { id: onCall.id },
      revalidate: "/api/oncall",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-red-500">
          <Trash color="red" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
          <DialogDescription>
            Apakah kamu yakin ingin menghapus jadwal on call{" "}
            <span className="font-semibold">{onCall.person?.name}</span>?
            Tindakan ini tidak bisa dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Konfirmasi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
