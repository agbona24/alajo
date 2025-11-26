# 🚀 Quick Start - Build APK Now!

## ✅ Setup Complete!

Your Next.js app is now ready to build as an Android APK!

## 🎯 Choose Your Method:

### Method 1: Android Studio (Easiest) ⭐

1. **Open Android Studio:**
   ```bash
   npx cap open android
   ```

2. **Wait for Gradle sync** (2-5 minutes first time)

3. **Build APK:**
   - Click: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
   - Wait 2-3 minutes
   - APK ready at: `android/app/build/outputs/apk/debug/app-debug.apk`

4. **Install on Phone:**
   - Connect phone via USB
   - Click **Run ▶️** button
   - Done! 🎉

---

### Method 2: Command Line (Faster if you have SDK) ⚡

```bash
# Make script executable (one time only)
chmod +x build-apk.sh

# Run builder
./build-apk.sh

# Select option 1 for Debug APK
# APK will be at: alajo-debug.apk
```

---

## 📱 Your App Configuration:

- **App Name:** Alajo
- **Package:** com.alajo.app
- **Version:** 1.0.0
- **URL:** https://alajo.ng (loads from live website)
- **Theme:** Purple (#9333ea)

---

## ⚡ Quick Commands:

```bash
# Open in Android Studio
npx cap open android

# Build via command line
cd android && ./gradlew assembleDebug

# Install on connected device
adb install android/app/build/outputs/apk/debug/app-debug.apk

# View connected devices
adb devices
```

---

## 📦 What You Get:

✅ **Native Android App** (.apk file)
✅ **Splash Screen** (Purple gradient, 3 seconds)
✅ **App Icon** (Uses default for now)
✅ **Live Updates** (App loads from website, no rebuild needed!)
✅ **Camera Access** (For receipt uploads)
✅ **Biometric Auth** (Fingerprint/Face unlock)
✅ **Push Notifications** (Ready to configure)

---

## 🔄 How It Works:

Your APK is configured in **Live Mode**:
- App loads content from: `https://alajo.ng`
- No rebuild needed when you update website
- Users always see latest version
- Requires internet connection

**Benefits:**
- Instant updates ⚡
- No app store approval for changes
- Easy maintenance

**To switch to Offline Mode** (for no internet):
- See `BUILD_APK.md` for static export instructions
- Requires fixing dynamic routes first

---

## 🎨 Customize:

### Change App URL:
Edit `capacitor.config.ts`:
```typescript
server: {
  url: 'https://YOUR-DOMAIN.com'
}
```

### Add App Icons:
Place PNG files in:
- `android/app/src/main/res/mipmap-*/ic_launcher.png`

### Change Colors:
Edit `capacitor.config.ts`:
```typescript
plugins: {
  StatusBar: {
    backgroundColor: '#YOUR_COLOR'
  }
}
```

---

## ✅ Ready to Build?

**Option A - Android Studio:**
```bash
npx cap open android
```

**Option B - Command Line:**
```bash
./build-apk.sh
```

**Option C - Manual:**
```bash
cd android
./gradlew assembleDebug
```

---

## 🐛 Troubleshooting:

### "ANDROID_HOME not set"
Install Android Studio, then:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
```

### "Gradle sync failed"
In Android Studio: **File → Invalidate Caches → Restart**

### "App crashes on launch"
1. Check URL is accessible: https://alajo.ng
2. Ensure SSL certificate is valid
3. Check Android Studio LogCat for errors

---

## 📞 Need Help?

- **Full Guide:** See `BUILD_APK.md`
- **Capacitor Docs:** https://capacitorjs.com
- **Support:** info@harzotech.com

---

## 🎉 That's It!

Your APK is ready to build. Good luck! 🚀
