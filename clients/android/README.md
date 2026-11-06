# Android Emulator client (Kotlin)

Buildable original native Kotlin Android demonstrator. **Not a Play Store application.** It uses platform Android widgets and synthetic local demo identity strings; there are no external Android dependencies beyond the Android Gradle plugin.

Requirements: Android SDK 36, Java 21, Android Emulator and internet access for the initial Gradle distribution/dependency fetch if not cached.

```sh
# Repo root
npm start

# In clients/android
bash gradlew :app:assembleDebug
```

Install the resulting debug APK on an Android Emulator. The emulator maps `10.0.2.2` to the developer machine's localhost, where the Node lab listens on port 8765. Try Alice with doc-202, switching between guarded and intentionally vulnerable handlers.

**Security limits:** This app is for local educational use only. HTTP cleartext is allowed only in the debug build; the release manifest disables it. Do not add real accounts, deploy the intentionally vulnerable API, or mistake the demo tokens for production authentication.
