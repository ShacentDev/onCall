export const formatBlogSlug = (title: string, categoryId: string, date: Date) => {
    const titleFormatting = title
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

    const id = `${titleFormatting}-${categoryId}-${date.getTime()}`;
    return id;
}