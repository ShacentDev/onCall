"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recipeFormSchema, RecipeFormSchema } from "@/lib/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Salad, Save, X } from "lucide-react";
import { SimpleEditor, SimpleEditorHandle } from "@/components/simple-editor";
import {
  useBannerUploader,
} from "@/components/banner-uploader";
import { Editor } from "@tiptap/core";
import { apiRequest } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Loading from "@/components/loading";
import { useSession } from "@/lib/client-session";
import { DataTable } from "@/components/data-table";
import { columns } from "./column";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const RecipePage = () => {
  const { user, isLoading: isLoadingSession } = useSession();
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<SimpleEditorHandle>(null);

  const [editor, setEditor] = useState<Editor | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const banner = useBannerUploader();

  const isAdmin = user?.role === "admin";
  const isUserValid = isAdmin && !isLoadingSession;
  const isEditMode = !!editingRecipe;

  const { data: recipes, isLoading: isLoadingRecipes } = useSWR(
    isUserValid ? "/api/recipe" : null,
  );

  const form = useForm<RecipeFormSchema>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: "",
      bannerImageUrl: undefined,
      bannerImageKey: "",
    },
  });

  const handleEditRecipe = useCallback(
    (recipe: Recipe) => {
      setEditingRecipe(recipe);

      form.setValue("title", recipe.title);
      form.setValue("bannerImageUrl", recipe.bannerImageUrl || undefined);
      form.setValue("bannerImageKey", recipe.bannerImageKey || "");

      banner.reset({
        initialImageUrl: recipe.bannerImageUrl,
        initialImageKey: recipe.bannerImageKey,
      });

      if (editor) {
        editor.commands.setContent(recipe.content);
      }

      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

      toast.info("Mode edit aktif");
    },
    [form, editor, banner],
  );

  const handleCancelEdit = useCallback(() => {
    setEditingRecipe(null);
    form.reset({
      title: "",
      bannerImageUrl: undefined,
      bannerImageKey: "",
    });
    editor?.commands.setContent("<p>Mulai menulis di sini...</p>");
    banner.reset();
    editorRef.current?.clearPendingImages();
    toast.info("Mode edit dibatalkan");
  }, [form, editor, banner]);

  const onSubmit = async (data: RecipeFormSchema) => {
    if (!editor) {
      toast.error("Editor belum siap");
      return;
    }

    const content = editor.getHTML();

    if (!content || content === "<p></p>" || content.trim() === "") {
      toast.error("Konten resep tidak boleh kosong");
      return;
    }

    setIsSaving(true);

    try {

      if (isEditMode) {
        await apiRequest({
          url: "/api/recipe",
          method: "PATCH",
          data: {
            id: editingRecipe.id,
            title: data.title,
            content,
          },
          revalidate: "/api/recipe",
        });
      } else {
        await apiRequest({
          url: "/api/recipe",
          method: "POST",
          data: {
            title: data.title,
            content,
          },
          revalidate: "/api/recipe",
        });
      }

      setEditingRecipe(null);
      form.reset({
        title: "",
        bannerImageUrl: undefined,
        bannerImageKey: "",
      });
      editor.commands.setContent("<p>Mulai menulis di sini...</p>");
      banner.reset();
      editorRef.current?.clearPendingImages();
    } catch (error: unknown) {
      let message = isEditMode ? "Gagal memperbarui resep" : "Gagal menyimpan resep";
      if (error instanceof Error && error.message) {
        message = error.message;
      }
      toast.error(message);
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isUserValid && !isLoadingSession && user) {
      toast.error("Akses ditolak. Hanya untuk Admin.");
      router.replace("/dashboard");
    }
  }, [isUserValid, isLoadingSession, user, router]);

  useEffect(() => {
    if (editor && editingRecipe) {
      editor.commands.setContent(editingRecipe.content);
    }
  }, [editor, editingRecipe]);

  if (!mounted || isLoadingSession || isLoadingRecipes) {
    return <Loading />;
  }

  if (!isUserValid) return null;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-24 md:pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Salad className="h-8 w-8" />
          Pencatatan Resep
        </h1>
        <p className="text-muted-foreground mt-2">
          Kelola catatan resep Anda. Total: {" "}
          <span className="font-semibold text-foreground">
            {recipes?.length || 0} catatan
          </span>
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Data Resep</CardTitle>
          <CardDescription>Daftar resep yang tersimpan</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <DataTable
            columns={columns(handleEditRecipe)}
            data={recipes || []}
            filterColumn="title"
            filterPlaceholder="Cari resep..."
          />
        </CardContent>
      </Card>

      <Card ref={formRef}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {isEditMode ? "Edit Resep" : "Buat Resep Baru"}
              </CardTitle>
              <CardDescription>
                {isEditMode
                  ? "Perbarui resep yang sudah ada"
                  : "Buat resep baru dengan gambar banner dan rich text editor"}
              </CardDescription>
            </div>
            {isEditMode && (
              <Badge variant="secondary" className="gap-1">
                Mode Edit
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={handleCancelEdit}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <form id="recipe-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="recipe-title">Judul Resep</FieldLabel>
                <Input
                  {...form.register("title")}
                  id="recipe-title"
                  placeholder="Masukkan judul resep..."
                  autoComplete="off"
                />
                {form.formState.errors.title && (
                  <FieldError errors={[form.formState.errors.title]} />
                )}
              </Field>

              <Field>
                <FieldLabel>Konten Resep</FieldLabel>
                <div className="border rounded-lg overflow-hidden">
                  <SimpleEditor ref={editorRef} onEditorReady={setEditor} />
                </div>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <Field orientation="horizontal" className="w-full">
            <Button
              type="button"
              variant="outline"
              onClick={
                isEditMode
                  ? handleCancelEdit
                  : () => {
                      form.reset({
                        title: "",
                        bannerImageUrl: undefined,
                        bannerImageKey: "",
                      });
                      editor?.commands.setContent(
                        "<p>Mulai menulis di sini...</p>",
                      );
                      banner.reset();
                      editorRef.current?.clearPendingImages();
                    }
              }
              className="flex-1"
              disabled={isSaving}
            >
              {isEditMode ? (
                <>
                  <X className="size-4 mr-2" />
                  Batal Edit
                </>
              ) : (
                "Reset"
              )}
            </Button>
            <Button
              type="submit"
              form="recipe-form"
              disabled={isSaving || isUploading}
              className="flex-1"
            >
              <Save className="size-4 mr-2" />
              {isSaving
                ? "Menyimpan..."
                : isEditMode
                  ? "Update Resep"
                  : "Simpan Resep"}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecipePage;