import { test } from "node:test";
import { strict as assert } from "node:assert";
import { accounts, canRead, documents, guardedRead, vulnerableRead } from "../src/policy.mjs";
test("guard rejects cross-tenant; vulnerable path exposes synthetic record", () => {
  assert.equal(vulnerableRead(accounts.alice, "doc-202").status, 200);
  assert.equal(guardedRead(accounts.alice, "doc-202").status, 404);
});
test("owner can read own document", () => assert.equal(guardedRead(accounts.alice, "doc-101").status, 200));
test("tenant admin reads same tenant but not another tenant", () => {
  assert.equal(guardedRead(accounts.admin, "doc-101").status, 200);
  assert.equal(guardedRead(accounts.admin, "doc-202").status, 404);
});
test("member cannot read same-tenant peer", () => assert.equal(canRead(accounts.alice, documents["doc-103"]), false));
test("disabled or missing identity cannot read", () => {
  assert.equal(guardedRead(undefined, "doc-101").status, 401);
  assert.equal(guardedRead(accounts.disabled, "doc-101").status, 401);
});
