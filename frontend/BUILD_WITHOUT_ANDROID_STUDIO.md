# 📱 Build APK Without Android Studio

## Option 1: Android SDK Command Line Tools (Free)

### Step 1: Install Android SDK

**On Mac:**
```bash
# Install via Homebrew
brew install --cask android-commandlinetools

# Or download from:
# https://developer.android.com/studio#command-tools
```

**On Linux:**
```bash
# Download command line tools
wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip
unzip commandlinetools-linux-9477386_latest.zip -d ~/android-sdk
```

### Step 2: Set Environment Variables

Add to `~/.zshrc` or `~/.bashrc`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/build-tools/34.0.0
```

Reload:
```bash
source ~/.zshrc  # or source ~/.bashrc
```

### Step 3: Install SDK Components

```bash
# Accept licenses
sdkmanager --licenses

# Install required packages
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

### Step 4: Build APK

```bash
cd /Users/user/alajo/frontend/android
./gradlew assembleDebug

# APK will be at:
# app/build/outputs/apk/debug/app-debug.apk
```

**Build time:** 3-5 minutes

---

## Option 2: GitHub Actions (Cloud Build - Free!)

Build APK automatically in the cloud when you push code.

### Setup (One-time):

1. **Create workflow file:**

```bash
mkdir -p .github/workflows
```

2. **Create:** `.github/workflows/build-apk.yml`

```yaml
name: Build Android APK

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'

    - name: Setup Android SDK
      uses: android-actions/setup-android@v2

    - name: Install dependencies
      working-directory: frontend
      run: |
        npm install
        npx cap sync android

    - name: Build APK
      working-directory: frontend/android
      run: ./gradlew assembleDebug

    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: alajo-debug-apk
        path: frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

3. **Push to GitHub:**
```bash
git add .
git commit -m "Add APK build workflow"
git push
```

4. **Download APK:**
- Go to GitHub → Actions tab
- Click latest workflow run
- Download APK from Artifacts

---

## Option 3: EAS Build (Expo) - Cloud Build

Free tier available!

### Setup:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build APK
eas build --platform android --profile preview
```

APK downloads automatically when done!

---

## Option 4: Online Services (Paid but Easy)

### A. Gonative.io ($99/month or $29 trial)
- URL: https://gonative.io
- No code needed
- APK in 5 minutes
- Best for quick testing

### B. WebViewGold ($199 one-time)
- URL: https://webviewgold.com
- Desktop app
- Unlimited builds
- One-time payment

### C. AppGyver (Free tier available)
- URL: https://www.appgyver.com
- Visual builder
- Free for basic apps

---

## Comparison:

| Method | Cost | Time | Difficulty |
|--------|------|------|------------|
| **Gonative** | $29-99 | 5 min | ⭐ Easy |
| **WebViewGold** | $199 | 10 min | ⭐ Easy |
| **GitHub Actions** | Free | 10 min | ⭐⭐ Medium |
| **Android SDK** | Free | 30 min setup | ⭐⭐⭐ Hard |
| **EAS Build** | Free tier | 15 min | ⭐⭐ Medium |

---

## Recommended for You:

### If you want **FREE:**
→ Use **GitHub Actions** (cloud build, no setup)

### If you want **FAST:**
→ Use **Gonative** ($29 trial) - 5 minutes total

### If you want **ONE-TIME COST:**
→ Use **WebViewGold** ($199) - unlimited builds

---

## Quick Setup: GitHub Actions (Recommended)

1. **Create file:** `.github/workflows/build-apk.yml`
2. **Copy workflow** (from above)
3. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add APK build"
   git push
   ```
4. **Wait 5-10 minutes**
5. **Download APK** from GitHub Actions → Artifacts

**Bonus:** APK rebuilds automatically on every push! 🚀

---

## Already Have Capacitor Setup?

You're ready! Just choose a method above and build.

Your config files are ready:
- ✅ `capacitor.config.ts`
- ✅ `android/` folder
- ✅ All plugins installed

---

## Need Help?

- **Android SDK Guide:** https://developer.android.com/studio/command-line
- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **GitHub Actions Docs:** https://docs.github.com/en/actions

---

🎯 **Best Choice:** GitHub Actions (free, no setup, automatic builds!)
