import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { PluginOption } from "vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.resolve(rootDir, "src/content");
const productsFilePath = path.resolve(rootDir, "src/data/products.ts");
const homeSettingsFilePath = path.resolve(rootDir, "src/data/home-settings.ts");

type ProductRecord = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  kind: string;
  iconUrl?: string;
  cardBackgroundColor?: string;
  ribbonLabel?: string;
  featuredOnHome?: boolean;
  homeTitle?: string;
  homeSubtitle?: string;
};

type HomeSettingsRecord = {
  signupBackgroundImageUrl?: string;
  signupBackgroundColor?: string;
  signupButtonColor?: string;
  portfolioIconUrl?: string;
  shopBackgroundColor?: string;
};

type CreateNotePayload = {
  title?: string;
  excerpt?: string;
  readTime?: string;
  markdown?: string;
};

function serializeProductsModule(products: ProductRecord[]) {
  const serialized = JSON.stringify(products, null, 2).replace(
    /^(\s*)"([A-Za-z_$][\w$]*)":/gm,
    "$1$2:",
  );

  return `export type Product = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  kind: string;
  iconUrl?: string;
  cardBackgroundColor?: string;
  ribbonLabel?: string;
  featuredOnHome?: boolean;
  homeTitle?: string;
  homeSubtitle?: string;
};

export const products: Product[] = ${serialized};
`;
}

function serializeHomeSettingsModule(settings: HomeSettingsRecord) {
  const serialized = JSON.stringify(settings, null, 2).replace(
    /^(\s*)"([A-Za-z_$][\w$]*)":/gm,
    "$1$2:",
  );

  return `export type HomeSettings = {
  signupBackgroundImageUrl?: string;
  signupBackgroundColor?: string;
  signupButtonColor?: string;
  portfolioIconUrl?: string;
  shopBackgroundColor?: string;
};

export const homeSettings: HomeSettings = ${serialized};
`;
}

async function readRequestBody<T>(req: NodeJS.ReadableStream) {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as T;
}

