# 📱 Mobile App Conversion Guide

This guide explains how to convert your Alajo web app to native mobile apps using various tools and services.

## 📁 Configuration Files

Three JSON configuration files have been created for different conversion methods:

### 1. **app-config.json** (Universal Config)
- Comprehensive configuration for all conversion tools
- Contains all app settings, permissions, features
- Use this as reference for any conversion service

### 2. **capacitor.config.json** (Capacitor/Ionic)
- Specific configuration for Capacitor framework
- Best for production-grade apps
- Requires development environment setup

### 3. **webview-config.json** (Drag & Drop Services)
- Simplified config for WebViewGold, Gonative, etc.
- Quick conversion without coding
- Perfect for MVP/testing

---

## 🚀 Conversion Methods

### Method 1: Capacitor (Recommended for Production)

**Pros:** Full native features, best performance, app store ready
**Cons:** Requires development setup

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios

# Initialize Capacitor
npx cap init "Alajo" "com.alajo.app" --web-dir="frontend/out"

# Copy the capacitor.config.json to your project root

# Build your Next.js app for export
cd frontend
npm run build

# Add platforms
npx cap add android
npx cap add ios

# Open in native IDEs
npx cap open android  # Opens Android Studio
npx cap open ios      # Opens Xcode
```

**Required:**
- Node.js 16+
- Android Studio (for Android)
- Xcode (for iOS, Mac only)

---

### Method 2: WebViewGold (No-Code Solution)

**Pros:** No coding, very fast, drag & drop
**Cons:** Limited customization, requires license

**Steps:**
1. Purchase WebViewGold license ($199-$499)
2. Download WebViewGold template
3. Import `webview-config.json` settings
4. Configure:
   - App URL: `https://alajo.ng`
   - App Name: `Alajo`
   - Package: `com.alajo.app`
5. Build & Export APK/IPA

**Website:** https://webviewgold.com

---

### Method 3: Gonative.io (Cloud Service)

**Pros:** No setup, cloud-based, quick
**Cons:** Subscription required ($99/month)

**Steps:**
1. Sign up at https://gonative.io
2. Create new app
3. Enter app URL: `https://alajo.ng`
4. Use `webview-config.json` for configuration:
   - Copy settings from JSON to Gonative dashboard
   - Upload icons from `/frontend/public/icons/`
   - Configure splash screen
5. Download APK/IPA

**Features included:**
- Push notifications
- Deep linking
- Biometric auth
- Camera access
- File uploads

---

### Method 4: PWA (Progressive Web App)

**Pros:** Free, no app store, instant updates
**Cons:** Limited features, requires browser

Your app is already a PWA! Users can install it directly from browser:

**Android:**
1. Open https://alajo.ng in Chrome
2. Tap menu → "Add to Home Screen"
3. App installs like native app

**iOS:**
1. Open https://alajo.ng in Safari
2. Tap Share → "Add to Home Screen"
3. App installs on home screen

---

## 🎨 Required Assets

### App Icons
Create these icon sizes and place in `/frontend/public/icons/`:

**Android:**
- 36x36 (ldpi)
- 48x48 (mdpi)
- 72x72 (hdpi)
- 96x96 (xhdpi)
- 144x144 (xxhdpi)
- 192x192 (xxxhdpi)
- 512x512 (Play Store)

**iOS:**
- 20x20, 40x40, 60x60
- 29x29, 58x58, 87x87
- 76x76, 152x152
- 83.5x83.5
- 1024x1024 (App Store)

**Tool:** Use https://appicon.co to generate all sizes from one 1024x1024 image

