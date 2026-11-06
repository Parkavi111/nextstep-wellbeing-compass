import { describe, it, expect } from "vitest";
import { needsHumanSupport } from "@/lib/nextstep";

describe("human support rule", () => {
  it("triggers on crisis words", () => {
    expect(needsHumanSupport({}, "I want to END MY LIFE")).toBe(true);
    expect(needsHumanSupport({}, "thinking about self-harm")).toBe(true);
    expect(needsHumanSupport({}, "suicide")).toBe(true);
  });
  it("triggers on Overwhelmed + Months + A lot", () => {
    expect(needsHumanSupport({ feeling: "Overwhelmed", duration: "Months", impact: "A lot" }, "")).toBe(true);
  });
  it("does not trigger otherwise", () => {
    expect(needsHumanSupport({ feeling: "Overwhelmed", duration: "Months", impact: "A little" }, "tired")).toBe(false);
  });
});
