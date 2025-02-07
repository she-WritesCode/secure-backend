import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Set the root of your source directory
      // "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
