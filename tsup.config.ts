import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    clean: true,
    dts: true,
    minify: true,
    splitting: false,
    shims: true,
    outDir: "bin",
    banner: {
        js: "#!/usr/bin/env node",
    },
}); 