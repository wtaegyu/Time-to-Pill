import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

WebBrowser.maybeCompleteAuthSession();

// Google OAuth Client IDs
// Get these from Google Cloud Console: https://console.cloud.google.com/
const GOOGLE_CLIENT_ID = {
  android: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  web: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
};

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_CLIENT_ID.android,
    webClientId: GOOGLE_CLIENT_ID.web,
  });

  return { request, response, promptAsync };
};

export const googleAuthService = {
  async handleGoogleLogin(accessToken: string): Promise<boolean> {
    try {
      // Get user info from Google
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const userInfo = await userInfoResponse.json();

      // Send to backend for login/register
      const response = await api.post('/auth/google', {
        email: userInfo.email,
        name: userInfo.name,
        googleId: userInfo.id,
      });

      // Save token and user info
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  },
};
