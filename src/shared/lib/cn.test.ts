import { describe, it, expect } from "vitest";
import { cn } from "./index";

describe("cn", () => {
  it("склеивает классы", () => {
    expect(cn("a", "b")).toBe("a b");
  });
  it("убирает конфликты Tailwind", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
  it("игнорирует falsy", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });
});