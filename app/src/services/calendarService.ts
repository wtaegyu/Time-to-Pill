import { GoogleSignin } from '@react-native-google-signin/google-signin';

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

export interface PillScheduleForCalendar {
  pillName: string;
  time: 'morning' | 'afternoon' | 'evening';
  date: string; // YYYY-MM-DD
}

const TIME_MAPPING = {
  morning: { hour: 8, minute: 0 },
  afternoon: { hour: 12, minute: 0 },
  evening: { hour: 19, minute: 0 },
};

const TIME_LABELS = {
  morning: '아침',
  afternoon: '점심',
  evening: '저녁',
};

export const calendarService = {
  // 구글 캘린더 접근 토큰 가져오기
  async getAccessToken(): Promise<string | null> {
    try {
      const tokens = await GoogleSignin.getTokens();
      return tokens.accessToken;
    } catch (error) {
      console.log('토큰 가져오기 실패:', error);
      return null;
    }
  },

  // 캘린더 목록 가져오기 (primary 캘린더 사용)
  async getCalendarList(): Promise<any[]> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) return [];

    try {
      const response = await fetch(`${GOOGLE_CALENDAR_API}/users/me/calendarList`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.log('캘린더 목록 가져오기 실패:', error);
      return [];
    }
  },

  // 복약 스케줄을 구글 캘린더에 추가
  async addPillToCalendar(schedule: PillScheduleForCalendar): Promise<CalendarEvent | null> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      throw new Error('구글 로그인이 필요합니다');
    }

    const timeInfo = TIME_MAPPING[schedule.time];
    const startDate = new Date(schedule.date);
    startDate.setHours(timeInfo.hour, timeInfo.minute, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 30); // 30분 이벤트

    const event: CalendarEvent = {
      summary: `💊 ${schedule.pillName} (${TIME_LABELS[schedule.time]})`,
      description: `TimeToPill 복약 알림\n약: ${schedule.pillName}\n시간대: ${TIME_LABELS[schedule.time]}`,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'Asia/Seoul',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'Asia/Seoul',
      },
    };

    try {
      const response = await fetch(`${GOOGLE_CALENDAR_API}/calendars/primary/events`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error('이벤트 생성 실패');
      }

      return await response.json();
    } catch (error) {
      console.log('캘린더 이벤트 추가 실패:', error);
      throw error;
    }
  },

  // 구글 캘린더에서 특정 월의 이벤트 가져오기
  async getEventsForMonth(year: number, month: number): Promise<CalendarEvent[]> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) return [];

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59);

    try {
      const params = new URLSearchParams({
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: 'true',
        orderBy: 'startTime',
        q: 'TimeToPill', // TimeToPill 관련 이벤트만 검색
      });

      const response = await fetch(
        `${GOOGLE_CALENDAR_API}/calendars/primary/events?${params}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('이벤트 가져오기 실패');
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.log('캘린더 이벤트 가져오기 실패:', error);
      return [];
    }
  },

  // 구글 캘린더에서 이벤트 삭제
  async removeEventFromCalendar(eventId: string): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) return false;

    try {
      const response = await fetch(
        `${GOOGLE_CALENDAR_API}/calendars/primary/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.ok;
    } catch (error) {
      console.log('이벤트 삭제 실패:', error);
      return false;
    }
  },

  // 복약 스케줄 여러 개를 한번에 동기화
  async syncSchedulesToCalendar(schedules: PillScheduleForCalendar[]): Promise<number> {
    let successCount = 0;

    for (const schedule of schedules) {
      try {
        await this.addPillToCalendar(schedule);
        successCount++;
      } catch (error) {
        console.log(`동기화 실패: ${schedule.pillName}`, error);
      }
    }

    return successCount;
  },
};
