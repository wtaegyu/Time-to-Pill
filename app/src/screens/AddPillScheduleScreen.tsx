import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Pill, Frequency, TimeSlot, PillScheduleRequest } from '../types';
import { pillService } from '../services/pillService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { pill: Pill } }, 'params'>;
};

const FREQUENCY_OPTIONS: { value: Frequency; label: string; desc: string }[] = [
  { value: 'DAILY', label: '매일', desc: '매일 복용' },
  { value: 'EVERY_OTHER_DAY', label: '격일', desc: '2일마다 복용' },
  { value: 'EVERY_3_DAYS', label: '3일마다', desc: '3일마다 복용' },
  { value: 'WEEKLY', label: '주 1회', desc: '일주일에 한 번' },
  { value: 'CUSTOM', label: '요일 선택', desc: '특정 요일 선택' },
];

const DAY_OPTIONS = [
  { value: 'MON', label: '월' },
  { value: 'TUE', label: '화' },
  { value: 'WED', label: '수' },
  { value: 'THU', label: '목' },
  { value: 'FRI', label: '금' },
  { value: 'SAT', label: '토' },
  { value: 'SUN', label: '일' },
];

const TIME_OPTIONS: { value: TimeSlot; label: string }[] = [
  { value: 'MORNING', label: '아침' },
  { value: 'AFTERNOON', label: '점심' },
  { value: 'EVENING', label: '저녁' },
];

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (date: Date): string => {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export default function AddPillScheduleScreen({ navigation, route }: Props) {
  const { pill } = route.params;

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [frequency, setFrequency] = useState<Frequency>('DAILY');
  const [customDays, setCustomDays] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(['MORNING']);
  const [loading, setLoading] = useState(false);

  const toggleDay = (day: string) => {
    if (customDays.includes(day)) {
      setCustomDays(customDays.filter(d => d !== day));
    } else {
      setCustomDays([...customDays, day]);
    }
  };

  const toggleTimeSlot = (slot: TimeSlot) => {
    if (timeSlots.includes(slot)) {
      if (timeSlots.length > 1) {
        setTimeSlots(timeSlots.filter(s => s !== slot));
      }
    } else {
      setTimeSlots([...timeSlots, slot]);
    }
  };

  const handleSubmit = async () => {
    if (frequency === 'CUSTOM' && customDays.length === 0) {
      Alert.alert('알림', '최소 하나의 요일을 선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      const request: PillScheduleRequest = {
        itemSeq: pill.itemSeq,
        startDate: formatDate(startDate),
        endDate: hasEndDate && endDate ? formatDate(endDate) : undefined,
        frequency,
        customDays: frequency === 'CUSTOM' ? customDays : undefined,
        timeSlots,
      };

      await pillService.addPillWithSchedule(request);
      Alert.alert('등록 완료', `${pill.name}이(가) 등록되었습니다.`, [
        { text: '확인', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error) {
      console.log('약 등록 실패:', error);
      Alert.alert('등록 실패', '약을 등록하는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const adjustDate = (current: Date, days: number): Date => {
    const newDate = new Date(current);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>복용 설정</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 약 정보 */}
        <View style={styles.pillInfo}>
          <Text style={styles.pillName}>{pill.name}</Text>
          <Text style={styles.pillDesc}>{pill.description}</Text>
        </View>

        {/* 시작일 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>시작일</Text>
          <View style={styles.dateSelector}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setStartDate(adjustDate(startDate, -1))}
            >
              <Text style={styles.dateButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.dateText}>{formatDisplayDate(startDate)}</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setStartDate(adjustDate(startDate, 1))}
            >
              <Text style={styles.dateButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 종료일 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>종료일</Text>
            <TouchableOpacity
              style={[styles.toggleButton, hasEndDate && styles.toggleButtonActive]}
              onPress={() => {
                setHasEndDate(!hasEndDate);
                if (!hasEndDate && !endDate) {
                  setEndDate(adjustDate(startDate, 30));
                }
              }}
            >
              <Text style={[styles.toggleText, hasEndDate && styles.toggleTextActive]}>
                {hasEndDate ? '설정됨' : '무기한'}
              </Text>
            </TouchableOpacity>
          </View>
          {hasEndDate && endDate && (
            <View style={styles.dateSelector}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setEndDate(adjustDate(endDate, -1))}
              >
                <Text style={styles.dateButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.dateText}>{formatDisplayDate(endDate)}</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setEndDate(adjustDate(endDate, 1))}
              >
                <Text style={styles.dateButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 복용 빈도 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>복용 빈도</Text>
          <View style={styles.optionsGrid}>
            {FREQUENCY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionCard,
                  frequency === option.value && styles.optionCardActive,
                ]}
                onPress={() => setFrequency(option.value)}
              >
                <Text style={[
                  styles.optionLabel,
                  frequency === option.value && styles.optionLabelActive,
                ]}>
                  {option.label}
                </Text>
                <Text style={[
                  styles.optionDesc,
                  frequency === option.value && styles.optionDescActive,
                ]}>
                  {option.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 요일 선택 (CUSTOM일 때만) */}
        {frequency === 'CUSTOM' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>요일 선택</Text>
            <View style={styles.daysRow}>
              {DAY_OPTIONS.map((day) => (
                <TouchableOpacity
                  key={day.value}
                  style={[
                    styles.dayButton,
                    customDays.includes(day.value) && styles.dayButtonActive,
                  ]}
                  onPress={() => toggleDay(day.value)}
                >
                  <Text style={[
                    styles.dayText,
                    customDays.includes(day.value) && styles.dayTextActive,
                  ]}>
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 복용 시간 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>복용 시간</Text>
          <View style={styles.timeRow}>
            {TIME_OPTIONS.map((time) => (
              <TouchableOpacity
                key={time.value}
                style={[
                  styles.timeButton,
                  timeSlots.includes(time.value) && styles.timeButtonActive,
                ]}
                onPress={() => toggleTimeSlot(time.value)}
              >
                <Text style={[
                  styles.timeText,
                  timeSlots.includes(time.value) && styles.timeTextActive,
                ]}>
                  {time.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>등록하기</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  backIcon: {
    fontSize: 18,
    color: '#1e293b',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  pillInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pillName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  pillDesc: {
    fontSize: 14,
    color: '#64748b',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateButtonText: {
    fontSize: 20,
    color: '#1e293b',
    fontWeight: '600',
  },
  dateText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
  },
  toggleButtonActive: {
    backgroundColor: '#1e293b',
  },
  toggleText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#fff',
  },
  optionsGrid: {
    gap: 10,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  optionCardActive: {
    backgroundColor: '#1e293b',
    borderColor: '#1e293b',
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  optionLabelActive: {
    color: '#fff',
  },
  optionDesc: {
    fontSize: 13,
    color: '#64748b',
  },
  optionDescActive: {
    color: 'rgba(255,255,255,0.7)',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dayButtonActive: {
    backgroundColor: '#1e293b',
    borderColor: '#1e293b',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  dayTextActive: {
    color: '#fff',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  timeButtonActive: {
    backgroundColor: '#1e293b',
    borderColor: '#1e293b',
  },
  timeText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1e293b',
  },
  timeTextActive: {
    color: '#fff',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f8fafc',
    padding: 20,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  submitButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
