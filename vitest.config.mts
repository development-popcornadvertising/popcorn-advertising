import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

/**
 * Unit tests for the parts where being wrong is expensive: HTML escaping,
 * webhook signature verification, and the rate limiter.
 *
 * Deliberately narrow. There is no component or route testing here, because
 * the pages are static marketing content whose correctness is verified by
 * looking at them. What earns a test is logic with a security consequence
 * or an off-by-one, and none of that needs a DOM.
 *
 * `.mts` rather than `.ts`: this package has no "type": "module", so Vite's
 * native config loader treats a .ts config as CommonJS and warns about the
 * ESM syntax in it. The explicit extension settles it.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    // Mirrors the "@/*" path alias in tsconfig.json. Vitest does not read
    // tsconfig paths on its own.
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
