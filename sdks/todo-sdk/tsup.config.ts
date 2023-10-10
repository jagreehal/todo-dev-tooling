import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: ['src/index.ts'],
  outDir: './dist/',
  clean: true,
  format: ['esm', 'cjs'],
  splitting: true,
  sourcemap: false,
  bundle: true,
  legacyOutput: true,
  watch: false,
  treeshake: true,
  dts: true,
});
