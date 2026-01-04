// User types
export interface User {
  id: number;
  username: string;
  nickname: string;
  age: number;
  gender: 'M' | 'F';
}

// Backend API response types (DrugSearchDto)
export interface DrugSearchDto {
  itemSeq: string;
  itemName: string;
  entpName: string;
  efficacy: string;
  useMethod: string;
  precautionData: string;
  itemImage: string | null;
  durInfoList: DurInfo[];
}

export interface DurInfo {
  id: number;
  itemCode: string;
  durType: string;
  durTypeName: string;
  durInfo: string;
}

// Pill types (UI용, DrugSearchDto에서 변환)
export interface Pill {
  itemSeq: string;
  name: string;
  entpName: string;
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

// 복용 빈도
export type Frequency = 'DAILY' | 'EVERY_OTHER_DAY' | 'EVERY_3_DAYS' | 'WEEKLY' | 'CUSTOM';

// 복용 시간대
export type TimeSlot = 'MORNING' | 'AFTERNOON' | 'EVENING';

// 약 등록 요청 (스케줄 포함)
export interface PillScheduleRequest {
  itemSeq: string;
  startDate: string;       // YYYY-MM-DD
  endDate?: string;        // YYYY-MM-DD (선택, null이면 무기한)
  frequency: Frequency;
  customDays?: string[];   // CUSTOM일 때: ['MON', 'WED', 'FRI']
  timeSlots: TimeSlot[];   // ['MORNING', 'EVENING']
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
