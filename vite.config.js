import { resolve } from "path";
import { defineConfig } from "vite";

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");

export default defineConfig({
  root: root,
  build: {
    outDir: outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        laser_simulation: resolve(root, "laser-simulation", "index.html"),
        generative_art: resolve(root, "generative-art", "index.html"),
      },
    },
  },
});
