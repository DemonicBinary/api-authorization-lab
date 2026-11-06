# API authorization boundaries — Demonic Binary

An original **synthetic**, runnable BOLA (Broken Object Level Authorization) lab. It illustrates why authentication and UUID-like IDs are not enough to authorize access to multi-tenant resources. **Node.js 20+**, no dependencies or installs.

## Run

```sh
npm test
npm start
```

In a separate terminal, compare:

```sh
curl -i -H 'Authorization: Bearer demo-alice' http://127.0.0.1:8765/guarded/documents/doc-101
curl -i -H 'Authorization: Bearer demo-alice' http://127.0.0.1:8765/guarded/documents/doc-202
curl -i -H 'Authorization: Bearer demo-alice' http://127.0.0.1:8765/vulnerable/documents/doc-202
```

Expected: **200 / 404 / 200**. The last 200 is the deliberately vulnerable path reading **synthetic** Beta tenant data. The fixed endpoint enforces active account status, tenant membership and object ownership (or a same-tenant admin role). It chooses privacy-preserving 404 for denied objects.

**Safety:** This is not a production auth system. Tokens are fake, all data is fictional, and the server binds only to loopback (127.0.0.1). **Never expose the vulnerable route to a network, reuse its token approach, or load real customer data.** Real deployments need identity verification, denial logging, write/export coverage, revocation, delegation, job/caching boundaries and abuse protections.

Interactive browser walkthrough: https://demonicbinary.com/engineering-labs/api-authorization

Copyright 2026 Demonic Binary. MIT License.
