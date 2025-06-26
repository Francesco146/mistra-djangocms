import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    base: "/static/",
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@routing": path.resolve(__dirname, "./src/routing"),
            "@features": path.resolve(__dirname, "./src/features/quiz"),
            "@assets": path.resolve(__dirname, "./src/assets"),
            "@hooks": path.resolve(__dirname, "./src/features/quiz/hooks"),
            "@styles": path.resolve(__dirname, "./src/styles"),
        },
    },
});
