"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, XCircle } from "lucide-react";
import { toast } from "sonner";
import { ImageCropper } from "@/components/ui/image-cropper";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ASPECT_RATIO = 16 / 6;

export interface CropBannerUploaderProps {
  imagePreview: string | null;
  hasPendingFile: boolean;
  isUploading?: boolean;
  disabled?: boolean;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  label?: string;
  description?: string;
}

export function CropBannerUploader({
  imagePreview,
  hasPendingFile,
  isUploading = false,
  disabled = false,
  onFileSelect,
  onRemove,
  label = "Foto Banner",
  description = "Upload foto Banner (akan di-crop 16:6 dan diupload saat simpan)",
}: CropBannerUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

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

      const objectUrl = URL.createObjectURL(file);
      setCropSrc(objectUrl);
      setIsCropOpen(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    []
  );

  const handleCropComplete = useCallback(
    (croppedBlob: Blob) => {
      if (cropSrc) {
        URL.revokeObjectURL(cropSrc);
      }
      setCropSrc(null);

      const croppedFile = new File([croppedBlob], "cropped-image.jpg", {
        type: "image/jpeg",
      });
      onFileSelect(croppedFile);
    },
    [cropSrc, onFileSelect]
  );

  const handleCropClose = useCallback(() => {
    if (cropSrc) {
      URL.revokeObjectURL(cropSrc);
    }
    setCropSrc(null);
    setIsCropOpen(false);
  }, [cropSrc]);

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

  useEffect(() => {
    return () => {
      if (cropSrc) {
        URL.revokeObjectURL(cropSrc);
      }
    };
  }, [cropSrc]);

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
              className="w-full aspect-16/6 mx-auto rounded-lg object-cover"
              loading="lazy"
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
                : "Klik untuk upload banner (16:6)"}
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

      {/* Crop Dialog */}
      {cropSrc && (
        <ImageCropper
          open={isCropOpen}
          onClose={handleCropClose}
          imageSrc={cropSrc}
          onCropComplete={handleCropComplete}
          aspectRatio={ASPECT_RATIO}
        />
      )}
    </div>
  );
}