function slugifyNoteTitle(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function formatNoteDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function markdownSavePlugin(): PluginOption {
  return {
    name: "markdown-save-plugin",
    configureServer(server) {
      server.middlewares.use("/__save-markdown", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method Not Allowed");
          return;
        }

        try {
          const chunks: Buffer[] = [];

          for await (const chunk of req) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          }

          const body = JSON.parse(Buffer.concat(chunks).toString("utf8")) as {
            filePath?: string;
            content?: string;
          };

          if (!body.filePath || typeof body.content !== "string") {
            res.statusCode = 400;
            res.end("Invalid payload");
            return;
          }

          const targetPath = path.resolve(rootDir, body.filePath);
          const relativeToContent = path.relative(contentDir, targetPath);
          const isMarkdownFile = targetPath.endsWith(".md");
          const isInsideContentDir =
            relativeToContent !== "" &&
            !relativeToContent.startsWith("..") &&
            !path.isAbsolute(relativeToContent);

          if (!isMarkdownFile || !isInsideContentDir) {
            res.statusCode = 403;
            res.end("Saving is only allowed for markdown files in src/content");
            return;
          }

          await fs.writeFile(targetPath, body.content, "utf8");

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true }));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              ok: false,
              error: error instanceof Error ? error.message : "Unknown save error",
            }),
          );
        }
      });

      server.middlewares.use("/__create-note", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method Not Allowed");
          return;
        }

        try {
          const body = await readRequestBody<CreateNotePayload>(req);
          const title = body.title?.trim() || "Untitled";
          const excerpt = body.excerpt?.trim() || "Draft note.";
          const readTime = body.readTime?.trim() || "3 min read";
          const baseSlug = slugifyNoteTitle(title) || "untitled";
          const existingContentFiles = await fs.readdir(contentDir);
          const existingSlugs = existingContentFiles
            .filter((fileName) => fileName.endsWith(".md"))
            .map((fileName) => fileName.replace(/\.md$/, ""));
          let slug = baseSlug;
          let counter = 2;

          while (existingSlugs.includes(slug)) {
            slug = `${baseSlug}-${counter}`;
            counter += 1;
          }

          const markdown =
            body.markdown?.trim() ||
            `---
collection: notes
title: ${title}
excerpt: ${excerpt}
date: ${formatNoteDate(new Date())}
readTime: ${readTime}
---

## ${title}

`;
          const filePath = `src/content/${slug}.md`;
          const targetPath = path.resolve(rootDir, filePath);

          await fs.writeFile(targetPath, `${markdown}\n`, "utf8");

          server.moduleGraph.invalidateAll();

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true, slug }));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              ok: false,
              error: error instanceof Error ? error.message : "Unknown create note error",
            }),
          );
        }
      });

      server.middlewares.use("/__save-products", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method Not Allowed");
          return;
        }

        try {
          const chunks: Buffer[] = [];

          for await (const chunk of req) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          }

          const body = JSON.parse(Buffer.concat(chunks).toString("utf8")) as {
            products?: ProductRecord[];
          };

          if (!Array.isArray(body.products)) {
            res.statusCode = 400;
            res.end("Invalid payload");
            return;
          }

          const sanitizedProducts = body.products.map((product) => ({
            ...product,
            iconUrl: product.iconUrl?.trim() || undefined,
            cardBackgroundColor: product.cardBackgroundColor?.trim() || undefined,
          }));

          await fs.writeFile(productsFilePath, serializeProductsModule(sanitizedProducts), "utf8");

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true }));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              ok: false,
              error: error instanceof Error ? error.message : "Unknown save error",
            }),
          );
        }
      });

      server.middlewares.use("/__save-home-settings", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method Not Allowed");
          return;
        }

        try {
          const chunks: Buffer[] = [];

          for await (const chunk of req) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          }

          const body = JSON.parse(Buffer.concat(chunks).toString("utf8")) as {
            signupBackgroundImageUrl?: string;
            signupBackgroundColor?: string;
            signupButtonColor?: string;
            portfolioIconUrl?: string;
            shopBackgroundColor?: string;
          };

          if (
            typeof body.signupBackgroundImageUrl !== "string" &&
            typeof body.signupBackgroundImageUrl !== "undefined"
          ) {
            res.statusCode = 400;
            res.end("Invalid payload");
            return;
          }

          if (
            typeof body.signupBackgroundColor !== "string" &&
            typeof body.signupBackgroundColor !== "undefined"
          ) {
            res.statusCode = 400;
            res.end("Invalid payload");
            return;
          }

          if (
            typeof body.signupButtonColor !== "string" &&
            typeof body.signupButtonColor !== "undefined"
          ) {
            res.statusCode = 400;
            res.end("Invalid payload");
            return;
          }

          if (
            typeof body.portfolioIconUrl !== "string" &&
            typeof body.portfolioIconUrl !== "undefined"
          ) {
            res.statusCode = 400;
            res.end("Invalid payload");
            return;
          }

          if (
            typeof body.shopBackgroundColor !== "string" &&
            typeof body.shopBackgroundColor !== "undefined"
          ) {
            res.statusCode = 400;
            res.end("Invalid payload");
            return;
          }

          const sanitizedSettings: HomeSettingsRecord = {
            signupBackgroundImageUrl: body.signupBackgroundImageUrl?.trim() || undefined,
            signupBackgroundColor: body.signupBackgroundColor?.trim() || undefined,
            signupButtonColor: body.signupButtonColor?.trim() || undefined,
            portfolioIconUrl: body.portfolioIconUrl?.trim() || undefined,
            shopBackgroundColor: body.shopBackgroundColor?.trim() || undefined,
          };

          await fs.writeFile(
            homeSettingsFilePath,
            serializeHomeSettingsModule(sanitizedSettings),
            "utf8",
          );

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true }));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              ok: false,
              error: error instanceof Error ? error.message : "Unknown save error",
            }),
          );
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths(), markdownSavePlugin()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(rootDir, "index.html"),
        artistKit: path.resolve(rootDir, "artist-kit/index.html"),
        gamedevArtistBundle: path.resolve(rootDir, "bundles/gamedev-artist/index.html"),
        bookGameArtGuidebook: path.resolve(rootDir, "books/game-art-guidebook/index.html"),
        artistPathInGamedev: path.resolve(rootDir, "courses/artist-path-in-gamedev/index.html"),
        privacyPolicy: path.resolve(rootDir, "privacy-policy/index.html"),
        shop: path.resolve(rootDir, "shop/index.html"),
        signup: path.resolve(rootDir, "signup/index.html"),
        newsletterThanks: path.resolve(rootDir, "newsletter-thanks/index.html"),
        termsOfService: path.resolve(rootDir, "terms-of-service/index.html"),
        newsletter: path.resolve(rootDir, "newsletter/index.html"),
      },
    },
  },
});
