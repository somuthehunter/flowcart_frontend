import { cn } from "@/lib/utils";
import { describe, expect, it } from "vitest";

describe("utils", () => {
    describe("cn", () => {
        it("merges class names correctly", () => {
            expect(cn("foo", "bar")).toBe("foo bar");
        });

        it("handles conditional classes", () => {
            const condition = false;
            expect(cn("foo", condition && "bar", "baz")).toBe("foo baz");
        });

        it("handles tailwind merge", () => {
            expect(cn("px-2", "px-4")).toBe("px-4");
        });
    });
});
