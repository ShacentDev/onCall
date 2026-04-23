function normalizeFilename(name: string) {
  return name.normalize("NFKD");
}

function stripExtension(name: string) {
  return name.replace(/\.[^/.]+$/, "");
}

function sanitizeFilename(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export { normalizeFilename, stripExtension, sanitizeFilename };