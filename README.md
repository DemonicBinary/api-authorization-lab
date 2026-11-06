# Demonic Binary — API authorization lab

Original, public demonstration of **Broken Object Level Authorization (BOLA)** with a deliberately vulnerable handler, guarded backend policy and two native mobile demo clients. No real clients, credentials or user data.

## 1. Run the backend

Requires Node.js 20+. No external Node dependencies.

```sh
npm test
npm start
```

With the server running:

```sh
curl -i -H 'Authorization: Bearer demo-alice' http://127.0.0.1:8765/guarded/documents/doc-101
curl -i -H 'Authorization: Bearer demo-alice' http://127.0.0.1:8765/guarded/documents/doc-202
curl -i -H 'Authorization: Bearer demo-alice' http://127.0.0.1:8765/vulnerable/documents/doc-202
```

Expected HTTP status: **200 / 404 / 200**. The last response intentionally returns a record belonging to another *fictional* tenant.

## 2. Native app clients

- **[SwiftUI iOS Simulator app](clients/ios/README.md)** — `xcodegen generate` and `xcodebuild ... build` using Xcode. Built successfully with Xcode 27.2 on Apple Silicon.
- **[Kotlin Android Emulator app](clients/android/README.md)** — `bash gradlew :app:assembleDebug` with Android SDK 36. Built successfully with the available local Android toolchain.

These are **buildable development demo apps**, not approved Apple App Store or Google Play Store listings. Simulator/emulator runtime behavior still needs device-level testing; compilation alone is not a release certification.

## Interactive site

[Open the browser-only interactive lab](https://demonicbinary.com/engineering-labs/api-authorization) and [read the technical article](https://demonicbinary.com/research/api-authorization-enforce-every-object-boundary).

## Security and scope

The Node service binds **only to 127.0.0.1**. It has hard-coded toy identities and deliberately vulnerable behavior. Never expose it through a public tunnel or production server, copy the token scheme, load private data or use these apps for real account access. The Android debug app permits cleartext only for the local educational endpoint; release mode disables it.

License: MIT. Copyright 2026 Demonic Binary.
