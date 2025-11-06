// Firebase Configuration Template
// Copy this file to firebase.config.js and replace with your actual Firebase configuration

export const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:android:your-app-id"
};

// How to get these values:
// 1. Go to Firebase Console (https://console.firebase.google.com/)
// 2. Create a new project or select existing one
// 3. Go to Project Settings
// 4. Add an Android app (and iOS if needed)
// 5. Download google-services.json for Android
// 6. Download GoogleService-Info.plist for iOS
// 7. Copy the configuration values above