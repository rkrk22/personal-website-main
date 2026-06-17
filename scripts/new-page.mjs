import fs from "node:fs";
import path from "node:path";

const [, , rawSlug, ...titleParts] = process.argv;

if (!rawSlug) {
  console.error("Usage: npm run new:page -- <slug> [Page Title]");
  process.exit(1);
}

const slug = rawSlug
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9/-]+/g, "-")
  .replace(/\/+/g, "/")
  .replace(/^-+|-+$/g, "")
  .replace(/\/-+|-+\//g, "/");

if (!slug) {
  console.error("Slug must contain at least one letter or number.");
  process.exit(1);
}

const pageTitle = titleParts.length > 0 ? titleParts.join(" ").trim() : toTitle(slug);
const outputDir = path.join(process.cwd(), slug);
const outputFile = path.join(outputDir, "index.html");

if (fs.existsSync(outputFile)) {
  console.error(`Page already exists: ${outputFile}`);
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, buildHtml({ slug, pageTitle }));

console.log(`Created standalone page: /${slug}/`);
console.log(`File: ${path.relative(process.cwd(), outputFile)}`);

function toTitle(value) {
  return value
    .split("/")
    .pop()
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function buildHtml({ slug, pageTitle }) {
  const description = `${pageTitle} — Ruslan Kim`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(pageTitle)} — Ruslan Kim</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="author" content="Ruslan Kim" />
    <meta property="og:title" content="${escapeHtml(pageTitle)} — Ruslan Kim" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="stylesheet" href="/standalone-page.css" />
  </head>
  <body>
    <main>
      <a class="back" href="/">← Back</a>

      <section class="hero">
        <h1>${escapeHtml(pageTitle)}</h1>
        <p>Replace this text with the final page description.</p>
      </section>

      <section class="card">
        <p>Standalone page ready at <strong>/${escapeHtml(slug)}/</strong>.</p>
        <p class="note">Edit ${escapeHtml(slug)}/index.html to add the final content.</p>
      </section>
    </main>
  </body>
</html>
`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
