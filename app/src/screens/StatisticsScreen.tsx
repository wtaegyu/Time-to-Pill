import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function StatisticsScreen({ navigation }: Props) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  // 더미 데이터
  const weeklyData = [
    { day: '월', taken: 3, total: 3 },
    { day: '화', taken: 2, total: 3 },
    { day: '수', taken: 3, total: 3 },
    { day: '목', taken: 1, total: 3 },
    { day: '금', taken: 3, total: 3 },
    { day: '토', taken: 2, total: 3 },
    { day: '일', taken: 0, total: 3 },
  ];

  const totalTaken = weeklyData.reduce((acc, d) => acc + d.taken, 0);
  const totalRequired = weeklyData.reduce((acc, d) => acc + d.total, 0);
  const percentage = Math.round((totalTaken / totalRequired) * 100);

  const pillStats = [
    { name: '타이레놀', taken: 7, total: 7, rate: 100 },
    { name: '게보린', taken: 5, total: 7, rate: 71 },
    { name: '비타민C', taken: 6, total: 7, rate: 86 },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>복약 통계</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('week')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'week' && styles.periodTextActive]}>
              주간
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'month' && styles.periodTextActive]}>
              월간
            </Text>
          </TouchableOpacity>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>복약 달성률</Text>
          <Text style={styles.summaryValue}>{percentage}%</Text>
          <View style={styles.summaryBarBg}>
            <View style={[styles.summaryBar, { width: `${percentage}%` }]} />
          </View>
          <Text style={styles.summaryDetail}>
            총 {totalRequired}회 중 {totalTaken}회 복용
          </Text>
        </View>

        {/* Weekly Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>일별 복약 현황</Text>
          <View style={styles.chartContainer}>
            {weeklyData.map((item, index) => {
              const height = item.total > 0 ? (item.taken / item.total) * 100 : 0;
              return (
                <View key={index} style={styles.chartItem}>
                  <View style={styles.chartBarContainer}>
                    <View style={styles.chartBarBg}>
                      <View style={[styles.chartBar, { height: `${height}%` }]} />
                    </View>
                  </View>
                  <Text style={styles.chartLabel}>{item.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Pill Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>약별 복약률</Text>
          {pillStats.map((pill, index) => (
            <View
              key={index}
              style={[styles.pillStatRow, index === pillStats.length - 1 && styles.pillStatRowLast]}
            >
              <View style={styles.pillStatInfo}>
                <Text style={styles.pillStatName}>{pill.name}</Text>
                <Text style={styles.pillStatDetail}>
                  {pill.taken}/{pill.total}회
                </Text>
              </View>
              <View style={styles.pillStatRight}>
                <View style={styles.pillStatBarBg}>
                  <View style={[styles.pillStatBar, { width: `${pill.rate}%` }]} />
                </View>
                <Text style={styles.pillStatRate}>{pill.rate}%</Text>
              </View>
            </View>
          ))}
        </View>

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
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#fff',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  periodTextActive: {
    color: '#1e293b',
  },
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 24,
    backgroundColor: '#1e293b',
    borderRadius: 14,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  summaryBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginBottom: 12,
  },
  summaryBar: {
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  summaryDetail: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 120,
  },
  chartItem: {
    flex: 1,
    alignItems: 'center',
  },
  chartBarContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBarBg: {
    width: 24,
    height: 80,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBar: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  pillStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  pillStatRowLast: {
    borderBottomWidth: 0,
  },
  pillStatInfo: {
    flex: 1,
  },
  pillStatName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  pillStatDetail: {
    fontSize: 12,
    color: '#64748b',
  },
  pillStatRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pillStatBarBg: {
    width: 80,
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  pillStatBar: {
    height: 6,
    backgroundColor: '#1e293b',
    borderRadius: 3,
  },
  pillStatRate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    width: 40,
    textAlign: 'right',
  },
});
