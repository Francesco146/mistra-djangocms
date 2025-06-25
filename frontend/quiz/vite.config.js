import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: "/static/",
    server: {
        port: 5173,
        host: "0.0.0.0",
    },
});