### Splash Screen
- Already created: `/frontend/public/animations/splash-screen.json`
- Lottie animation (works with all tools)
- Duration: 3 seconds
- Colors: Purple gradient (#9333ea)

---

## 🔧 Important URLs to Update

Before converting, update these URLs in your config files:

```json
{
  "url": "https://YOUR-DOMAIN.com",  // Change this!
  "privacyPolicy": "https://YOUR-DOMAIN.com/privacy",
  "termsOfService": "https://YOUR-DOMAIN.com/terms"
}
```

Current placeholder: `https://alajo.ng`

---

## 📱 Platform-Specific Requirements

### Android (APK)
**Requirements:**
- Keystore file (for signing)
- Google Play Developer account ($25 one-time)
- Min SDK: Android 7.0 (API 24)
- Target SDK: Android 14 (API 34)

**Generate Keystore:**
```bash
keytool -genkey -v -keystore alajo-release.keystore \
  -alias alajo -keyalg RSA -keysize 2048 -validity 10000
```

### iOS (IPA)
**Requirements:**
- Apple Developer account ($99/year)
- Mac with Xcode
- Min iOS: 13.0
- Signing certificate & provisioning profile

---

## 🔐 Security Configuration

### SSL Certificate
- Required: Valid SSL certificate on your domain
- Recommended: Let's Encrypt (free) or Cloudflare

### API Security
- Enable CORS for your domain
- Add app package name to API whitelist
- Use API key authentication

### Payment Integration
Make sure these domains are whitelisted:
- `paystack.com`
- `flutterwave.com`
- Your API domain

---

## 📊 Testing Checklist

Before submitting to app stores:

- [ ] Test on physical Android device
- [ ] Test on physical iOS device
- [ ] Test biometric login
- [ ] Test camera for receipt upload
- [ ] Test push notifications
- [ ] Test payment flow (Paystack/Flutterwave)
- [ ] Test offline mode
- [ ] Test deep linking
- [ ] Check app icon displays correctly
- [ ] Check splash screen shows properly
- [ ] Test pull-to-refresh
- [ ] Test file upload/download
- [ ] Check performance (< 3s load time)

---

## 🏪 App Store Submission

### Google Play Store
1. Sign APK with keystore
2. Create app listing
3. Upload screenshots (min 2, max 8)
4. Write description (use from config)
5. Set category: Finance
6. Content rating: Everyone
7. Submit for review (1-3 days)

### Apple App Store
1. Archive in Xcode
2. Upload to App Store Connect
3. Create app listing
4. Upload screenshots (all device sizes)
5. Set category: Finance
6. Privacy policy required
7. Submit for review (1-7 days)

---

## 💰 Cost Breakdown

### Option 1: Capacitor (DIY)
- Development: Free (open source)
- Google Play: $25 one-time
- Apple Store: $99/year
- **Total Year 1:** $124

### Option 2: WebViewGold
- License: $199-$499 one-time
- Google Play: $25 one-time
- Apple Store: $99/year
- **Total Year 1:** $323-$623

### Option 3: Gonative.io
- Service: $99/month ($1,188/year)
- Google Play: $25 one-time
- Apple Store: $99/year
- **Total Year 1:** $1,312

### Option 4: PWA
- Cost: $0 (completely free!)
- No app store required

---

## 🔗 Useful Resources

- **Capacitor Docs:** https://capacitorjs.com/docs
- **WebViewGold:** https://webviewgold.com
- **Gonative:** https://gonative.io
- **Icon Generator:** https://appicon.co
- **Splash Generator:** https://apetools.webprofusion.com

---

## 🆘 Troubleshooting

### Issue: White screen on app launch
**Solution:** Check that your web URL is accessible and returns content

### Issue: Push notifications not working
**Solution:** Configure FCM (Firebase Cloud Messaging) for Android, APNS for iOS

### Issue: Biometric auth fails
**Solution:** Ensure permissions are granted in AndroidManifest.xml / Info.plist

### Issue: Payments redirect fails
**Solution:** Add payment gateway URLs to allowed domains

### Issue: App rejected from store
**Solution:** Ensure privacy policy is accessible and all permissions are justified

---

## 📞 Support

Need help converting your app?

- **Developer:** Harzotech
- **Email:** info@harzotech.com
- **Support:** support@alajo.ng

---

## ✅ Next Steps

1. Choose conversion method based on budget and requirements
2. Update URLs in configuration files
3. Generate app icons (all sizes)
4. Test splash screen animation
5. Build and test on devices
6. Submit to app stores
7. Launch! 🚀

---

**Good luck with your app launch!** 🎉
