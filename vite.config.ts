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
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths(), markdownSavePlugin()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(rootDir, "index.html"),
        bookGameArtGuidebook: path.resolve(rootDir, "books/game-art-guidebook/index.html"),
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
