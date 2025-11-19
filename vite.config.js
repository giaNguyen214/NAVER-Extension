import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    // Tắt folder dist mỗi lần build để tránh file rác
    emptyOutDir: true,
    outDir: "dist",
    rollupOptions: {
      input: {
        // Input là file JSX, KHÔNG PHẢI HTML
        content: resolve(__dirname, "src/content/main.jsx"),
      },
      output: {
        // Đặt tên cố định để manifest.json trỏ tới đúng chỗ
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
