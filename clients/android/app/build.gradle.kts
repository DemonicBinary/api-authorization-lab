plugins {
    id("com.android.application")
}
android {
    namespace = "com.demonicbinary.authorizationlab"
    compileSdk = 36
    defaultConfig {
        applicationId = "com.demonicbinary.authorizationlab"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }
    buildTypes {
        getByName("debug") { manifestPlaceholders["allowLocalHttp"] = "true" }
        getByName("release") { manifestPlaceholders["allowLocalHttp"] = "false" }
    }
}
