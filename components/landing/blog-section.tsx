"use client";

import useSWR from "swr";
import Link from "next/link";
import { ArrowRight, Calendar, ImageIcon, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { formatDate } from "@/lib/format-date";

export function BlogSection() {
  const { data } = useSWR<{ blogs: Blog[]; totalPages: number }>(
    "/api/blog?status=published&page=1&limit=4",
  );
  const blogs = data?.blogs ?? [];

  if (!blogs.length) return null;

  return (
    <section id="blog" className="py-24 px-[8vw] bg-[#FAFAF8]">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <SectionEyebrow text="Dari Dapur Kami" />
            <h2 className="font-serif text-[clamp(28px,3.5vw,48px)] font-bold leading-[1.15] text-stone-900 mt-2">
              Blog <em className="not-italic text-red-600">Terbaru</em>
            </h2>
            <p className="mt-3 text-[15px] text-stone-500 max-w-[400px] leading-[1.7]">
              Artikel, tips, dan cerita seputar kuliner Andrawina langsung dari
              dapur kami.
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="group self-start sm:self-auto shrink-0 rounded-full border-stone-300 hover:border-red-600 hover:text-red-600 gap-2 transition-all duration-300"
          >
            <Link href="/blog">
              Semua Artikel
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {blogs.map((blog, i) => (
          <Reveal key={blog.id} delay={i * 80}>
            <Link
              href={`/blog/${blog.id}`}
              className="group flex flex-col rounded-2xl overflow-hidden border border-stone-200 bg-white
                         hover:-translate-y-1.5 hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.12)] hover:border-stone-300
                         transition-all duration-300"
            >
              <div className="aspect-video w-full overflow-hidden bg-stone-100 flex-shrink-0">
                {blog.bannerImageUrl ? (
                  <img
                    src={blog.bannerImageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 gap-2">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col flex-1 gap-2.5">
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {blog.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(blog.publishedAt || blog.createdAt)}
                  </span>
                </div>

                <div className="h-10 overflow-hidden">
                  <h3 className="text-sm font-bold line-clamp-2 leading-snug text-stone-800 group-hover:text-red-700 transition-colors duration-200">
                    {blog.title}
                  </h3>
                </div>

                <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Baca selengkapnya
                  <ArrowRight className="size-3" />
                </span>
              </div>

              <div className="h-[2px] bg-gradient-to-r from-red-500 to-red-700 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
