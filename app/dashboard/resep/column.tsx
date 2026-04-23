"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash, ArrowUpDown } from "lucide-react";
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
import { apiRequest } from "@/lib/api-client";
import { useState } from "react";
import { toast } from "sonner";
import { RecipeViewDialog } from "@/components/recipe-dialog-view";

export const columns = (onEdit: (recipe: Recipe) => void): ColumnDef<Recipe>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 hover:bg-transparent"
      >
        Judul
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("title")}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 hover:bg-transparent"
      >
        Dibuat
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const recipe = row.original;

      return (
        <div className="space-x-2">
          <RecipeViewDialog recipe={recipe} />
          <Button
            variant="outline"
            size="icon"
            className="text-blue-600 hover:text-blue-700"
            onClick={() => onEdit(recipe)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <DeleteDialog recipe={recipe} />
        </div>
      );
    },
  },
];

function DeleteDialog({ recipe }: { recipe: Recipe }) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteRecipe = async () => {
    setIsDeleting(true);
    try {
      await apiRequest({
        url: "/api/recipe",
        method: "DELETE",
        data: { id: recipe.id },
        revalidate: "/api/recipe",
      });
      setOpen(false);
    } catch {
      toast.error("Gagal menghapus resep");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="text-red-600 hover:text-red-700"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
          <DialogDescription>
            Apakah kamu yakin ingin menghapus resep &quot;{recipe.title}&quot;? Tindakan ini
            tidak bisa dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeleting}>
              Batal
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDeleteRecipe}
            disabled={isDeleting}
          >
            {isDeleting ? "Menghapus..." : "Konfirmasi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}