"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash, ArrowUpDown } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editPersonSchema, EditPersonSchema } from "@/lib/zod";
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
import { apiRequest } from "@/lib/api-client";
import { useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import useSWR from "swr";

type Category = { id: string; name: string };

type Person = {
  id: string;
  name: string;
  code: string;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
};

export const personColumns: ColumnDef<Person>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 hover:bg-transparent"
      >
        Kode
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-mono font-medium">{row.getValue("code")}</div>
    ),
  },
  {
    accessorKey: "name",
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
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "category.name",
    header: "Kategori",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.original.category?.name}</div>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const person = row.original;
      return (
        <div className="space-x-2">
          <DeletePersonDialog person={person} />
          <EditPersonDialog person={person} />
        </div>
      );
    },
  },
];

function EditPersonDialog({ person }: { person: Person }) {
  const [open, setOpen] = useState(false);
  const { data: categories } = useSWR<Category[]>("/api/category");

  const form = useForm<EditPersonSchema>({
    resolver: zodResolver(editPersonSchema),
    defaultValues: {
      id: person.id,
      name: person.name,
      code: person.code,
      categoryId: person.categoryId,
    },
  });

  const onSubmit = async (values: EditPersonSchema) => {
    await apiRequest({
      url: "/api/person",
      method: "PATCH",
      data: values,
      revalidate: "/api/person",
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
          <DialogTitle>Edit Person</DialogTitle>
          <DialogDescription>Ubah data person di bawah ini.</DialogDescription>
        </DialogHeader>
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
            {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeletePersonDialog({ person }: { person: Person }) {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    await apiRequest({
      url: "/api/person",
      method: "DELETE",
      data: { id: person.id },
      revalidate: "/api/person",
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
            Apakah kamu yakin ingin menghapus person{" "}
            <span className="font-semibold">{person.name}</span>? Tindakan ini
            tidak bisa dibatalkan.
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
