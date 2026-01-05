import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const PillDetailScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { pill } = route.params as { pill: any };

  const handleAddPill = () => {
    // 스케줄 설정 화면으로 이동
    navigation.navigate('AddPillSchedule', { pill });
  };

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
        <Text style={styles.headerTitle}>약 정보</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 약 기본 정보 */}
        <View style={styles.card}>
          <Text style={styles.pillName}>{pill.name || pill.itemName}</Text>
          {pill.entpName && (
            <Text style={styles.company}>{pill.entpName}</Text>
          )}
        </View>

        {/* 효능/효과 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>효능/효과</Text>
          <Text style={styles.content}>
            {pill.description || pill.efficacy || "정보 없음"}
          </Text>
        </View>

        {/* 용법/용량 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>용법/용량</Text>
          <Text style={styles.content}>
            {pill.dosage || pill.useMethod || "정보 없음"}
          </Text>
        </View>

        {/* 주의사항 */}
        {pill.warnings && pill.warnings.length > 0 && (
          <View style={[styles.card, styles.warningCard]}>
            <Text style={styles.warningTitle}>주의사항</Text>
            {pill.warnings.map((w: any, index: number) => (
              <View key={index} style={styles.warningItem}>
                <Text style={styles.warningDot}>•</Text>
                <Text style={styles.warningText}>
                  {typeof w === 'string' ? w : w.message}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* 여백 */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPill}>
          <Text style={styles.addButtonText}>내 약통에 추가</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    backgroundColor: '#f8fafc',
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pillName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: '#64748b',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 10,
  },
  content: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  warningCard: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 10,
  },
  warningItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  warningDot: {
    fontSize: 14,
    color: '#dc2626',
    marginRight: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#991b1b',
    lineHeight: 20,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  addButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PillDetailScreen;
