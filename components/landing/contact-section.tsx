"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addDays } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { CONTACT_INFO, EVENT_TYPES, PACKAGE_OPTIONS, WHATSAPP_URL } from "@/lib/landing";
import { contactFormSchema, ContactFormSchema } from "@/lib/zod";
import { cn } from "@/lib/utils";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[12px] text-red-400 mt-1">{message}</p>;
}

export function ContactSection() {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const minDate = addDays(new Date(), 3);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      event: "",
      date: "",
      pax: 20,
      pkg: "",
      notes: "",
    },
  });

  const selectedDate = watch("date");

  const onSubmit = (values: ContactFormSchema) => {
    const msg = [
      "Halo Andrawina Kuliner Indonesia!",
      "",
      "Saya ingin memesan snack box:",
      "",
      `• Nama: ${values.name}`,
      `• WhatsApp: ${values.phone}`,
      `• Acara: ${values.event}`,
      `• Tanggal: ${values.date}`,
      `• Jumlah Pax: ${values.pax} pax`,
      `• Paket: ${values.pkg}`,
      `• Catatan: ${values.notes || "-"}`,
      "",
      "Mohon konfirmasi ketersediaan. Terima kasih!",
    ].join("\n");

    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const inputClass = (hasError?: boolean) =>
    cn(
      "w-full bg-white/6 border-white/12 text-white placeholder:text-white/25 focus-visible:ring-red-600/50 focus-visible:border-red-600/60",
      hasError && "border-red-500/60 focus-visible:ring-red-500/50",
    );

  return (
    <section
      id="kontak"
      className="py-24 px-[8vw] bg-[#1A1412] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600 via-amber-400 to-red-600" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[280px] font-bold text-white/[0.02] whitespace-nowrap pointer-events-none select-none leading-none">
        Andrawina
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
        <Reveal>
          <div>
            <SectionEyebrow text="Hubungi Kami" dark />
            <h2 className="font-serif text-[clamp(32px,4vw,52px)] font-bold leading-[1.15] text-white mt-1">
              Siap Melayani <em className="not-italic text-red-400">Pesanan</em>{" "}
              Anda
            </h2>
            <p className="text-[16px] leading-[1.7] text-white/50 mt-5 mb-10">
              Tim kami siap membantu Anda merencanakan menu terbaik untuk setiap
              acara. Hubungi kami sekarang dan dapatkan konsultasi gratis!
            </p>

            <div className="flex flex-col gap-5 mb-8">
              {CONTACT_INFO.map((info) => (
                <div key={info.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/7 flex items-center justify-center text-xl flex-shrink-0">
                    {info.emoji}
                  </div>
                  <div>
                    <div className="text-[12px] text-white/40 uppercase tracking-[0.06em] mb-0.5">
                      {info.label}
                    </div>
                    <div className="text-[15px] text-white font-medium">
                      {info.href ? (
                        <Link
                          href={info.href}
                          className="text-white hover:text-amber-300 no-underline transition-colors"
                          target="_blank"
                        >
                          {info.value}
                        </Link>
                      ) : (
                        info.value
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={`${WHATSAPP_URL}?text=Halo Andrawina Kuliner, saya ingin memesan snack box`}
              target="_blank"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-7 py-4 rounded-xl font-semibold text-[15px] no-underline transition-all hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(37,211,102,0.25)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.35)]"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat via WhatsApp
            </Link>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-9">
            <h3 className="font-serif text-[26px] font-bold text-white mb-7">
              Formulir Pemesanan
            </h3>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-[13px] text-white/60 font-medium tracking-wide">
                    Nama Lengkap
                  </Label>
                  <Input
                    placeholder="Nama Anda"
                    {...register("name")}
                    className={inputClass(!!errors.name)}
                  />
                  <FieldError message={errors.name?.message} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-[13px] text-white/60 font-medium tracking-wide">
                    Nomor WhatsApp
                  </Label>
                  <Input
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    {...register("phone")}
                    className={inputClass(!!errors.phone)}
                  />
                  <FieldError message={errors.phone?.message} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-[13px] text-white/60 font-medium tracking-wide">
                  Jenis Acara
                </Label>
                <Controller
                  name="event"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={cn(
                          "w-full bg-white/6 border-white/12 text-white/80 focus:ring-red-600/50",
                          !!errors.event && "border-red-500/60",
                        )}
                      >
                        <SelectValue placeholder="Pilih jenis acara..." />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_TYPES.map((e) => (
                          <SelectItem key={e} value={e}>
                            {e}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.event?.message} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-[13px] text-white/60 font-medium tracking-wide">
                    Tanggal Acara
                  </Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <button
                        suppressHydrationWarning
                        type="button"
                        className={cn(
                          "w-full flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-left transition-colors",
                          "bg-white/6 border-white/12 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/50",
                          !selectedDate && "text-white/25",
                          !!errors.date && "border-red-500/60",
                        )}
                      >
                        <CalendarIcon className="size-4 opacity-50 flex-shrink-0" />
                        {selectedDate
                          ? format(new Date(selectedDate), "dd MMMM yyyy", {
                              locale: id,
                            })
                          : "Pilih tanggal acara..."}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          selectedDate ? new Date(selectedDate) : undefined
                        }
                        onSelect={(date: Date | undefined) => {
                          setValue(
                            "date",
                            date ? format(date, "yyyy-MM-dd") : "",
                            {
                              shouldValidate: true,
                            },
                          );
                          setCalendarOpen(false);
                        }}
                        disabled={{ before: minDate }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FieldError message={errors.date?.message} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-[13px] text-white/60 font-medium tracking-wide">
                    Jumlah Pax
                  </Label>
                  <Input
                    type="number"
                    placeholder="min. 20 pax"
                    onWheel={(e) => e.currentTarget.blur()}
                    {...register("pax", { valueAsNumber: true })}
                    className={cn(
                      inputClass(!!errors.pax),
                      "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                    )}
                  />
                  <FieldError message={errors.pax?.message} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-[13px] text-white/60 font-medium tracking-wide">
                  Paket yang Diminati
                </Label>
                <Controller
                  name="pkg"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={cn(
                          "w-full bg-white/6 border-white/12 text-white/80 focus:ring-red-600/50",
                          !!errors.pkg && "border-red-500/60",
                        )}
                      >
                        <SelectValue placeholder="Pilih paket..." />
                      </SelectTrigger>
                      <SelectContent>
                        {PACKAGE_OPTIONS.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.pkg?.message} />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-[13px] text-white/60 font-medium tracking-wide">
                  Catatan Tambahan{" "}
                  <span className="text-white/30 font-normal">(opsional)</span>
                </Label>
                <Textarea
                  placeholder="Permintaan khusus, alergi, preferensi menu..."
                  rows={4}
                  {...register("notes")}
                  className="w-full bg-white/6 border-white/12 text-white placeholder:text-white/25 focus-visible:ring-red-600/50 focus-visible:border-red-600/60 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold tracking-wide text-[15px] py-6 shadow-[0_4px_20px_rgba(192,24,31,0.3)] hover:enabled:-translate-y-0.5 transition-all"
              >
                Kirim Pesanan via WhatsApp
              </Button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
