import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: ['src/index.ts'],
  outDir: './dist/',
  clean: false,
  format: ['cjs'],
  splitting: true,
  sourcemap: true,
  legacyOutput: true,
  watch: false,
  treeshake: true,
  dts: true,
});
