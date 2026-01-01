import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PillSchedule, PillStatus } from '../types';
import { pillService } from '../services/pillService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

// 복용 상태에 따른 색상
const statusColors: Record<PillStatus, string> = {
  ok: '#1c7c2e',
  warn: '#c06100',
  danger: '#b12020',
};

const statusLabels: Record<PillStatus, string> = {
  ok: '복용 가능',
  warn: '졸음 주의',
  danger: '혼합 복용 불가',
};

export default function HomeScreen({ navigation }: Props) {
  const [schedules, setSchedules] = useState<PillSchedule[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTime, setSelectedTime] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  const loadSchedules = async () => {
    try {
      const data = await pillService.getTodaySchedule();
      setSchedules(data);
    } catch (error) {
      // 개발 중에는 더미 데이터 표시
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
      ]);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

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
      // 개발 중에는 로컬 상태만 업데이트
      setSchedules((prev) =>
        prev.map((s) => (s.id === scheduleId ? { ...s, taken: !s.taken } : s))
      );
    }
  };

  const getPillStatus = (schedule: PillSchedule): PillStatus => {
    if (schedule.pill.warnings.some((w) => w.type === 'interaction')) {
      return 'danger';
    }
    if (schedule.pill.warnings.some((w) => w.type === 'drowsiness')) {
      return 'warn';
    }
    return 'ok';
  };

  const filteredSchedules = schedules.filter((s) => s.time === selectedTime);
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Time To Pill</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MyPage')}>
          <Text style={styles.menuButton}>메뉴</Text>
        </TouchableOpacity>
      </View>

      {/* Date */}
      <Text style={styles.date}>{dateStr} 오늘의 약</Text>

      {/* Time Tabs */}
      <View style={styles.tabs}>
        {(['morning', 'afternoon', 'evening'] as const).map((time) => (
          <TouchableOpacity
            key={time}
            style={[styles.tab, selectedTime === time && styles.tabActive]}
            onPress={() => setSelectedTime(time)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTime === time && styles.tabTextActive,
              ]}
            >
              {time === 'morning' ? '아침' : time === 'afternoon' ? '점심' : '저녁'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pills List */}
      <ScrollView
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredSchedules.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>등록된 약이 없습니다.</Text>
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
            return (
              <TouchableOpacity
                key={schedule.id}
                style={[styles.pillCard, schedule.taken && styles.pillCardTaken]}
                onPress={() => handleTaken(schedule.id)}
              >
                <View style={styles.pillInfo}>
                  <View style={styles.pillHeader}>
                    <Text style={styles.pillName}>{schedule.pill.name}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusColors[status] },
                      ]}
                    >
                      <Text style={styles.statusText}>{statusLabels[status]}</Text>
                    </View>
                  </View>
                  <Text style={styles.pillDosage}>{schedule.pill.dosage}</Text>
                </View>
                <View style={[styles.checkbox, schedule.taken && styles.checkboxChecked]}>
                  {schedule.taken && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navItemActive}>홈</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.navItemText}>검색</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('AddPill')}
        >
          <Text style={styles.navItemText}>추가</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('MyPage')}
        >
          <Text style={styles.navItemText}>마이</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f7',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f1f1f',
  },
  menuButton: {
    color: '#4e7cff',
    fontSize: 16,
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
    padding: 16,
    color: '#1f1f1f',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f2f7',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#1f1f1f',
  },
  tabText: {
    color: '#7a7a7a',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#7a7a7a',
    fontSize: 16,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#4e7cff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  pillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#cfd6e4',
  },
  pillCardTaken: {
    backgroundColor: '#f0f2f7',
    opacity: 0.7,
  },
  pillInfo: {
    flex: 1,
  },
  pillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f1f1f',
  },
  pillDosage: {
    fontSize: 14,
    color: '#7a7a7a',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#cfd6e4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1c7c2e',
    borderColor: '#1c7c2e',
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f2f7',
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemText: {
    color: '#7a7a7a',
    fontSize: 14,
  },
  navItemActive: {
    color: '#1f1f1f',
    fontSize: 14,
    fontWeight: '600',
  },
});
