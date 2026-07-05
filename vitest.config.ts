import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
   test: {
        environment: "jsdom",
        setupFiles: ["./src/tests/setup.ts"],
        // testMatch: ['./src/tests/**/*.test.tsx'],
        // testNamePattern: /^*.test.tsx$/,
        css: true,
        globals: true,
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "json-summary", "html"],
            reportOnFailure: true,
            reportsDirectory: "./coverage",
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
