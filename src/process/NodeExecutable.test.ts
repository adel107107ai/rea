import { describe, expect, it } from "vitest";

import { nodeExecutable } from "./NodeExecutable.js";

describe("nodeExecutable", () => {
  it("keeps process.execPath when the setting is absent", () => {
    expect(nodeExecutable({})).toBe(process.execPath);
  });

  it("keeps process.execPath when the setting is empty or blank", () => {
    expect(nodeExecutable({ REA_NODE_BINARY: "" })).toBe(process.execPath);
    expect(nodeExecutable({ REA_NODE_BINARY: "   " })).toBe(process.execPath);
  });

  it("returns the configured absolute executable", () => {
    const configured = process.platform === "win32" ? "C:\\node\\node.exe" : "/usr/local/bin/node";
    expect(nodeExecutable({ REA_NODE_BINARY: configured })).toBe(configured);
  });

  it("trims surrounding whitespace", () => {
    const configured = process.platform === "win32" ? "C:\\node\\node.exe" : "/usr/local/bin/node";
    expect(nodeExecutable({ REA_NODE_BINARY: `  ${configured}  ` })).toBe(configured);
  });

  it("refuses a relative path instead of launching something unintended", () => {
    expect(() => nodeExecutable({ REA_NODE_BINARY: "node" })).toThrow(/absolute path/u);
  });
});
