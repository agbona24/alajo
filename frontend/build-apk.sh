#!/bin/bash

# Alajo APK Builder Script
# This script automates building the Android APK

set -e  # Exit on error

echo "🚀 Alajo APK Builder"
echo "===================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Android SDK is installed
if [ -z "$ANDROID_HOME" ]; then
    echo -e "${RED}❌ Error: ANDROID_HOME not set${NC}"
    echo "Please install Android Studio and set ANDROID_HOME"
    echo "Example: export ANDROID_HOME=\$HOME/Library/Android/sdk"
    exit 1
fi

echo -e "${BLUE}📦 Current Configuration:${NC}"
echo "  App ID: com.alajo.app"
echo "  App Name: Alajo"
echo "  Version: 1.0.0"
echo ""

# Ask for build type
echo -e "${YELLOW}Select build type:${NC}"
echo "  1) Debug APK (for testing)"
echo "  2) Release APK (for production)"
read -p "Enter choice [1-2]: " build_type

# Navigate to android directory
cd android

if [ "$build_type" = "1" ]; then
    echo -e "${BLUE}🔨 Building Debug APK...${NC}"
    ./gradlew clean assembleDebug

    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"

    if [ -f "$APK_PATH" ]; then
        echo ""
        echo -e "${GREEN}✅ Success! APK built successfully${NC}"
        echo ""
        echo -e "${BLUE}📍 APK Location:${NC}"
        echo "  $(pwd)/$APK_PATH"
        echo ""
        echo -e "${BLUE}📲 To install on device:${NC}"
        echo "  adb install $APK_PATH"
        echo ""

        # Copy to root directory for easy access
        cp "$APK_PATH" ../alajo-debug.apk
        echo -e "${GREEN}✅ Copied to: $(pwd)/../alajo-debug.apk${NC}"
    else
        echo -e "${RED}❌ Build failed - APK not found${NC}"
        exit 1
    fi

elif [ "$build_type" = "2" ]; then
    echo -e "${BLUE}🔨 Building Release APK...${NC}"
    ./gradlew clean assembleRelease

    APK_PATH="app/build/outputs/apk/release/app-release-unsigned.apk"

    if [ -f "$APK_PATH" ]; then
        echo ""
        echo -e "${GREEN}✅ Success! Release APK built successfully${NC}"
        echo ""
        echo -e "${YELLOW}⚠️  Note: APK is UNSIGNED${NC}"
        echo "  You need to sign it before uploading to Play Store"
        echo ""
        echo -e "${BLUE}📍 APK Location:${NC}"
        echo "  $(pwd)/$APK_PATH"
        echo ""

        # Copy to root directory
        cp "$APK_PATH" ../alajo-release-unsigned.apk
        echo -e "${GREEN}✅ Copied to: $(pwd)/../alajo-release-unsigned.apk${NC}"
        echo ""
        echo -e "${BLUE}🔐 To sign the APK:${NC}"
        echo "  1. Generate keystore: keytool -genkey -v -keystore alajo.keystore -alias alajo -keyalg RSA -keysize 2048 -validity 10000"
        echo "  2. Sign APK: jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore alajo.keystore app-release-unsigned.apk alajo"
        echo "  3. Align APK: zipalign -v 4 app-release-unsigned.apk alajo-release.apk"
    else
        echo -e "${RED}❌ Build failed - APK not found${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Invalid choice${NC}"
    exit 1
fi

# Check if device is connected
echo ""
echo -e "${BLUE}📱 Checking for connected devices...${NC}"
if command -v adb &> /dev/null; then
    DEVICES=$(adb devices | grep -v "List" | grep "device" | wc -l)
    if [ "$DEVICES" -gt 0 ]; then
        echo -e "${GREEN}✅ Found $DEVICES connected device(s)${NC}"
        echo ""
        read -p "Install APK on device now? [y/N]: " install_now
        if [ "$install_now" = "y" ] || [ "$install_now" = "Y" ]; then
            cd ..
            if [ "$build_type" = "1" ]; then
                adb install -r alajo-debug.apk
            else
                adb install -r alajo-release-unsigned.apk
            fi
            echo -e "${GREEN}✅ APK installed successfully!${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  No devices connected${NC}"
        echo "Connect your device via USB and enable USB debugging"
    fi
else
    echo -e "${YELLOW}⚠️  ADB not found in PATH${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Build complete!${NC}"
echo ""
