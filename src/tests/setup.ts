import { server } from "@/mocks/api/server";

import "@testing-library/jest-dom/vitest";

// import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

// expect.extend(matchers);
// Mock the workers module to avoid ComlinkWorker issues in tests
vi.mock("@/workers", () => ({
    remoteLogger: {
        log: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
    },
}));

beforeAll(() => {
    server.listen({
        onUnhandledRequest: "error",
    });
});

afterEach(() => {
    cleanup();
    server.resetHandlers();
});

afterAll(() => server.close());
