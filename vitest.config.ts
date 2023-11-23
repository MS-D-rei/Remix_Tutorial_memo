/// <reference types="vitest">
import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    exclude: [...configDefaults.exclude],
    watchExclude: [...configDefaults.watchExclude],
  },
});
