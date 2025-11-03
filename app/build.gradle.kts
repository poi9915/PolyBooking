import org.jetbrains.kotlin.gradle.dsl.JvmTarget


plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.kotlin.serialization)


}

android {
    namespace = "com.poizz.polybooking"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.poizz.polybooking"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"


    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11

    }
    buildFeatures {
        compose = true
    }
}
kotlin{
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_11)
    }
}
dependencies {
    implementation("io.github.jan-tennert.supabase:storage-kt:3.2.4")
    implementation("io.github.jan-tennert.supabase:realtime-kt:3.2.4")
    implementation(platform("io.github.jan-tennert.supabase:bom:3.2.4"))
    implementation("io.github.jan-tennert.supabase:postgrest-kt")
    implementation("io.ktor:ktor-client-android:3.3.0")
    implementation("androidx.navigation:navigation-compose:2.9.5")

//    ViewModel , LiveData ,StateFlow
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.6")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.6")
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.8.6")
//    Coroutines + Flow
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0")
//    Google ID
    implementation("androidx.credentials:credentials:1.6.0-alpha05")
    implementation("androidx.credentials:credentials-play-services-auth:1.6.0-alpha05")
    implementation("com.google.android.libraries.identity.googleid:googleid:1.1.1")
//    Material ICON
    implementation("androidx.compose.material:material-icons-extended:1.6.7")

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.material)
    implementation(libs.androidx.compose.runtime)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.ui.test.junit4)
    debugImplementation(libs.androidx.ui.tooling)
    debugImplementation(libs.androidx.ui.test.manifest)
}