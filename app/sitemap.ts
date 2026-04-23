import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const SITE_URL = process.env.WEBSITE_URL || "https://www.OnCallkuliner.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/produk`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
      },
    });

    // Produk tidak punya slug, pakai id sebagai identifier URL
    productPages = products.map((product) => ({
      url: `${SITE_URL}/produk/${product.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));
  } catch (error) {
    console.error("[sitemap] Gagal fetch produk:", error);
  }

  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true, // id blog sudah berupa slug dari formatBlogSlug()
        publishedAt: true,
        updatedAt: true,
      },
    });

    blogPages = blogs.map((blog) => ({
      url: `${SITE_URL}/blog/${blog.id}`,
      lastModified: blog.updatedAt ?? blog.publishedAt ?? now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));
  } catch (error) {
    console.error("[sitemap] Gagal fetch blog:", error);
  }

  return [...staticPages, ...productPages, ...blogPages];
}
