# ============================================
# ProGuard Rules for StudyNext
# Optimized for security and compatibility
# ============================================

# ============================================
# GENERAL OPTIMIZATION SETTINGS
# ============================================
-optimizationpasses 5
-dontusemixedcaseclassnames
-verbose
-dontpreverify

# Keep source file names and line numbers for crash reports
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ============================================
# CAPACITOR / CORDOVA RULES
# ============================================
-keep class com.getcapacitor.** { *; }
-keep class org.apache.cordova.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin public class * { *; }
-keep public class * extends com.getcapacitor.Plugin { *; }

# JavaScript Interface (WebView)
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# ============================================
# FIREBASE RULES
# ============================================
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# Firestore
-keep class com.google.firebase.firestore.** { *; }
-keepclassmembers class * {
    @com.google.firebase.firestore.PropertyName <fields>;
}

# Firebase Auth
-keep class com.google.firebase.auth.** { *; }

# ============================================
# REVENUECAT RULES
# ============================================
-keep class com.revenuecat.** { *; }
-dontwarn com.revenuecat.**

# ============================================
# WEBKIT / WEBVIEW RULES
# ============================================
-keep class android.webkit.** { *; }
-dontwarn android.webkit.**

# ============================================
# SERIALIZATION RULES
# ============================================
# Gson
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# ============================================
# NATIVE METHODS
# ============================================
-keepclasseswithmembernames class * {
    native <methods>;
}

# ============================================
# ENUMS
# ============================================
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# ============================================
# PARCELABLE
# ============================================
-keepclassmembers class * implements android.os.Parcelable {
    public static final ** CREATOR;
}

# ============================================
# R CLASS
# ============================================
-keepclassmembers class **.R$* {
    public static <fields>;
}

# ============================================
# ANNOTATIONS
# ============================================
-keepattributes RuntimeVisibleAnnotations
-keepattributes RuntimeVisibleParameterAnnotations

# ============================================
# SECURITY: REMOVE LOGGING IN RELEASE
# ============================================
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# ============================================
# OKHTTP (if used by dependencies)
# ============================================
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# ============================================
# ANDROIDX
# ============================================
-keep class androidx.** { *; }
-dontwarn androidx.**
