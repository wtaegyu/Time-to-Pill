import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PillSchedule, PillStatus } from '../types';
import { pillService } from '../services/pillService';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const statusConfig: Record<PillStatus, { color: string; bg: string; label: string }> = {
  ok: { color: '#059669', bg: '#ecfdf5', label: '복용 가능' },
  warn: { color: '#d97706', bg: '#fffbeb', label: '졸음 주의' },
  danger: { color: '#dc2626', bg: '#fef2f2', label: '복용 금지' },
};

const timeConfig = {
  morning: { label: '아침', time: '08:00' },
  afternoon: { label: '점심', time: '12:00' },
  evening: { label: '저녁', time: '18:00' },
};

export default function HomeScreen({ navigation }: Props) {
  const [schedules, setSchedules] = useState<PillSchedule[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTime, setSelectedTime] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadUserInfo();
    loadSchedules();
    selectCurrentTime();
  }, []);

  const selectCurrentTime = () => {
    const hour = new Date().getHours();
    if (hour < 11) setSelectedTime('morning');
    else if (hour < 17) setSelectedTime('afternoon');
    else setSelectedTime('evening');
  };

  const loadUserInfo = async () => {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserName(user.nickname || user.username);
    }
  };

  const loadSchedules = async () => {
    try {
      const data = await pillService.getTodaySchedule();
      setSchedules(data);
    } catch (error) {
      setSchedules([
        {
          id: 1,
          pillId: 1,
          pill: {
            id: 1,
            name: '타이레놀',
            description: '해열진통제',
            dosage: '1정',
            warnings: [],
          },
          time: 'morning',
          taken: false,
          date: new Date().toISOString(),
        },
        {
          id: 2,
          pillId: 2,
          pill: {
            id: 2,
            name: '게보린',
            description: '두통약',
            dosage: '1정',
            warnings: [{ type: 'drowsiness', message: '졸음 유발 가능' }],
          },
          time: 'morning',
          taken: true,
          date: new Date().toISOString(),
        },
        {
          id: 3,
          pillId: 3,
          pill: {
            id: 3,
            name: '비타민C',
            description: '영양제',
            dosage: '1정',
            warnings: [],
          },
          time: 'afternoon',
          taken: false,
          date: new Date().toISOString(),
        },
      ]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSchedules();
    setRefreshing(false);
  };

  const handleTaken = async (scheduleId: number) => {
    try {
      await pillService.markAsTaken(scheduleId);
      loadSchedules();
    } catch (error) {
      setSchedules((prev) =>
        prev.map((s) => (s.id === scheduleId ? { ...s, taken: !s.taken } : s))
      );
    }
  };

  const getPillStatus = (schedule: PillSchedule): PillStatus => {
    if (schedule.pill.warnings.some((w) => w.type === 'interaction')) return 'danger';
    if (schedule.pill.warnings.some((w) => w.type === 'drowsiness')) return 'warn';
    return 'ok';
  };

  const filteredSchedules = schedules.filter((s) => s.time === selectedTime);
  const takenCount = filteredSchedules.filter((s) => s.taken).length;
  const totalCount = filteredSchedules.length;
  const progress = totalCount > 0 ? (takenCount / totalCount) * 100 : 0;

  const today = new Date();
  const dateStr = `${today.getMonth() + 1}월 ${today.getDate()}일`;
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayStr = dayNames[today.getDay()];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>안녕하세요{userName ? `, ${userName}님` : ''}</Text>
          <Text style={styles.date}>{dateStr} {dayStr}요일</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('MyPage')}
        >
          <Text style={styles.profileText}>MY</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>오늘의 복약</Text>
          <Text style={styles.progressCount}>{takenCount} / {totalCount}</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {progress === 100 ? '모든 약을 복용했습니다' : `${totalCount - takenCount}개 남음`}
        </Text>
      </View>

      {/* Time Tabs */}
      <View style={styles.tabs}>
        {(['morning', 'afternoon', 'evening'] as const).map((time) => {
          const config = timeConfig[time];
          const isActive = selectedTime === time;
          const count = schedules.filter((s) => s.time === time).length;
          return (
            <TouchableOpacity
              key={time}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {config.label}
              </Text>
              <Text style={[styles.tabTime, isActive && styles.tabTimeActive]}>
                {config.time}
              </Text>
              {count > 0 && (
                <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
                  <Text style={[styles.tabBadgeText, isActive && styles.tabBadgeTextActive]}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Pills List */}
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredSchedules.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIconCircle}>
              <Text style={styles.emptyIcon}>+</Text>
            </View>
            <Text style={styles.emptyTitle}>등록된 약이 없습니다</Text>
            <Text style={styles.emptySubtitle}>약을 추가하여 복약 알림을 받아보세요</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('Search')}
            >
              <Text style={styles.addButtonText}>약 추가하기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredSchedules.map((schedule) => {
            const status = getPillStatus(schedule);
            const config = statusConfig[status];
            return (
              <TouchableOpacity
                key={schedule.id}
                style={[styles.pillCard, schedule.taken && styles.pillCardTaken]}
                onPress={() => handleTaken(schedule.id)}
                activeOpacity={0.7}
              >
                <View style={styles.pillLeft}>
                  <View style={[styles.pillIcon, { backgroundColor: config.bg }]}>
                    <View style={[styles.pillDot, { backgroundColor: config.color }]} />
                  </View>
                  <View style={styles.pillInfo}>
                    <View style={styles.pillNameRow}>
                      <Text style={[styles.pillName, schedule.taken && styles.pillNameTaken]}>
                        {schedule.pill.name}
                      </Text>
                      {status !== 'ok' && (
                        <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                          <Text style={[styles.statusText, { color: config.color }]}>
                            {config.label}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.pillDosage}>
                      {schedule.pill.dosage} · {schedule.pill.description}
                    </Text>
                  </View>
                </View>
                <View style={[styles.checkbox, schedule.taken && styles.checkboxChecked]}>
                  {schedule.taken && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navDot, styles.navDotActive]} />
          <Text style={styles.navTextActive}>홈</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Search')}
        >
          <View style={styles.navDot} />
          <Text style={styles.navText}>검색</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navAddButton}
          onPress={() => navigation.navigate('Camera')}
        >
          <View style={styles.navCameraIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Calendar')}
        >
          <View style={styles.navDot} />
          <Text style={styles.navText}>캘린더</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('MyPage')}
        >
          <View style={styles.navDot} />
          <Text style={styles.navText}>설정</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  date: {
    fontSize: 14,
    color: '#64748b',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  progressCard: {
    marginHorizontal: 24,
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 14,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  progressCount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabActive: {
    backgroundColor: '#1e293b',
    borderColor: '#1e293b',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 2,
  },
  tabLabelActive: {
    color: '#fff',
  },
  tabTime: {
    fontSize: 11,
    color: '#94a3b8',
  },
  tabTimeActive: {
    color: 'rgba(255,255,255,0.7)',
  },
  tabBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  tabBadgeTextActive: {
    color: '#fff',
  },
  list: {
    flex: 1,
    paddingHorizontal: 24,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 28,
    color: '#94a3b8',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 28,
  },
  addButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  pillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pillCardTaken: {
    opacity: 0.5,
  },
  pillLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  pillDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pillInfo: {
    flex: 1,
  },
  pillNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 8,
  },
  pillName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  pillNameTaken: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  pillDosage: {
    fontSize: 13,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1e293b',
    borderColor: '#1e293b',
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  navDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cbd5e1',
    marginBottom: 6,
  },
  navDotActive: {
    backgroundColor: '#1e293b',
  },
  navText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  navTextActive: {
    fontSize: 11,
    color: '#1e293b',
    fontWeight: '600',
  },
  navAddButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginTop: -16,
  },
  navCameraIcon: {
    width: 20,
    height: 16,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
