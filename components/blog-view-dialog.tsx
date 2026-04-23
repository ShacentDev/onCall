"use client";

import { useState } from "react";
import { Eye, X, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format-date";
import { SimpleViewer } from "./simple-viewer";

interface BlogViewDialogProps {
  blog: Blog;
}

export function BlogViewDialog({ blog }: BlogViewDialogProps) {
  const [open, setOpen] = useState(false);

  const truncatedTitle =
    blog.title.length > 70 ? blog.title.slice(0, 70) + "..." : blog.title;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="text-green-600 hover:text-green-700 hover:border-green-300 hover:bg-green-50 transition-colors"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
        />

        <DialogPrimitive.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "w-[calc(100vw-2rem)] max-w-3xl",
            "max-h-[90vh] flex flex-col overflow-hidden",
            "rounded-2xl border border-border shadow-2xl outline-none bg-background",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "duration-200",
          )}
        >
          <div
            className="h-1.5 w-full flex-shrink-0"
            style={{
              background:
                "linear-gradient(90deg, #16a34a, #4ade80, #86efac, #16a34a)",
            }}
          />

          <div className="relative flex-shrink-0 px-6 pt-6 pb-4 border-b border-border bg-background">
            <DialogPrimitive.Close
              className={cn(
                "absolute top-4 right-4 rounded-full p-1.5",
                "text-muted-foreground hover:text-foreground hover:bg-muted",
                "transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Tutup</span>
            </DialogPrimitive.Close>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline">{blog.category}</Badge>
              <Badge
                variant={blog.status === "published" ? "default" : "secondary"}
              >
                {blog.status === "published" ? "Dipublikasikan" : "Draft"}
              </Badge>
            </div>

            <DialogPrimitive.Title className="text-2xl sm:text-3xl font-bold leading-tight pr-8">
              {truncatedTitle}
            </DialogPrimitive.Title>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" />
                {blog.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(blog.publishedAt || blog.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 bg-background">
            {blog.bannerImageUrl && (
              <div className="w-full aspect-video overflow-hidden">
                <img
                  src={blog.bannerImageUrl}
                  alt={truncatedTitle}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            <div className="px-6 py-6">
              <SimpleViewer content={blog.content} />
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center justify-end px-6 py-3 border-t border-border bg-muted/30">
            <DialogPrimitive.Close asChild>
              <Button variant="outline" size="sm">
                Tutup
              </Button>
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
