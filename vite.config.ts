import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(rootDir, "index.html"),
        signup: path.resolve(rootDir, "signup/index.html"),
        newsletter: path.resolve(rootDir, "newsletter/index.html"),
      },
    },
  },
});
