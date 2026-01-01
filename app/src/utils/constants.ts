// API endpoint constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    CHECK_NICKNAME: '/auth/check-nickname',
  },
  PILLS: {
    SEARCH: '/pills/search',
    SEARCH_SYMPTOM: '/pills/search/symptom',
    DETAIL: (id: number) => `/pills/${id}`,
    MY: '/pills/my',
    ADD: (pillId: number) => `/pills/my/${pillId}`,
    REMOVE: (pillId: number) => `/pills/my/${pillId}`,
    PRESCRIPTION: '/pills/prescription',
  },
  SCHEDULE: {
    TODAY: '/schedule/today',
    MARK_TAKEN: (id: number) => `/schedule/${id}/taken`,
  },
} as const;

// Schedule time constants
export const SCHEDULE_TIME = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  EVENING: 'evening',
} as const;

// Warning type constants
export const WARNING_TYPE = {
  DROWSINESS: 'drowsiness',
  INTERACTION: 'interaction',
  PREGNANCY: 'pregnancy',
  ALCOHOL: 'alcohol',
} as const;

// Gender constants
export const GENDER = {
  MALE: 'M',
  FEMALE: 'F',
} as const;

// Storage key constants
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
} as const;

// Warning type labels
export const WARNING_LABELS: Record<string, string> = {
  [WARNING_TYPE.DROWSINESS]: 'May cause drowsiness',
  [WARNING_TYPE.INTERACTION]: 'Drug interaction',
  [WARNING_TYPE.PREGNANCY]: 'Pregnancy warning',
  [WARNING_TYPE.ALCOHOL]: 'Avoid alcohol',
};

// Schedule time labels
export const SCHEDULE_TIME_LABELS: Record<string, string> = {
  [SCHEDULE_TIME.MORNING]: 'Morning',
  [SCHEDULE_TIME.AFTERNOON]: 'Afternoon',
  [SCHEDULE_TIME.EVENING]: 'Evening',
};
