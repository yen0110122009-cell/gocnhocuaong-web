import { describe, expect, it } from "vitest";
import { validatePieceLedgerAdjustment } from "./pieceLedger";
import { calculateLedgerDelta } from "../shared/masterBuild";

const validInput = {
  pieceTypeId: "piece:general",
  delta: 3,
  kind: "admin_adjustment",
  idempotencyKey: "qa-ledger-001",
  reason: "QA contract test",
};

describe("piece ledger contract", () => {
  it("accepts integer non-zero adjustments with audit context", () => {
    expect(() => validatePieceLedgerAdjustment(validInput)).not.toThrow();
  });

  it("rejects zero, fractional and non-finite deltas", () => {
    expect(() => validatePieceLedgerAdjustment({ ...validInput, delta: 0 })).toThrow(/khác 0/);
    expect(() => validatePieceLedgerAdjustment({ ...validInput, delta: 1.5 })).toThrow(/số nguyên/);
    expect(() => validatePieceLedgerAdjustment({ ...validInput, delta: Number.NaN })).toThrow(/số nguyên/);
  });

  it("requires idempotency and audit reason", () => {
    expect(() => validatePieceLedgerAdjustment({ ...validInput, idempotencyKey: "" })).toThrow(/Idempotency/);
    expect(() => validatePieceLedgerAdjustment({ ...validInput, reason: "" })).toThrow(/Lý do/);
  });

  it("keeps the pure balance invariant independent of persistence", () => {
    expect(calculateLedgerDelta(4, -4)).toEqual({ previousBalance: 4, delta: -4, nextBalance: 0 });
    expect(() => calculateLedgerDelta(4, -5)).toThrow(/cannot become negative/);
  });
});
