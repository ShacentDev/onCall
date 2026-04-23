import Image from "next/image";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { WHY_FEATURES } from "@/lib/landing";
import { cn } from "@/lib/utils";

const WHY_IMAGES = [
  {
    src: "/images/featured/autentik.jpg",
    alt: "Kualitas Autentik Terjaga",
  },
  {
    src: "/images/featured/experiences.png",
    alt: "9 Tahun Pengalaman",
    mt: "lg:mt-8",
  },
  { src: "/images/featured/layanan-fix.jpg", alt: "Layanan Profesional" },
  {
    src: "/images/featured/pelayanss.jpg",
    alt: "Dipercaya Institusi",
    mt: "lg:mt-8",
  },
];

export function WhyUsSection() {
  return (
    <section id="mengapa-kami" className="py-24 bg-white overflow-hidden">
      <div className="px-[8vw] grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <Reveal>
          <div>
            <SectionEyebrow text="Keunggulan Kami" />
            <h2 className="font-serif text-[clamp(32px,4vw,52px)] font-bold leading-[1.15] text-stone-900">
              Mengapa Memilih{" "}
              <em className="not-italic text-red-600">Andrawina?</em>
            </h2>
            <p className="text-[16px] leading-[1.8] text-stone-500 mt-5 mb-10">
              Kami bukan sekadar produsen jajanan. Kami adalah mitra terpercaya
              untuk setiap momen spesial Anda — dengan standar kualitas yang
              tidak pernah kami kompromikan.
            </p>

            <div className="flex flex-col gap-4">
              {WHY_FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="flex gap-5 items-start p-5 rounded-xl border border-red-600/10 bg-white hover:border-red-600/30 hover:translate-x-1.5 transition-all duration-300 cursor-default"
                >
                  <div className="w-11 h-11 rounded-xl bg-red-600/8 flex items-center justify-center text-[20px] flex-shrink-0">
                    {f.emoji}
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-stone-900 mb-1">
                      {f.title}
                    </div>
                    <div className="text-[13px] text-stone-500 leading-[1.65]">
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Desktop: staggered 2x2 grid */}
        <Reveal delay={120}>
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {WHY_IMAGES.map((img) => (
              <div
                key={img.src}
                className={cn(
                  "aspect-square rounded-xl overflow-hidden",
                  img.mt,
                )}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
