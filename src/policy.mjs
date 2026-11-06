// Synthetic toy data. This is not production authentication.
export const accounts = Object.freeze({
  alice: { id: "alice", tenantId: "alpha", role: "member", active: true },
  bob: { id: "bob", tenantId: "beta", role: "member", active: true },
  admin: { id: "admin", tenantId: "alpha", role: "tenant-admin", active: true },
  disabled: { id: "disabled", tenantId: "alpha", role: "member", active: false },
});
export const documents = Object.freeze({
  "doc-101": { id: "doc-101", ownerId: "alice", tenantId: "alpha", title: "Alpha project notes" },
  "doc-202": { id: "doc-202", ownerId: "bob", tenantId: "beta", title: "Beta release notes" },
  "doc-103": { id: "doc-103", ownerId: "admin", tenantId: "alpha", title: "Alpha administration" },
});
// Intentionally vulnerable: authenticated != authorized. For local lab only.
export function vulnerableRead(principal, documentId) {
  if (!principal?.active) return { status: 401, message: "Unauthenticated" };
  const doc = documents[documentId];
  return doc ? { status: 200, document: doc } : { status: 404, message: "Not found" };
}
export function canRead(principal, document) {
  if (!principal?.active || !document) return false;
  if (principal.tenantId !== document.tenantId) return false;
  return principal.id === document.ownerId || principal.role === "tenant-admin";
}
export function guardedRead(principal, documentId) {
  if (!principal?.active) return { status: 401, message: "Unauthenticated" };
  const doc = documents[documentId];
  if (!canRead(principal, doc)) return { status: 404, message: "Not found" };
  return { status: 200, document: doc };
}
