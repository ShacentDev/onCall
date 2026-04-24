"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash, ArrowUpDown } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editCategorySchema, EditCategorySchema } from "@/lib/zod";
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
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api-client";
import { useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export const categoryColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 hover:bg-transparent"
      >
        Nama Kategori
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="space-x-2">
          <DeleteCategoryDialog category={category} />
          <EditCategoryDialog category={category} />
        </div>
      );
    },
  },
];

function EditCategoryDialog({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);

  const form = useForm<EditCategorySchema>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: { id: category.id, name: category.name },
  });

  const onSubmit = async (values: EditCategorySchema) => {
    await apiRequest({
      url: "/api/category",
      method: "PATCH",
      data: values,
      revalidate: "/api/category",
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
          <DialogTitle>Edit Kategori</DialogTitle>
          <DialogDescription>
            Ubah nama kategori di bawah ini.
          </DialogDescription>
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
                <FieldLabel htmlFor={field.name}>Nama Kategori</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Nama kategori"
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

function DeleteCategoryDialog({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    await apiRequest({
      url: "/api/category",
      method: "DELETE",
      data: { id: category.id },
      revalidate: "/api/category",
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
            Apakah kamu yakin ingin menghapus kategori{" "}
            <span className="font-semibold">{category.name}</span>? Tindakan ini
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
