# 📱 Build Android APK Guide

Your app is now set up with Capacitor! Follow these steps to build the APK.

## ✅ Current Setup

- ✅ Capacitor installed and configured
- ✅ Android platform added
- ✅ Plugins installed (Camera, Filesystem, SplashScreen, StatusBar)
- ✅ App configured to use live URL: `https://alajo.ng`

## 🏗️ Build Options

### Option 1: Build with Android Studio (Recommended)

**Requirements:**
- Android Studio installed
- Java JDK 17+ installed

**Steps:**

1. **Open project in Android Studio:**
```bash
npx cap open android
```

2. **Wait for Gradle sync** (first time takes 5-10 minutes)

3. **Build APK:**
   - Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

4. **Install APK on device:**
   - Connect Android phone via USB
   - Enable USB debugging on phone
   - Click **Run** ▶️ button in Android Studio

---

### Option 2: Build via Command Line (Faster)

**Requirements:**
- Android SDK installed
- ANDROID_HOME environment variable set

**Steps:**

```bash
# Navigate to android directory
cd android

# Build debug APK
./gradlew assembleDebug

# Build release APK (for production)
./gradlew assembleRelease

# APK location:
# Debug: android/app/build/outputs/apk/debug/app-debug.apk
# Release: android/app/build/outputs/apk/release/app-release-unsigned.apk
```

---

## 📦 Quick Build Script

I've created a build script for you:

```bash
# Make script executable
chmod +x build-apk.sh

# Run build
./build-apk.sh
```

---

## 🔧 Configuration

### Current Configuration:
- **App ID:** com.alajo.app
- **App Name:** Alajo
- **Version:** 1.0.0
- **Server URL:** https://alajo.ng
- **Splash Screen:** Purple gradient (#9333ea)
- **Status Bar:** Purple (#9333ea)

### Update App URL:
Edit `capacitor.config.ts` and change the `url` property:

```typescript
server: {
  url: 'https://YOUR-DOMAIN.com', // Change this
}
```

---

## 🎨 Customize App Icons & Splash

### App Icons:
Place icons in: `android/app/src/main/res/`

Required sizes:
- `mipmap-hdpi/` - 72x72
- `mipmap-mdpi/` - 48x48
- `mipmap-xhdpi/` - 96x96
- `mipmap-xxhdpi/` - 144x144
- `mipmap-xxxhdpi/` - 192x192

### Splash Screen:
Place splash images in: `android/app/src/main/res/drawable-*/`

---

## 📝 Before Building

1. **Update package name** (if needed):
   Edit `android/app/build.gradle`:
   ```gradle
   applicationId "com.alajo.app"
   ```

2. **Update version**:
   Edit `android/app/build.gradle`:
   ```gradle
   versionCode 1
   versionName "1.0.0"
   ```

3. **Add permissions**:
   Permissions already added in `AndroidManifest.xml`:
   - Internet
   - Camera
   - Storage
   - Biometric/Fingerprint

---

## 🔐 Signing APK for Release

For production release to Google Play:

1. **Generate keystore:**
```bash
keytool -genkey -v -keystore alajo-release.keystore \
  -alias alajo -keyalg RSA -keysize 2048 -validity 10000
```

2. **Sign APK:**
```bash
cd android
./gradlew assembleRelease
```

3. **Configure signing** in `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file("../../alajo-release.keystore")
            storePassword "YOUR_PASSWORD"
            keyAlias "alajo"
            keyPassword "YOUR_PASSWORD"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

---

## 🚀 Install APK on Device

### Via USB:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Via File Transfer:
1. Copy APK to phone
2. Open file manager
3. Tap APK file
4. Allow "Install from Unknown Sources"
5. Install

---

## 🔄 Update App After Changes

Whenever you update your web app:

1. **If using live URL (current setup):**
   - No rebuild needed!
   - App will load latest version from server
   - Just update your website

2. **If using static files:**
   ```bash
   npm run build
   npx cap sync android
   # Then rebuild APK
   ```

---

## 🐛 Troubleshooting

### Issue: "ANDROID_HOME not set"
**Solution:** Install Android Studio and set environment variable:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Issue: "Gradle build failed"
**Solution:**
- Clean build: `cd android && ./gradlew clean`
- Update Gradle wrapper: `./gradlew wrapper --gradle-version 8.2`

### Issue: "App crashes on launch"
**Solution:**
- Check URL is accessible: `https://alajo.ng`
- Check LogCat in Android Studio for errors

### Issue: "White screen in app"
**Solution:**
- Ensure website has valid SSL certificate
- Check CORS settings on backend
- Verify URL in `capacitor.config.ts`

---

## 📱 Test on Device

### Enable USB Debugging:
1. Go to Settings → About Phone
2. Tap "Build Number" 7 times
3. Go to Settings → Developer Options
4. Enable "USB Debugging"

### Connect Device:
```bash
adb devices
# Should show your device
```

---

## 🎯 Next Steps

1. ✅ Build debug APK and test on device
2. ✅ Customize app icons and splash screen
3. ✅ Update app URL in config
4. ✅ Generate signed release APK
5. ✅ Submit to Google Play Store

---

## 💡 Tips

- **Live Mode:** Your APK loads from URL, so no rebuild needed for web updates
- **Offline Mode:** For offline support, switch to static export (requires fixing dynamic routes)
- **Performance:** Live mode needs internet, but loads latest version always
- **Updates:** Users get updates automatically without downloading new APK

---

## 📞 Need Help?

- **Capacitor Docs:** https://capacitorjs.com/docs
- **Android Docs:** https://developer.android.com/studio
- **Support:** info@harzotech.com

---

**Ready to build?** Run:
```bash
npx cap open android
```
Then click **Build → Build APK** 🚀
