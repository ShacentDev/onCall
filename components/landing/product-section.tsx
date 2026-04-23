"use client";

import { useRef } from "react";
import useSWR from "swr";
import Link from "next/link";
import { PackagePlus, ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function ProductsSection() {
  const { data } = useSWR<{ data: Product[] }>(
    "/api/product?public=true&limit=15",
  );
  const products = data?.data ?? [];

  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  return (
    <section id="produk" className="py-24 px-[8vw] bg-white">
      <Reveal>
        <div className="text-center mb-14">
          <SectionEyebrow text="Menu Unggulan" centered />
          <h2 className="font-serif text-[clamp(32px,4vw,52px)] font-bold leading-[1.15] text-stone-900">
            Pilihan Produk{" "}
            <em className="not-italic text-red-600">Terfavorit</em>
          </h2>
          <p className="mt-4 text-[16px] text-stone-500 max-w-[480px] mx-auto leading-[1.7]">
            Dibuat fresh setiap hari dengan bahan pilihan, tanpa pengawet,
            dengan cita rasa yang konsisten.
          </p>
        </div>
      </Reveal>

      <Carousel
        plugins={[autoplay.current]}
        opts={{ align: "start", loop: true }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-4 basis-full sm:basis-1/3 lg:basis-1/5"
            >
              <div className="group rounded-2xl overflow-hidden border border-red-600/10 bg-[#FDF8F2] hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(192,24,31,0.1)] transition-all duration-300 cursor-default">
                <div className="w-full aspect-[4/3] relative bg-stone-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="size-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center">
                      <PackagePlus className="size-12 text-stone-300" />
                    </div>
                  )}
                </div>
                <div className="px-6 py-3 pb-3">
                  <h3 className="font-sans text-center text-[18px] font-semibold text-stone-900 line-clamp-2 leading-snug min-h-[48px]">
                    {product.name}
                  </h3>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="-left-5" />
        <CarouselNext className="-right-5" />
      </Carousel>

      <Reveal>
        <div className="flex justify-center mt-12">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="group self-start sm:self-auto shrink-0 rounded-full border-stone-300 hover:border-red-600 hover:text-red-600 gap-2 transition-all duration-300"
          >
            <Link href="/produk">
              Lihat Semua Produk
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
