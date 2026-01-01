// User types
export interface User {
  id: number;
  username: string;
  nickname: string;
  age: number;
  gender: 'M' | 'F';
}

// Pill types
export interface Pill {
  id: number;
  name: string;
  description: string;
  dosage: string;
  warnings: PillWarning[];
  imageUrl?: string;
}

export interface PillWarning {
  type: 'drowsiness' | 'interaction' | 'pregnancy' | 'alcohol';
  message: string;
}

// Schedule types
export interface PillSchedule {
  id: number;
  pillId: number;
  pill: Pill;
  time: 'morning' | 'afternoon' | 'evening';
  taken: boolean;
  date: string;
}

// Pill status for UI
export type PillStatus = 'ok' | 'warn' | 'danger';

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  nickname: string;
  password: string;
  age: number;
  gender: 'M' | 'F';
}

export interface AuthResponse {
  token: string;
  user: User;
}
