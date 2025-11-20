import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: true,
    outDir: "dist",
    rollupOptions: {
      input: {
        // 1. File content script (logic giao diện trên web)
        content: resolve(__dirname, "src/content/main.jsx"),

        // 2. THÊM DÒNG NÀY: File background (logic chạy ngầm để bắt sự kiện click icon)
        background: resolve(__dirname, "src/background.js"),
      },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
