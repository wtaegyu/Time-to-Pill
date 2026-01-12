import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
// RegisterRequest는 types.ts에 name, email이 없더라도 아래 register 함수에서 확장해서 처리하도록 합니다.
import { LoginRequest, RegisterRequest, AuthResponse, User, GoogleLinkRequest } from '../types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  // ✨ [수정됨] RegisterRequest 타입에 name과 email을 강제로 포함시킵니다.
  // 이렇게 하면 types.ts를 수정하지 않아도 RegisterScreen에서 에러가 사라집니다.
  async register(data: RegisterRequest & { name: string; email: string }): Promise<AuthResponse> {
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

  // ✨ [아이디 찾기] 기존 코드를 메서드 형태로 통일
  async findId(name: string, email: string) {
    const response = await api.post('/auth/find-id', { name, email });
    return response.data;
  },

  // ✨ [비밀번호 찾기] 기존 코드를 메서드 형태로 통일
  async findPassword(username: string, name: string, email: string) {
    const response = await api.post('/auth/reset-password', { username, name, email });
    return response.data;
  }
};