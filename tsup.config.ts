import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  outDir: "dist",
  target: "node22",
  format: ["esm"],
  sourcemap: true,
  clean: true,
});
