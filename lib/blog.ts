import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function getBlog(id: string) {
  const decodedId = decodeURIComponent(id);

  const blog = await prisma.blog.findUnique({
    where: { id: decodedId },
    select: {
      id: true,
      title: true,
      content: true,
      bannerImageUrl: true,
      status: true,
      category: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  if (!blog || blog.status !== "published") notFound();

  return blog;
}

export async function getPublishedBlogIds() {
  const blogs = await prisma.blog.findMany({
    where: { status: "published" },
    select: { id: true },
  });

  return blogs.map((blog) => ({ id: blog.id }));
}
