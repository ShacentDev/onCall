"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { FAQ_ITEMS, WHATSAPP_URL } from "@/lib/landing";
import { cn } from "@/lib/utils";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-[8vw] bg-[#FDF8F2]">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 items-start">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <SectionEyebrow text="FAQ" />
            <h2 className="font-serif text-[clamp(32px,3.5vw,48px)] font-bold leading-[1.15] text-stone-900 mt-2">
              Ada yang ingin{" "}
              <em className="not-italic text-red-600">ditanyakan?</em>
            </h2>
            <p className="text-[15px] leading-[1.8] text-stone-500 mt-5">
              Kami siap menjawab semua pertanyaan Anda seputar produk,
              pemesanan, dan pengiriman.
            </p>

            <div className="mt-10 pt-8 border-t border-red-600/10">
              <p className="text-[13px] text-stone-400 mb-4">
                Tidak menemukan jawaban yang dicari?
              </p>
              <Button
                asChild
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold shadow-none"
              >
                <Link
                  href={`${WHATSAPP_URL}?text=Halo, saya ingin bertanya tentang layanan Andrawina Kuliner Indonesia`}
                  target="_blank"
                >
                  💬 Tanya Langsung
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="flex flex-col divide-y divide-stone-200">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={i} className="py-5">
                  <button
                    suppressHydrationWarning
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-start justify-between gap-6 text-left group cursor-pointer"
                  >
                    <span
                      className={cn(
                        "font-serif text-[17px] leading-snug transition-colors duration-200",
                        isOpen
                          ? "text-red-600"
                          : "text-stone-800 group-hover:text-red-600",
                      )}
                    >
                      {item.question}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 text-[22px] leading-none font-light flex-shrink-0 transition-all duration-300 text-stone-400",
                        isOpen
                          ? "rotate-45 text-red-600"
                          : "group-hover:text-red-600",
                      )}
                    >
                      +
                    </span>
                  </button>

                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      isOpen ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[14px] text-stone-500 leading-[1.85] max-w-[560px]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
