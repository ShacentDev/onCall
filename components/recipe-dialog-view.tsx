"use client";

import { useState } from "react";
import { Eye, X, Calendar, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimpleViewer } from "@/components/simple-viewer";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

interface RecipeViewDialogProps {
  recipe: Recipe;
}

export function RecipeViewDialog({ recipe }: RecipeViewDialogProps) {
  const [open, setOpen] = useState(false);

  const formattedDate = new Date(recipe.createdAt).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="text-emerald-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />

        {/*
          Dialog: flex column, max-h-[90vh], overflow-hidden.
          Scrolling dilakukan oleh div.flex-1 di dalam — bukan dialog itu sendiri.
        */}
        <DialogPrimitive.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "w-[calc(100vw-2rem)] max-w-2xl",
            // KRITIS: flex col + overflow-hidden, bukan overflow-y-auto di sini
            "max-h-[90vh] flex flex-col overflow-hidden",
            "rounded-2xl border border-stone-200 shadow-2xl outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "duration-200"
          )}
          style={{ background: "var(--recipe-bg, #fdfcf8)" }}
        >
          {/* Decorative header stripe */}
          <div
            className="h-1.5 w-full flex-shrink-0"
            style={{
              background:
                "linear-gradient(90deg, #a16207, #d97706, #84cc16, #16a34a)",
            }}
          />

          {/* Header — flex-shrink-0 agar tidak ikut scroll */}
          <div
            className="relative flex-shrink-0 px-6 pt-6 pb-4 border-b border-stone-200"
            style={{ background: "#fdfcf8" }}
          >
            <DialogPrimitive.Close
              className={cn(
                "absolute top-4 right-4 rounded-full p-1.5",
                "text-stone-400 hover:text-stone-700 hover:bg-stone-100",
                "transition-colors focus:outline-none focus:ring-2 focus:ring-stone-300"
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Tutup</span>
            </DialogPrimitive.Close>

            <div className="flex items-center gap-2 mb-2">
              <ChefHat className="h-4 w-4 text-amber-600" />
              <span
                className="text-xs font-semibold uppercase tracking-widest text-amber-600"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Resep
              </span>
            </div>

            <DialogPrimitive.Title
              className="text-2xl sm:text-3xl font-bold text-stone-800 leading-tight pr-8"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {recipe.title}
            </DialogPrimitive.Title>

            <div className="flex items-center gap-1.5 mt-3 text-stone-400">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs">{formattedDate}</span>
            </div>
          </div>

          {/*
            Scrollable area — flex-1 + overflow-y-auto + min-h-0.
            min-h-0 KRITIS agar flex child tidak melebihi parent.
          */}
          <div
            className="flex-1 overflow-y-auto min-h-0"
            style={{ background: "#fdfcf8" }}
          >
            {/* Banner Image */}
            {recipe.bannerImageUrl && (
              <div className="relative w-full aspect-video overflow-hidden">
                <img
                  src={recipe.bannerImageUrl}
                  alt={`Banner ${recipe.title}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent 40%, #fdfcf8 100%)",
                  }}
                />
              </div>
            )}

            {/* Content */}
            <div className={cn("px-6 pb-6", recipe.bannerImageUrl ? "pt-2" : "pt-5")}>
              <div className="recipe-view-content">
                <SimpleViewer content={recipe.content} />
              </div>
            </div>
          </div>

          {/* Footer — flex-shrink-0 agar selalu terlihat */}
          <div
            className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-t border-stone-200"
            style={{ background: "#f9f6f0" }}
          >
            <p
              className="text-xs text-stone-400 italic"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Selamat memasak! 🍴
            </p>
            <DialogPrimitive.Close asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-stone-300 text-stone-600 hover:bg-stone-100"
              >
                Tutup
              </Button>
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}