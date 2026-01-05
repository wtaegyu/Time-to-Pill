import React, { useState, useEffect } from 'react';
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
import { pillService } from '../services/pillService';
import { calendarService } from '../services/calendarService';
import { authService } from '../services/authService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

// 복약 기록 타입
interface DayRecord {
  date: string;
  total: number;
  taken: number;
  pills: PillRecord[];
}

interface PillRecord {
  id: number;
  name: string;
  time: 'morning' | 'afternoon' | 'evening';
  taken: boolean;
}

const TIME_LABELS = {
  morning: '아침',
  afternoon: '점심',
  evening: '저녁',
};

export default function CalendarScreen({ navigation }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [records, setRecords] = useState<Record<string, DayRecord>>({});
  const [syncing, setSyncing] = useState(false);
  const [hasGoogleLinked, setHasGoogleLinked] = useState(false);

  useEffect(() => {
    loadMonthRecords();
    loadGoogleStatus();
  }, [currentDate]);

  const loadGoogleStatus = async () => {
    const user = await authService.getCurrentUser();
    setHasGoogleLinked(user?.hasGoogleLinked || false);
  };

  const loadMonthRecords = async () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // API는 1-12월 기준

    try {
      const data = await pillService.getMonthRecords(year, month);
      // API 응답을 Record<string, DayRecord> 형태로 변환
      const formattedRecords: Record<string, DayRecord> = {};
      if (data && typeof data === 'object') {
        Object.entries(data).forEach(([dateStr, record]: [string, any]) => {
          formattedRecords[dateStr] = {
            date: dateStr,
            total: record.total || 0,
            taken: record.taken || 0,
            pills: record.pills || [],
          };
        });
      }
      setRecords(formattedRecords);
    } catch (error) {
      console.log('월별 기록 로드 실패:', error);
      setRecords({});
    }
  };

  const handleSyncToGoogle = async () => {
    setSyncing(true);
    try {
      const schedules = Object.entries(records).flatMap(([date, record]) =>
        record.pills.map((pill) => ({
          pillName: pill.name,
          time: pill.time,
          date,
        }))
      );

      if (schedules.length === 0) {
        Alert.alert('알림', '동기화할 복약 스케줄이 없습니다.');
        return;
      }

      const successCount = await calendarService.syncSchedulesToCalendar(schedules);
      Alert.alert(
        '동기화 완료',
        `${successCount}개의 복약 스케줄이 구글 캘린더에 추가되었습니다.`
      );
    } catch (error: any) {
      Alert.alert('동기화 실패', error.message || '구글 캘린더 동기화에 실패했습니다.');
    } finally {
      setSyncing(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];

    // 이전 달의 빈 칸
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // 현재 달의 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const getDateString = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getDayStatus = (day: number): 'complete' | 'partial' | 'missed' | 'future' | null => {
    const dateStr = getDateString(day);
    const record = records[dateStr];

    if (!record) return 'future';
    if (record.taken === record.total) return 'complete';
    if (record.taken > 0) return 'partial';
    return 'missed';
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'complete': return '#10b981';
      case 'partial': return '#f59e0b';
      case 'missed': return '#ef4444';
      default: return 'transparent';
    }
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const selectedRecord = selectedDate ? records[selectedDate] : null;

  // 이번 달 통계 계산
  const monthStats = Object.values(records).reduce(
    (acc, record) => {
      acc.total += record.total;
      acc.taken += record.taken;
      return acc;
    },
    { total: 0, taken: 0 }
  );
  const monthRate = monthStats.total > 0 ? Math.round((monthStats.taken / monthStats.total) * 100) : 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>복약 캘린더</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Month Navigation */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={prevMonth} style={styles.monthButton}>
            <Text style={styles.monthArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {currentDate.getFullYear()}년 {MONTHS[currentDate.getMonth()]}
          </Text>
          <TouchableOpacity onPress={nextMonth} style={styles.monthButton}>
            <Text style={styles.monthArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Google Calendar Sync - 구글 로그인 시에만 표시 */}
        {hasGoogleLinked && (
          <View style={styles.syncCard}>
            <View style={styles.syncHeader}>
              <View style={styles.syncInfo}>
                <Text style={styles.syncIcon}>G</Text>
                <View>
                  <Text style={styles.syncTitle}>구글 캘린더 동기화</Text>
                  <Text style={styles.syncDesc}>
                    복약 스케줄을 구글 캘린더에 추가합니다
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.syncButton, syncing && styles.syncButtonDisabled]}
              onPress={handleSyncToGoogle}
              disabled={syncing}
            >
              {syncing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.syncButtonText}>구글 캘린더에 동기화</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Month Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{monthRate}%</Text>
              <Text style={styles.statLabel}>복용률</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{monthStats.taken}</Text>
              <Text style={styles.statLabel}>복용 완료</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{monthStats.total - monthStats.taken}</Text>
              <Text style={styles.statLabel}>미복용</Text>
            </View>
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.calendar}>
          {/* Day Headers */}
          <View style={styles.weekRow}>
            {DAYS.map((day, index) => (
              <View key={day} style={styles.weekDay}>
                <Text style={[
                  styles.weekDayText,
                  index === 0 && styles.sundayText,
                  index === 6 && styles.saturdayText,
                ]}>
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Days Grid */}
          <View style={styles.daysGrid}>
            {days.map((day, index) => {
              if (day === null) {
                return <View key={`empty-${index}`} style={styles.dayCell} />;
              }

              const dateStr = getDateString(day);
              const status = getDayStatus(day);
              const isSelected = selectedDate === dateStr;
              const isTodayDate = isToday(day);

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    isTodayDate && styles.dayCellToday,
                  ]}
                  onPress={() => setSelectedDate(dateStr)}
                >
                  <Text style={[
                    styles.dayText,
                    isSelected && styles.dayTextSelected,
                    isTodayDate && styles.dayTextToday,
                    index % 7 === 0 && styles.sundayText,
                    index % 7 === 6 && styles.saturdayText,
                  ]}>
                    {day}
                  </Text>
                  {status && status !== 'future' && (
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
            <Text style={styles.legendText}>완료</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.legendText}>일부</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.legendText}>미복용</Text>
          </View>
        </View>

        {/* Selected Date Detail */}
        {selectedRecord && (
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>
              {selectedDate?.replace(/-/g, '.')} 복약 현황
            </Text>
            <View style={styles.detailStats}>
              <View style={styles.detailStatItem}>
                <Text style={styles.detailStatValue}>{selectedRecord.taken}</Text>
                <Text style={styles.detailStatLabel}>복용</Text>
              </View>
              <Text style={styles.detailDivider}>/</Text>
              <View style={styles.detailStatItem}>
                <Text style={styles.detailStatValue}>{selectedRecord.total}</Text>
                <Text style={styles.detailStatLabel}>전체</Text>
              </View>
            </View>
            <View style={styles.detailProgressBg}>
              <View
                style={[
                  styles.detailProgress,
                  { width: `${(selectedRecord.taken / selectedRecord.total) * 100}%` },
                ]}
              />
            </View>

            {/* 복약 목록 */}
            <View style={styles.pillList}>
              {selectedRecord.pills.map((pill) => (
                <View key={pill.id} style={styles.pillItem}>
                  <View style={styles.pillInfo}>
                    <View style={[styles.pillDot, pill.taken && styles.pillDotTaken]} />
                    <View>
                      <Text style={[styles.pillName, pill.taken && styles.pillNameTaken]}>
                        {pill.name}
                      </Text>
                      <Text style={styles.pillTime}>{TIME_LABELS[pill.time]}</Text>
                    </View>
                  </View>
                  <Text style={[styles.pillStatus, pill.taken ? styles.pillStatusTaken : styles.pillStatusMissed]}>
                    {pill.taken ? '복용' : '미복용'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 20,
  },
  monthButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  monthArrow: {
    fontSize: 20,
    color: '#1e293b',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  statsCard: {
    marginHorizontal: 20,
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  calendar: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  sundayText: {
    color: '#ef4444',
  },
  saturdayText: {
    color: '#3b82f6',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  dayCellSelected: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: '#1e293b',
    borderRadius: 12,
  },
  dayText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1e293b',
  },
  dayTextSelected: {
    color: '#fff',
  },
  dayTextToday: {
    fontWeight: '700',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#64748b',
  },
  detailCard: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  detailStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  detailStatItem: {
    alignItems: 'center',
  },
  detailStatValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b',
  },
  detailStatLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  detailDivider: {
    fontSize: 24,
    color: '#cbd5e1',
    marginHorizontal: 16,
  },
  detailProgressBg: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
  },
  detailProgress: {
    height: 8,
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  pillList: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
  },
  pillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  pillInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pillDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
  },
  pillDotTaken: {
    backgroundColor: '#10b981',
  },
  pillName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1e293b',
  },
  pillNameTaken: {
    color: '#64748b',
  },
  pillTime: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  pillStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  pillStatusTaken: {
    color: '#10b981',
  },
  pillStatusMissed: {
    color: '#ef4444',
  },
  syncCard: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  syncHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  syncInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  syncIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4285f4',
    textAlign: 'center',
    lineHeight: 36,
    marginRight: 12,
  },
  syncTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  syncDesc: {
    fontSize: 12,
    color: '#64748b',
  },
  syncButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  syncButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  syncButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
