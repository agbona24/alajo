# App Signing Guide for PWA Builder

When you download an app from PWA Builder, it comes **unsigned** by default. This is normal and expected. You need to sign it before distributing.

## Understanding "Unsigned" Warning

The "unsigned" message means:
- The app package (.apk or .aab) doesn't have a digital signature
- You cannot install it on most devices without developer mode
- You cannot upload it to Google Play Store
- Users will see security warnings

## How to Sign Your Android App

### Option 1: Use PWA Builder's Signing Service (Easiest)

1. **Go to PWA Builder**
   - Visit [pwabuilder.com](https://pwabuilder.com)
   - Enter your URL: `https://alajo.ng`
   - Click "Build My PWA"

2. **Generate Android Package**
   - Select "Android" platform
   - Click "Generate"
   - Choose "Google Play" option

3. **Sign with PWA Builder**
   - Click "Sign App"
   - PWA Builder will sign it for you automatically
   - Download the signed .aab file

### Option 2: Manual Signing (Full Control)

#### Step 1: Install Android SDK

```bash
# macOS (using Homebrew)
brew install --cask android-commandlinetools

# Or download from:
# https://developer.android.com/studio#command-tools
```

#### Step 2: Generate Signing Key

```bash
# Navigate to a secure location
cd ~/Documents/alajo-keys

# Generate keystore (do this ONCE and keep it safe!)
keytool -genkey -v -keystore alajo-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias alajo-key

# You'll be asked:
# - Keystore password (SAVE THIS!)
# - Your name
# - Organization name: Alajo
# - City: Lagos
# - State: Lagos
# - Country: NG
```

**CRITICAL**: Save this keystore file and password! If you lose it, you can never update your app on Play Store.

#### Step 3: Sign the APK/AAB

```bash
# If you have an .aab file from PWA Builder
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore alajo-release-key.jks \
  app-release-unsigned.aab alajo-key

# Verify the signature
jarsigner -verify -verbose -certs app-release-unsigned.aab

# Rename to signed
mv app-release-unsigned.aab alajo-signed.aab
```

#### Step 4: Optimize with zipalign (for APK only)

```bash
# If working with .apk (not needed for .aab)
zipalign -v 4 app-release-unsigned.apk alajo-signed.apk
```

### Option 3: Google Play App Signing (Recommended for Production)

1. **Upload to Play Console**
   - Go to [Google Play Console](https://play.google.com/console)
   - Create app listing
   - Upload your .aab file (can be unsigned)

2. **Enable Google Play App Signing**
   - Google Play Console → App signing
   - Enroll in app signing
   - Google will manage your signing keys

3. **Benefits**
   - Google manages the signing key
   - Automatic signing on upload
   - Key security handled by Google
   - Can recover if you lose your upload key

## PWA Builder Best Practices

### 1. Required Files Before Building

Create these files in `frontend/public/`:

**og-image.png** (1200x630)
- Social media preview image
- Shows when sharing on Facebook, Twitter, etc.

**Icon Files** (Already set up in manifest.json):
- 72x72, 96x96, 128x128, 144x144, 152x152
- 192x192, 384x384, 512x512
- All point to `/logo.png` (auto-scaled by PWA Builder)

### 2. Optional: Add Screenshots to Manifest

If you want app store screenshots in the manifest, create:
- `screenshot-mobile.png` (540x720)
- `screenshot-desktop.png` (1280x720)

Then add to manifest.json:
```json
"screenshots": [
  {
    "src": "/screenshot-mobile.png",
    "sizes": "540x720",
    "type": "image/png",
    "form_factor": "narrow"
  },
  {
    "src": "/screenshot-desktop.png",
    "sizes": "1280x720",
    "type": "image/png",
    "form_factor": "wide"
  }
]
```

### 3. PWA Builder Checklist

Before using PWA Builder:
- [ ] HTTPS enabled on https://alajo.ng
- [ ] manifest.json accessible at /manifest.json
- [ ] Service worker registered (next-pwa handles this)
- [ ] All icons exist and load correctly
- [ ] Logo.png is square (512x512 minimum)
- [ ] OG image created for social sharing
- [ ] Test PWA score with Lighthouse (should be 90+)

### 4. Test Your PWA

**Using Chrome DevTools:**
```bash
# Run your app locally
npm run dev

# Open Chrome DevTools (F12)
# Go to Application tab → Manifest
# Verify all icons load
# Check for manifest errors
```

**Using Lighthouse:**
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run PWA audit
lighthouse https://alajo.ng --only-categories=pwa --view
```

## Publishing to Google Play Store

### Step 1: Prepare App Listing

1. **Create Developer Account**
   - Go to [Google Play Console](https://play.google.com/console)
   - Pay $25 one-time registration fee
   - Complete account setup

2. **Create App**
   - Click "Create App"
   - App name: "Alajo - Digital Savings"
   - Default language: English (Nigeria)
   - App or Game: App
   - Free or Paid: Free

### Step 2: Complete Store Listing

**Required Assets:**
- App icon: 512x512 (use logo.png)
- Feature graphic: 1024x500
- Phone screenshots: 2-8 images (1080x1920)
- 7-inch tablet screenshots: 1-8 images (optional)
- 10-inch tablet screenshots: 1-8 images (optional)
- Short description: 80 characters max
- Full description: 4000 characters max
- Privacy policy URL

**Example Short Description:**
```
Save smarter with Alajo - Nigeria's digital ajo platform. Secure daily savings.
```

**Example Full Description:**
```
Alajo - Digital Savings Platform

Transform your savings with Nigeria's leading digital ajo platform. Join thousands
saving smarter with our modern, secure, and flexible contribution system.

🎯 KEY FEATURES:
• Create unlimited savings plans
• Daily, weekly, or monthly contributions
• Track your progress in real-time
• Secure transactions with bank-level encryption
• Easy withdrawals to your bank account
• 31-day Alajo cycle for consistent savings

💰 WHY ALAJO?
Traditional ajo meets modern technology. Save at your own pace, reach your goals
faster, and enjoy peace of mind with our secure platform.

🔒 SECURE & RELIABLE:
• Bank-grade encryption
• Secure authentication
• Protected transactions
• Regular security audits

📱 EASY TO USE:
• Simple registration
• Intuitive interface
• Quick contributions
• Real-time notifications

Start your savings journey today with Alajo!
```

### Step 3: Content Rating

- Complete the content rating questionnaire
- Alajo should get "Everyone" rating (finance app)
- Answer questions about:
  - Violence: None
  - Sexual content: None
  - Bad language: None
  - Drugs: None
  - Gambling: None

### Step 4: Upload App Bundle

```bash
# Upload the signed .aab file
# From Production → Releases → Create new release
```

**Version naming:**
- Version code: 1 (increment with each release)
- Version name: 1.0.0

### Step 5: Complete Release Details

**What's new in this release:**
```
Initial release of Alajo - Digital Savings Platform

Features:
• Create and manage savings plans
• Make daily, weekly, or monthly contributions
• Track your savings progress
• Secure transactions
• Easy withdrawals
• 31-day Alajo cycle

Start saving smarter today!
```

### Step 6: Review and Publish

- Review all sections for completeness
- Submit for review (takes 1-3 days)
- Google will review for policy compliance
- Once approved, app goes live!

## Common Issues and Solutions

### "App not signed" error
**Solution**: Follow signing steps above or use Google Play App Signing

### "Invalid keystore format"
**Solution**: Regenerate keystore with correct keytool command

### "Icon not found" in PWA Builder
**Solution**: Ensure logo.png exists in frontend/public/ and is accessible

### PWA Builder gives low score
**Solution**:
- Enable HTTPS
- Fix manifest errors
- Ensure service worker is registered
- Run Lighthouse audit and fix issues

### "Unable to install" on Android
**Solution**:
- Enable "Install unknown apps" in Android settings
- OR sign the app properly
- OR upload to Play Store

## Security Best Practices

### Protecting Your Signing Key

1. **Backup the keystore**
   ```bash
   # Copy to secure cloud storage
   cp alajo-release-key.jks ~/Google\ Drive/alajo-keys/

   # Also backup locally on external drive
   cp alajo-release-key.jks /Volumes/ExternalDrive/backup/
   ```

2. **Document the password**
   - Store in password manager (1Password, LastPass, etc.)
   - Share with trusted team members securely
   - Never commit to git repository

3. **Use environment variables**
   ```bash
   # For CI/CD builds
   export KEYSTORE_PASSWORD="your-password"
   export KEY_ALIAS="alajo-key"
   ```

## Resources

- [PWA Builder Documentation](https://docs.pwabuilder.com/)
- [Android App Signing](https://developer.android.com/studio/publish/app-signing)
- [Google Play Console](https://play.google.com/console)
- [PWA Manifest Validator](https://manifest-validator.appspot.com/)
- [Lighthouse PWA Audit](https://web.dev/lighthouse-pwa/)

---

## Quick Reference Commands

```bash
# Generate keystore
keytool -genkey -v -keystore alajo-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias alajo-key

# Sign AAB
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore alajo-release-key.jks app.aab alajo-key

# Verify signature
jarsigner -verify -verbose -certs app.aab

# Test PWA
lighthouse https://alajo.ng --only-categories=pwa --view
```

---

**Need Help?**
- Check manifest at: https://alajo.ng/manifest.json
- Test PWA: Chrome DevTools → Application → Manifest
- Validate: https://manifest-validator.appspot.com/
