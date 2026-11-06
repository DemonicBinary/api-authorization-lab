import { before, after, test } from "node:test";
import { strict as assert } from "node:assert";
import { createLabServer } from "../src/server.mjs";
const server = createLabServer();
let base;
before(async () => { await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve)); base = `http://127.0.0.1:${server.address().port}`; });
after(async () => { await new Promise((resolve) => server.close(resolve)); });
const get = (route, user) => fetch(base + route, { headers: user ? { authorization: `Bearer demo-${user}` } : {} });
test("guarded route denies cross-tenant without leaking record", async () => {
  const r = await get("/guarded/documents/doc-202", "alice");
  assert.equal(r.status, 404); assert.equal((await r.text()).includes("Beta release"), false);
});
test("vulnerable route demonstrates leak using synthetic data", async () => {
  const r = await get("/vulnerable/documents/doc-202", "alice");
  assert.equal(r.status, 200); assert.equal((await r.json()).document.ownerId, "bob");
});
test("guarded route allows legitimate owner", async () => assert.equal((await get("/guarded/documents/doc-101", "alice")).status, 200));
test("without identity, respond 401", async () => assert.equal((await get("/guarded/documents/doc-101")).status, 401));
test("unknown route and method return 404", async () => {
  assert.equal((await get("/admin", "alice")).status, 404);
  assert.equal((await fetch(base + "/guarded/documents/doc-101", { method: "POST" })).status, 404);
});
