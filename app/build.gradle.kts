import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.biblioteka.app"
    compileSdk = 36

    defaultConfig {
        // Same applicationId as the former Capacitor build, so it installs as an update.
        applicationId = "com.biblioteka.app"
        minSdk = 24
        targetSdk = 36
        versionCode = 2
        versionName = "2.0.0"
    }

    signingConfigs {
        create("release") {
            // Store credentials in ~/.gradle/gradle.properties:
            //   BIBLIOTEKA_STORE_FILE=/path/to/keystore.jks
            //   BIBLIOTEKA_STORE_PASSWORD=...
            //   BIBLIOTEKA_KEY_ALIAS=...
            //   BIBLIOTEKA_KEY_PASSWORD=...
            if (project.hasProperty("BIBLIOTEKA_STORE_FILE")) {
                storeFile = file(project.property("BIBLIOTEKA_STORE_FILE") as String)
                storePassword = project.property("BIBLIOTEKA_STORE_PASSWORD") as String
                keyAlias = project.property("BIBLIOTEKA_KEY_ALIAS") as String
                keyPassword = project.property("BIBLIOTEKA_KEY_PASSWORD") as String
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            if (project.hasProperty("BIBLIOTEKA_STORE_FILE")) {
                signingConfig = signingConfigs.getByName("release")
            }
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }

    lint {
        // Untranslated keys intentionally fall back to English (same behaviour as the web version).
        disable += "MissingTranslation"
    }

    packaging {
        resources.excludes += "/META-INF/{AL2.0,LGPL2.1}"
    }
}

kotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.lifecycle.viewmodel.ktx)
    implementation(libs.kotlinx.coroutines.android)

    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.foundation)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons)
    implementation(libs.androidx.compose.ui.tooling.preview)
    debugImplementation(libs.androidx.compose.ui.tooling)

    implementation(libs.material.color.utilities)

    testImplementation(libs.junit)
    testImplementation(libs.json)
}
