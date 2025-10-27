# Build Information

This document contains information about building and deploying the My Todo App for production.

## 📱 Build Overview

My Todo App is built using Expo, which supports multiple build targets:
- **Android APK/AAB**
- **iOS IPA**
- **Web Bundle**

## 🛠️ Build Requirements

### Prerequisites
- **Node.js** >= 18.0
- **npm** or **yarn**
- **Expo CLI** installed globally or via npx
- **EAS CLI** for production builds (optional)
- **Expo Account** (free tier available)

### For Android Builds
- No additional requirements when using EAS Build
- For local builds: Android Studio and Android SDK

### For iOS Builds
- **macOS** required for local builds
- **Xcode** (latest version recommended)
- **Apple Developer Account** ($99/year)

## 🚀 Build Commands

### Development Build (Local Testing)

#### Start Development Server
```bash
npm start
# or
npx expo start
```

#### Run on Android Emulator
```bash
npx expo start --android
```

#### Run on iOS Simulator (macOS only)
```bash
npx expo start --ios
```

#### Run on Web Browser
```bash
npx expo start --web
```

### Production Build

#### Using EAS Build (Recommended)

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Configure the project:**
   ```bash
   eas build:configure
   ```

4. **Build for Android:**
   ```bash
   # APK (for testing)
   eas build --platform android --profile preview
   
   # AAB (for Google Play Store)
   eas build --platform android --profile production
   ```

5. **Build for iOS:**
   ```bash
   # Simulator build (for testing)
   eas build --platform ios --profile preview
   
   # App Store build (for production)
   eas build --platform ios --profile production
   ```

#### Using Classic Expo Build

```bash
# Android
expo build:android -t apk

# iOS
expo build:ios -t archive
```

### Web Build

```bash
# Build web bundle
npx expo export:web

# The output will be in the 'web-build' directory
```

## 📦 Build Configurations

### Development Build
- Debug mode enabled
- Hot reload active
- Development warnings visible
- Larger bundle size

### Production Build
- Optimized and minified code
- Debug mode disabled
- Smaller bundle size
- Performance optimized

## 🔧 Configuration Files

### app.json
Contains app configuration including:
- App name and slug
- Version number
- Bundle identifier
- Icon and splash screen
- Platform-specific settings

### package.json
Contains dependencies and build scripts.

## 📊 Build Output

### Android
- **APK**: Standalone Android Package (~20-40 MB)
- **AAB**: Android App Bundle (for Play Store, ~15-30 MB)
- Location: Downloads via EAS or `android/app/build/outputs/`

### iOS
- **IPA**: iOS App Archive (~30-50 MB)
- Location: Downloads via EAS or Xcode organizer

### Web
- **Static Files**: HTML, CSS, JS bundles
- Location: `web-build/` directory
- Ready to deploy to any static hosting service

## 🧪 Testing Builds

### Android APK Testing
1. Download APK from EAS or build output
2. Transfer to Android device
3. Enable "Install from Unknown Sources"
4. Install and test

### iOS TestFlight
1. Build with production profile
2. Upload to App Store Connect
3. Add internal/external testers
4. Distribute via TestFlight

### Web Testing
1. Build web bundle
2. Serve locally:
   ```bash
   npx serve web-build
   ```
3. Open in browser to test

## 🌐 Deployment

### Android - Google Play Store
1. Build AAB with production profile
2. Create Google Play Developer account ($25 one-time)
3. Upload to Play Console
4. Fill in store listing details
5. Submit for review

### iOS - App Store
1. Build IPA with production profile
2. Upload to App Store Connect
3. Fill in app information and screenshots
4. Submit for review
5. Review typically takes 1-3 days

### Web - Static Hosting
Deploy to any of these services:
- **Netlify**: `netlify deploy --dir=web-build`
- **Vercel**: `vercel --prod`
- **GitHub Pages**: Push web-build to gh-pages branch
- **Firebase Hosting**: `firebase deploy`

## 🔐 Environment Configuration

### API URL Configuration

For production builds, update the API URL in `App.js`:

```javascript
// Development
const API_URL = 'http://localhost:3000/todos';

// Production - replace with your deployed API
const API_URL = 'https://your-api-domain.com/todos';
```

### Android-specific
For Android emulator, use:
```javascript
const API_URL = 'http://10.0.2.2:3000/todos';
```

## 📋 Pre-Build Checklist

Before building for production:
- [ ] Update version number in `app.json`
- [ ] Update API_URL to production endpoint
- [ ] Test all features thoroughly
- [ ] Check for console errors
- [ ] Optimize images and assets
- [ ] Update app icons and splash screen
- [ ] Review and update app permissions
- [ ] Test on multiple devices/emulators
- [ ] Update README.md if needed
- [ ] Update CHANGELOG.md with new version

## 🐛 Common Build Issues

### Issue: "Unable to resolve module"
**Solution**: Clear cache and reinstall
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### Issue: "Build failed with EAS"
**Solution**: Check EAS build logs
```bash
eas build:list
# Click on build to see detailed logs
```

### Issue: "Network request failed"
**Solution**: Check API URL and CORS configuration

### Issue: "App crashes on startup"
**Solution**: Check error logs
```bash
# Android
adb logcat

# iOS
Xcode Console
```

## 📈 Build History

### Version 1.0.0 (2025-10-27)
- Initial release
- Complete CRUD functionality
- REST API integration
- Clean UI with task management

## 🔄 Continuous Integration

For automated builds, consider setting up:
- **GitHub Actions** for EAS Build
- **Bitrise** for mobile CI/CD
- **CircleCI** for automated testing and builds

Example GitHub Actions workflow:
```yaml
name: EAS Build
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: expo/expo-github-action@v7
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform android --non-interactive
```

## 📞 Support

For build-related issues:
- Check [Expo Documentation](https://docs.expo.dev/)
- Visit [Expo Forums](https://forums.expo.dev/)
- Check [GitHub Issues](https://github.com/mohammadfirmansyah/myTodoApp/issues)

---

**Developer:** Mohammad Firman Syah  
**Last Updated:** 2025-10-27
