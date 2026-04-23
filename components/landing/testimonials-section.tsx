import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { TESTIMONIALS } from "@/lib/landing";

export function TestimonialsSection() {
  return (
    <section id="testimonial" className="py-24 px-[8vw] bg-[#FDF8F2]">
      <Reveal>
        <div className="text-center mb-14">
          <SectionEyebrow text="Testimoni" centered />
          <h2 className="font-serif text-[clamp(32px,4vw,52px)] font-bold leading-[1.15] text-stone-900">
            Kata Mereka Tentang{" "}
            <em className="not-italic text-red-600">Kami</em>
          </h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 80} className="h-full">
            <div className="h-full flex flex-col bg-white rounded-2xl p-8 border border-stone-100 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300">
              <div className="text-amber-400 tracking-widest text-xs mb-5">
                ★★★★★
              </div>

              <p className="font-serif text-[17px] italic leading-[1.8] text-stone-600 flex-1 mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-5 border-t border-stone-100">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-serif text-[15px] font-bold text-white flex-shrink-0">
                  {t.initial}
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-stone-900 leading-tight">
                    {t.name}
                  </div>
                  <div className="text-[12px] text-stone-400 mt-0.5">
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
