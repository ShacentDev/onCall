"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { PACKAGES, WHATSAPP_URL } from "@/lib/landing";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

function PackageCard({ pkg }: { pkg: (typeof PACKAGES)[number] }) {
  return (
    <div
      className={cn(
        "rounded-2xl p-8 border relative overflow-hidden transition-all duration-300",
        pkg.featured
          ? "bg-red-600 border-red-600 text-white"
          : "bg-white border-red-600/10",
      )}
    >
      {pkg.badge && (
        <span className="absolute top-5 right-5 bg-amber-500 text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wide uppercase">
          {pkg.badge}
        </span>
      )}

      <div
        className={cn(
          "text-[13px] font-bold tracking-[0.1em] uppercase mb-2",
          pkg.featured ? "text-white/70" : "text-red-600",
        )}
      >
        {pkg.name}
      </div>

      <div
        className={cn(
          "font-serif text-[44px] font-bold leading-none mb-1",
          pkg.featured ? "text-white" : "text-stone-900",
        )}
      >
        {pkg.price}
      </div>
      <div
        className={cn(
          "text-[13px] mb-7",
          pkg.featured ? "text-white/60" : "text-stone-400",
        )}
      >
        {pkg.note}
      </div>

      <hr
        className={cn(
          "border-0 border-t mb-6",
          pkg.featured ? "border-white/20" : "border-stone-100",
        )}
      />

      <ul className="flex flex-col gap-3 mb-7">
        {pkg.items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[14px]">
            <span
              className={cn(
                "w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                pkg.featured
                  ? "bg-white/20 text-white"
                  : "bg-red-600/10 text-red-600",
              )}
            >
              <Check size={10} strokeWidth={3} />
            </span>
            <span className={pkg.featured ? "text-white/90" : "text-stone-600"}>
              {item}
            </span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        className={cn(
          "w-full font-semibold tracking-wide transition-all",
          pkg.featured
            ? "bg-white text-red-600 hover:bg-stone-50"
            : "bg-red-600 text-white hover:bg-red-700 shadow-[0_4px_16px_rgba(192,24,31,0.2)]",
        )}
      >
        <Link
          href={`${WHATSAPP_URL}?text=${encodeURIComponent(pkg.waText)}`}
          target="_blank"
        >
          Pesan {pkg.name}
        </Link>
      </Button>
    </div>
  );
}

export function PackagesSection() {
  const featured = PACKAGES.find((p) => p.featured) ?? PACKAGES[0];

  return (
    <section id="paket" className="py-24 px-[8vw] bg-[#FDF8F2]">
      <Reveal>
        <div className="text-center mb-14">
          <SectionEyebrow text="Paket Snack Box" centered />
          <h2 className="font-serif text-[clamp(32px,4vw,52px)] font-bold leading-[1.15] text-stone-900">
            Pilih <em className="not-italic text-red-600">Paket Terbaik</em>{" "}
            Anda
          </h2>
          <p className="mt-4 text-[16px] text-stone-500 max-w-[460px] mx-auto leading-[1.7]">
            Fleksibel, customizable, dan siap melayani pesanan kecil hingga
            besar untuk berbagai acara.
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="hidden xl:grid xl:grid-cols-3 xl:gap-6 xl:items-end">
          {PACKAGES.map((pkg, i) => (
            <div key={pkg.name} className={cn(pkg.featured && "scale-[1.04]")}>
              <PackageCard pkg={pkg} />
            </div>
          ))}
        </div>

        <div className="xl:hidden">
          <Tabs defaultValue={featured.name}>
            <TabsList className="w-full mb-6 bg-white border border-red-600/10 p-1 h-auto rounded-xl">
              {PACKAGES.map((pkg) => (
                <TabsTrigger
                  key={pkg.name}
                  value={pkg.name}
                  className="flex-1 text-[13px] font-semibold data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-lg py-2 transition-all"
                >
                  {pkg.name.replace("Paket ", "")}
                  {pkg.badge && (
                    <span className="ml-1.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      ★
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            {PACKAGES.map((pkg) => (
              <TabsContent key={pkg.name} value={pkg.name}>
                <PackageCard pkg={pkg} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </Reveal>
    </section>
  );
}
