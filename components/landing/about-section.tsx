import Image from "next/image";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AboutSection() {
  return (
    <section id="tentang" className="py-24 px-[8vw] bg-[#FDF8F2]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <Reveal>
          <div className="relative">
            <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden rounded-tl-[60px] rounded-br-[60px] shadow-[0_24px_60px_rgba(192,24,31,0.28)]">
              <Image
                src="/images/about-us/foto_besar.jpg"
                alt="Andrawina Kuliner Indonesia"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute top-6 -left-6 bg-red-600 text-white rounded-xl px-5 py-5 text-center shadow-[0_8px_24px_rgba(192,24,31,0.3)]">
              <div className="font-serif text-[36px] font-bold leading-none">
                2017
              </div>
              <div className="text-[11px] opacity-80 mt-1 tracking-wide">
                Berdiri Sejak
              </div>
            </div>

            <div className="absolute -bottom-8 -right-8 w-[55%] aspect-square rounded-xl border-[6px] border-[#FDF8F2] shadow-[0_16px_40px_rgba(0,0,0,0.12)] overflow-hidden">
              <Image
                src="/images/about-us/foto_kecil.jpg"
                alt="Andrawina Kuliner Indonesia"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="lg:pl-5">
            <SectionEyebrow text="Tentang Kami" />
            <h2 className="font-serif text-[clamp(32px,4vw,52px)] font-bold leading-[1.15] text-stone-900">
              Warisan Rasa,{" "}
              <em className="not-italic text-red-600">Standar Modern</em>
            </h2>
            <p className="text-[16px] leading-[1.8] text-stone-600 mt-6 mb-9">
              Andrawina Kuliner Indonesia lahir dari kecintaan mendalam terhadap
              kekayaan kuliner Nusantara. Sejak 2017, kami hadir dengan satu
              komitmen: menjaga autentisitas cita rasa tradisional dengan
              standar produksi modern yang higienis dan terukur.
              <br />
              <br />
              Ratusan acara telah kami layani, dari gathering kantor hingga
              hajatan keluarga. Kepercayaan pelanggan setia kami adalah bukti
              bahwa konsistensi rasa dan keandalan layanan bukan sekadar janji,
              melainkan identitas kami.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="rounded-xl p-6 bg-red-600 text-white">
                <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-white/70 mb-2.5">
                  Visi
                </div>
                <p className="text-[14px] leading-[1.65] text-white/90">
                  Menjadi brand kuliner tradisional Indonesia yang modern,
                  profesional, dan dipercaya oleh berbagai institusi serta
                  masyarakat luas.
                </p>
              </div>
              <div className="rounded-xl p-6 bg-white border border-red-600/10">
                <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-red-600 mb-2.5">
                  Misi
                </div>
                <p className="text-[14px] leading-[1.65] text-stone-700">
                  Menjaga kualitas rasa, memberikan pelayanan profesional, dan
                  mengembangkan kuliner tradisional ke level nasional.
                </p>
              </div>
            </div>
            <Reveal>
              <div className="flex justify-center mt-12">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="group self-start w-60 sm:self-auto shrink-0 rounded-full border-stone-300 hover:border-red-600 hover:text-red-600 gap-2 transition-all duration-300"
                >
                  <Link href="/tentang-kami">
                    Lihat Selengkapnya
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
