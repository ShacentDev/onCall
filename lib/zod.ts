import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Format email tidak valid."),
  password: z
    .string()
    .min(8, "Password harus memiliki panjang minimal 8 karakter."),
});

export const createOnCallSchema = z.object({
  doctorName: z.string().min(1, "Nama dokter wajib diisi"),
  specialization : z.string().min(1, "Spesialis wajib diisi"),
  room: z.string().min(1, "Ruangan wajib diisi"),
  startTime: z.string().min(1, "Waktu mulai wajib"),
  endTime: z.string().min(1, "Waktu selesai wajib"),
  note: z.string().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type CreateOnCallSchema = z.infer<typeof createOnCallSchema>;


