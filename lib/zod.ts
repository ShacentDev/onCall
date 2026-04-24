import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Format email tidak valid."),
  password: z
    .string()
    .min(8, "Password harus memiliki panjang minimal 8 karakter."),
});

export const createOnCallSchema = z.object({
  doctorName: z.string().min(1, "Nama dokter wajib diisi"),
  specialization: z.string().min(1, "Spesialis wajib diisi"),
  room: z.string().min(1, "Ruangan wajib diisi"),
  startTime: z.string().min(1, "Waktu mulai wajib"),
  endTime: z.string().min(1, "Waktu selesai wajib"),
  note: z.string().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type CreateOnCallSchema = z.infer<typeof createOnCallSchema>;

// ── Category ──────────────────────────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi"),
});
export type CreateCategorySchema = z.infer<typeof createCategorySchema>;

export const editCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Nama kategori wajib diisi"),
});
export type EditCategorySchema = z.infer<typeof editCategorySchema>;

export const deleteCategorySchema = z.object({
  id: z.string().min(1),
});
export type DeleteCategorySchema = z.infer<typeof deleteCategorySchema>;

// ── Person ────────────────────────────────────────────────────────────────────

export const createPersonSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  code: z.string().min(1, "Kode wajib diisi"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
});
export type CreatePersonSchema = z.infer<typeof createPersonSchema>;

export const editPersonSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Nama wajib diisi"),
  code: z.string().min(1, "Kode wajib diisi"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
});
export type EditPersonSchema = z.infer<typeof editPersonSchema>;

export const deletePersonSchema = z.object({
  id: z.string().min(1),
});
export type DeletePersonSchema = z.infer<typeof deletePersonSchema>;

// ── PersonOnCall ──────────────────────────────────────────────────────────────

export const createPersonOnCallSchema = z.object({
  personId: z.string().min(1, "Person wajib dipilih"),
  room: z.string().min(1, "Ruangan wajib diisi"),
  startTime: z.string().min(1, "Waktu mulai wajib diisi"),
  endTime: z.string().min(1, "Waktu selesai wajib diisi"),
  notes: z.string().optional(),
});
export type CreatePersonOnCallSchema = z.infer<typeof createPersonOnCallSchema>;

export const editPersonOnCallSchema = z.object({
  id: z.string().min(1),
  personId: z.string().min(1, "Person wajib dipilih"),
  room: z.string().min(1, "Ruangan wajib diisi"),
  startTime: z.string().min(1, "Waktu mulai wajib diisi"),
  endTime: z.string().min(1, "Waktu selesai wajib diisi"),
  notes: z.string().optional(),
});
export type EditPersonOnCallSchema = z.infer<typeof editPersonOnCallSchema>;

export const deletePersonOnCallSchema = z.object({
  id: z.string().min(1),
});
export type DeletePersonOnCallSchema = z.infer<typeof deletePersonOnCallSchema>;
