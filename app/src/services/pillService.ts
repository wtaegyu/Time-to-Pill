import api from './api';
import { Pill, PillSchedule } from '../types';

export const pillService = {
  // Search pills by name
  async searchByName(name: string): Promise<Pill[]> {
    const response = await api.get(`/pills/search?name=${encodeURIComponent(name)}`);
    return response.data;
  },

  // Search pills by symptom
  async searchBySymptom(symptom: string): Promise<Pill[]> {
    const response = await api.get(`/pills/search/symptom?symptom=${encodeURIComponent(symptom)}`);
    return response.data;
  },

  // Get pill details
  async getPillDetail(id: number): Promise<Pill> {
    const response = await api.get(`/pills/${id}`);
    return response.data;
  },

  // Get user's pill list
  async getMyPills(): Promise<Pill[]> {
    const response = await api.get('/pills/my');
    return response.data;
  },

  // Add pill to user's list
  async addPill(pillId: number): Promise<void> {
    await api.post(`/pills/my/${pillId}`);
  },

  // Remove pill from user's list
  async removePill(pillId: number): Promise<void> {
    await api.delete(`/pills/my/${pillId}`);
  },

  // Get today's schedule
  async getTodaySchedule(): Promise<PillSchedule[]> {
    const response = await api.get('/schedule/today');
    return response.data;
  },

  // Mark schedule as taken
  async markAsTaken(scheduleId: number): Promise<void> {
    await api.put(`/schedule/${scheduleId}/taken`);
  },

  // Upload prescription image
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
