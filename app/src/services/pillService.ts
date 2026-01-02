import api from './api';
import { Pill, PillSchedule } from '../types';

export const pillService = {
  // [수정 1] 이름 검색 (주소: /search, 파라미터: keyword)
  async searchByName(keyword: string): Promise<Pill[]> {
    // 백엔드 SearchController: @GetMapping("/api/search")
    const response = await api.get(`/search?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
  },

  // [수정 2] 증상 검색 (주소: /search/symptom, 파라미터: keyword)
  async searchBySymptom(keyword: string): Promise<Pill[]> {
    // 백엔드 SearchController: @GetMapping("/api/search/symptom")
    const response = await api.get(`/search/symptom?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
  },

  // [수정 3] 약 상세 조회 (ID 타입: string, 주소: /search/{id})
  async getPillDetail(itemSeq: string): Promise<Pill> {
    const response = await api.get(`/search/${itemSeq}`);
    return response.data;
  },

  // [유지] 내 약통 목록 조회
  async getMyPills(): Promise<Pill[]> {
    const response = await api.get('/pills/my');
    return response.data;
  },

  // [수정 4] 내 약통 추가 (ID 타입: string)
  async addPill(itemSeq: string): Promise<void> {
    // 백엔드 PillController: @PostMapping("/api/pills/my/{itemSeq}")
    await api.post(`/pills/my/${itemSeq}`);
  },

  // [수정 5] 내 약통 삭제 (ID 타입: string)
  async removePill(itemSeq: string): Promise<void> {
    // 백엔드 PillController: @DeleteMapping("/api/pills/my/{itemSeq}")
    await api.delete(`/pills/my/${itemSeq}`);
  },

  // [유지] 오늘의 일정 (일정 ID는 여전히 Long/number 타입이므로 유지)
  async getTodaySchedule(): Promise<PillSchedule[]> {
    const response = await api.get('/schedule/today');
    return response.data;
  },

  // [유지] 복용 완료 체크 (스케줄 ID는 number)
  async markAsTaken(scheduleId: number): Promise<void> {
    await api.put(`/schedule/${scheduleId}/taken`);
  },

  // [유지] 처방전 업로드
  async uploadPrescription(imageUri: string): Promise<Pill[]> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'prescription.jpg',
    } as any);

    const response = await api.post('/pills/prescription', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};