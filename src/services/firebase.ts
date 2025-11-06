import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import { Task, User } from '../types';

export class FirebaseService {
  
  static async signUp(email: string, password: string): Promise<User> {
    try {
      const credential = await auth().createUserWithEmailAndPassword(email, password);
      return {
        uid: credential.user.uid,
        email: credential.user.email!,
        displayName: credential.user.displayName || undefined,
        photoURL: credential.user.photoURL || undefined,
      };
    } catch (error) {
      throw new Error(`Sign up failed: ${error}`);
    }
  }

  static async signIn(email: string, password: string): Promise<User> {
    try {
      const credential = await auth().signInWithEmailAndPassword(email, password);
      return {
        uid: credential.user.uid,
        email: credential.user.email!,
        displayName: credential.user.displayName || undefined,
        photoURL: credential.user.photoURL || undefined,
      };
    } catch (error) {
      throw new Error(`Sign in failed: ${error}`);
    }
  }

  static async signOut(): Promise<void> {
    try {
      await auth().signOut();
    } catch (error) {
      throw new Error(`Sign out failed: ${error}`);
    }
  }

  static async resetPassword(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      throw new Error(`Password reset failed: ${error}`);
    }
  }

  static getCurrentUser(): User | null {
    const user = auth().currentUser;
    if (!user) return null;
    
    return {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || undefined,
      photoURL: user.photoURL || undefined,
    };
  }

  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return auth().onAuthStateChanged((user) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || undefined,
          photoURL: user.photoURL || undefined,
        });
      } else {
        callback(null);
      }
    });
  }

  static async requestNotificationPermission(): Promise<boolean> {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      return enabled;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  static async getFCMToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  }

  static onTokenRefresh(callback: (token: string) => void): () => void {
    return messaging().onTokenRefresh(callback);
  }

  static onNotificationReceived(callback: (notification: any) => void): () => void {
    return messaging().onMessage(callback);
  }

  static setBackgroundMessageHandler(handler: (message: any) => Promise<void>): void {
    messaging().setBackgroundMessageHandler(handler);
  }
}