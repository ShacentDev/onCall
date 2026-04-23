"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, XCircle } from "lucide-react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface BannerUploaderProps {
  imagePreview: string | null;
  hasPendingFile: boolean;
  isUploading?: boolean;
  disabled?: boolean;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  label?: string;
  description?: string;
}

export function BannerUploader({
  imagePreview,
  hasPendingFile,
  isUploading = false,
  disabled = false,
  onFileSelect,
  onRemove,
  label = "Gambar Banner",
  description = "Upload gambar banner (akan diupload saat simpan)",
}: BannerUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }

      onFileSelect(file);

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [onFileSelect]
  );

  const handleClick = useCallback(() => {
    if (!isUploading && !disabled) {
      fileInputRef.current?.click();
    }
  }, [isUploading, disabled]);

  const handleRemoveClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove();
    },
    [onRemove]
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <div
        className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 relative group"
        onClick={handleClick}
      >
        {imagePreview ? (
          <>
            <img
              src={imagePreview}
              alt="Preview"
              loading="lazy"
              className="max-h-64 w-auto mx-auto rounded-lg object-contain"
            />
            {hasPendingFile && (
              <div className="absolute top-2 left-2">
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800 border-yellow-300"
                >
                  Belum diupload
                </Badge>
              </div>
            )}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemoveClick}
              disabled={isUploading || disabled}
            >
              <XCircle className="size-4 mr-1" />
              Hapus
            </Button>
          </>
        ) : (
          <div className="py-10">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
              <ImageIcon className="size-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {isUploading
                ? "Mengupload..."
                : "Klik untuk upload gambar banner"}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Format: JPG, PNG (Max 5MB)
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading || disabled}
      />

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export interface UseBannerUploaderOptions {
  initialImageUrl?: string | null;
  initialImageKey?: string | null;
}

export interface UseBannerUploaderReturn {
  imagePreview: string | null;
  pendingFile: File | null;
  currentImageKey: string | null;
  originalImageKey: string | null;
  hasPendingFile: boolean;
  isRemoved: boolean;
  handleFileSelect: (file: File) => void;
  handleRemove: () => void;
  reset: (options?: UseBannerUploaderOptions) => void;
  getOldKeyForDeletion: (newKey: string | null) => string | null;
}

export function useBannerUploader(
  options: UseBannerUploaderOptions = {}
): UseBannerUploaderReturn {
  const [imagePreview, setImagePreview] = useState<string | null>(
    options.initialImageUrl || null
  );
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [currentImageKey, setCurrentImageKey] = useState<string | null>(
    options.initialImageKey || null
  );
  const [originalImageKey, setOriginalImageKey] = useState<string | null>(
    options.initialImageKey || null
  );
  const [isRemoved, setIsRemoved] = useState(false);

  const hasPendingFile = pendingFile !== null;

  const handleFileSelect = useCallback((file: File) => {
    setImagePreview((prev) => {
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return URL.createObjectURL(file);
    });
    setPendingFile(file);
    setCurrentImageKey(null);
    setIsRemoved(false);
    toast.info("Banner dipilih. Akan diupload saat simpan.");
  }, []);

  const handleRemove = useCallback(() => {
    setImagePreview((prev) => {
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
    setPendingFile(null);
    setCurrentImageKey(null);
    setIsRemoved(true);
  }, []);

  const reset = useCallback((newOptions: UseBannerUploaderOptions = {}) => {
    setImagePreview((prev) => {
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return newOptions.initialImageUrl || null;
    });
    setPendingFile(null);
    setCurrentImageKey(newOptions.initialImageKey || null);
    setOriginalImageKey(newOptions.initialImageKey || null);
    setIsRemoved(false);
  }, []);

  const getOldKeyForDeletion = useCallback(
    (newKey: string | null): string | null => {
      if (originalImageKey && originalImageKey !== newKey) {
        return originalImageKey;
      }
      return null;
    },
    [originalImageKey]
  );

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, []);

  return {
    imagePreview,
    pendingFile,
    currentImageKey,
    originalImageKey,
    hasPendingFile,
    isRemoved,
    handleFileSelect,
    handleRemove,
    reset,
    getOldKeyForDeletion,
  };
}
