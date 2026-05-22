# TaskManager App

A cross-platform Task Management App built with React Native and Expo.

---

## Requirements

Before cloning and running this project, make sure you have the following installed:

### 1. Node.js (v18 or higher)
Download from: https://nodejs.org
```bash
# Verify installation
node --version
npm --version
```

### 2. Git
Download from: https://git-scm.com
```bash
# Verify installation
git --version
```

### 3. Expo CLI
```bash
npm install -g expo-cli
```

### 4. Expo Go (optional, for quick testing without a build)
- iOS: Download **Expo Go** from App Store
- Android: Download **Expo Go** from Play Store

> **Note:** React, TypeScript, and all other project dependencies are installed automatically when you run `npm install` — no separate installation needed.

### 4. Java 17 (Android only)
Download from: https://adoptium.net (select Temurin 17)

Or install via Homebrew on Mac:
```bash
brew install --cask temurin@17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
source ~/.zshrc
```
```bash
# Verify installation
java -version  # must show 17.x.x
```

### 5. Android Studio (Android only)
Download from: https://developer.android.com/studio

After installing:
- Open Android Studio → SDK Manager → Install Android SDK
- Set ANDROID_HOME:
```bash
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
source ~/.zshrc
```

### 6. Xcode (iOS only, Mac only)
- Download from Mac App Store
- Install Command Line Tools:
```bash
xcode-select --install
```
- Install CocoaPods:
```bash
sudo gem install cocoapods
```

### 7. Firebase CLI (for deploying Cloud Functions)
```bash
sudo npm install -g firebase-tools
firebase login
```

### 8. EAS CLI (for production builds)
```bash
npm install -g eas-cli
eas login
```

### 9. Firebase Project
- Create a project at https://console.firebase.google.com
- Enable **Email/Password** Authentication
- Create a **Firestore** database in test mode
- Register a Web app and copy the config keys

---

## Getting Started

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd TaskManagerApp
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment files

Create `.env.dev` in project root:
```
ENV=development
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

Create `.env.staging`:
```
ENV=staging
FIREBASE_API_KEY=your_staging_key
FIREBASE_AUTH_DOMAIN=your_staging_auth_domain
FIREBASE_PROJECT_ID=your_staging_project_id
FIREBASE_STORAGE_BUCKET=your_staging_bucket
FIREBASE_MESSAGING_SENDER_ID=your_staging_sender_id
FIREBASE_APP_ID=your_staging_app_id
```

Create `.env.production`:
```
ENV=production
FIREBASE_API_KEY=your_production_key
FIREBASE_AUTH_DOMAIN=your_production_auth_domain
FIREBASE_PROJECT_ID=your_production_project_id
FIREBASE_STORAGE_BUCKET=your_production_bucket
FIREBASE_MESSAGING_SENDER_ID=your_production_sender_id
FIREBASE_APP_ID=your_production_app_id
```

### 4. First time build

**Android:**
```bash
ENVFILE=.env.dev npx expo run:android
```

**iOS:**
```bash
ENVFILE=.env.dev npx expo run:ios
```

### 5. After first build (daily development)
```bash
ENVFILE=.env.dev npx expo start --clear
# Press 'a' for Android, 'i' for iOS
```

---

## How to Run in Each Environment

### Development
```bash
ENVFILE=.env.dev npx expo start --clear
```

### Staging
```bash
ENVFILE=.env.staging npx expo start --clear
```

### Production
```bash
# Build for production using EAS
npm install -g eas-cli
eas login
eas build --platform android --profile production
eas build --platform ios --profile production
```

---

## Architecture Choice

The app follows a **feature-based modular architecture** with clear separation of concerns:

- **Redux Toolkit** manages all global state, split into `auth` and `tasks` slices. Each feature owns its slice, thunks, and types — making it easy to scale independently.
- **Offline-first design** — every write goes to SQLite first, then syncs to Firestore when online. A `synced` flag on each task tracks what's pending upload.
- **NetInfo listener** automatically triggers sync of pending tasks the moment connectivity is restored — no manual retry needed.
- **Firebase Auth** session is persisted via `redux-persist` and AsyncStorage so users stay logged in between app restarts.
- **React Navigation** uses two separate stacks (AuthStack / AppStack) that swap based on Firebase `onAuthStateChanged` — this is the correct pattern vs conditional rendering.
- **Lazy-loaded screens** — all screens are loaded using `React.lazy()` and `Suspense` to reduce initial bundle size and improve startup performance.
- **FCM Server Push** — Firebase Cloud Functions trigger push notifications automatically when tasks are created or completed via Firestore triggers.

---

## Libraries Used

| Purpose | Library |
|---|---|
| Framework | Expo SDK 53 |
| Navigation | @react-navigation/native, @react-navigation/stack |
| State Management | @reduxjs/toolkit, react-redux |
| State Persistence | redux-persist |
| Authentication | firebase/auth |
| Remote Database | firebase/firestore |
| Local Database | expo-sqlite |
| Offline Detection | @react-native-community/netinfo |
| Session Persistence | @react-native-async-storage/async-storage |
| Notifications | expo-notifications |
| Environment Config | react-native-dotenv |
| Unique IDs | react-native-uuid |
| Gesture Handling | react-native-gesture-handler, react-native-reanimated |
| Server Push | Firebase Cloud Functions + FCM |

---

## Features

- ✅ Email/Password Authentication with session persistence
- ✅ Add, edit, delete and complete tasks
- ✅ Offline-first with SQLite local storage
- ✅ Auto sync to Firestore when back online
- ✅ Local push notifications with task reminders
- ✅ Server push notifications via Firebase Cloud Functions + FCM
- ✅ Dark/Light mode support
- ✅ Multi-environment config (dev/staging/production)
- ✅ Redux Toolkit state management
- ✅ FlatList performance optimizations
- ✅ Lazy loaded screens

---

## Known Limitations

- **iOS Push Notifications** — Push notifications on iOS require a paid Apple Developer account ($99/year). Local notifications work on iOS. Remote push notifications are fully demonstrated on Android via FCM and Firebase Cloud Functions.
- **Android notifications in Expo Go** — Remote push notifications (FCM) are not supported in Expo Go from SDK 53+. A development build (`npx expo run:android`) is required for full notification support on Android.
- **Single Firebase project** — All three environments share the same Firebase project for simplicity. In a real production app, each environment should have its own isolated Firebase project.
- **Conflict resolution** — Offline sync uses last-write-wins. If the same task is edited on two devices while offline, the last one to sync will overwrite the other. A proper solution would use CRDTs or server-side timestamps with merge logic.
- **No pagination** — The task list loads all tasks at once. For large datasets, cursor-based Firestore pagination would be needed.
- **No biometric auth** — Authentication is limited to email/password. Face ID / fingerprint login would be a production enhancement.
- **Project path** — The project path must not contain spaces due to a React Native CocoaPods limitation on iOS builds.
