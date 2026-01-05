import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginRequest, RegisterRequest, AuthResponse, User, GoogleLinkRequest } from '../types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

  async getCurrentUser(): Promise<User | null> {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async isLoggedIn(): Promise<boolean> {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },

  async checkNickname(nickname: string): Promise<boolean> {
    const response = await api.get(`/auth/check-nickname?nickname=${nickname}`);
    return response.data.available;
  },

  async updateProfile(data: { nickname?: string; age?: number; gender?: string }): Promise<User> {
    const response = await api.put<User>('/auth/profile', data);
    // 로컬 스토리지의 user 정보도 업데이트
    await AsyncStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const response = await api.put('/auth/password', { currentPassword, newPassword });
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    await AsyncStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  async linkGoogle(data: GoogleLinkRequest): Promise<User> {
    const response = await api.post<User>('/auth/link-google', data);
    await AsyncStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  async unlinkGoogle(): Promise<User> {
    const response = await api.delete<User>('/auth/unlink-google');
    await AsyncStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  async googleLogin(email: string, name: string, googleId: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/google', {
      email,
      name,
      googleId,
    });
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },
};
