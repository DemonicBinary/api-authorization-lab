import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { accounts, guardedRead, vulnerableRead } from "./policy.mjs";
export function createLabServer() {
  return createServer((request, response) => {
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");
    const pathname = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
    const match = /^\/(vulnerable|guarded)\/documents\/(doc-[0-9]+)$/.exec(pathname);
    if (request.method !== "GET" || !match) {
      response.writeHead(404);
      response.end(JSON.stringify({ message: "Not found" }));
      return;
    }
    // Hardcoded demo identities. NEVER use client-chosen identities in production.
    const bearer = request.headers.authorization ?? "";
    const token = bearer.length < 100 && bearer.startsWith("Bearer demo-") ? bearer.slice(12) : "";
    const principal = Object.hasOwn(accounts, token) ? accounts[token] : undefined;
    const result = match[1] === "guarded" ? guardedRead(principal, match[2]) : vulnerableRead(principal, match[2]);
    response.writeHead(result.status);
    response.end(JSON.stringify(result));
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  createLabServer().listen(8765, "127.0.0.1", () => {
    console.log("Synthetic local authorization lab: http://127.0.0.1:8765");
    console.log("The /vulnerable route is intentionally insecure. Never expose this service.");
  });
}
