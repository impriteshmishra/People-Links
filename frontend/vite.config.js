import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import envCompatible from "vite-plugin-env-compatible"

export default defineConfig({
  envPrefix: "VITE_APP_",
  plugins: [react(), envCompatible()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
        usePolling: true,
    },
},
})
