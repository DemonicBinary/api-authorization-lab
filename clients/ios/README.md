# iOS simulator client (SwiftUI)

This is a **buildable original SwiftUI demo**, not an App Store application. It connects to the local synthetic API authorization lab.

Requirements: macOS + Xcode, [XcodeGen](https://github.com/yonaskolb/XcodeGen) (or a manually configured equivalent Xcode project), iOS Simulator, Node.js 20+.

```sh
# Repo root, in one terminal
npm start

# In clients/ios
xcodegen generate
xcodebuild -project AuthorizationLab.xcodeproj -scheme AuthorizationLab -configuration Debug -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' CODE_SIGNING_ALLOWED=NO build
```

Run the app on an iOS Simulator, pick Alice and doc-202, then compare guarded 404 with intentionally vulnerable 200.

**Local-only security boundary:** The app uses loopback HTTP to the synthetic lab. Never use demo identities, disable transport security broadly, or connect this sample to production accounts.
