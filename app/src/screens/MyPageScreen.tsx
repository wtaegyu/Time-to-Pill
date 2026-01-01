import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authService } from '../services/authService';
import { pillService } from '../services/pillService';
import { User, Pill } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function MyPageScreen({ navigation }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [myPills, setMyPills] = useState<Pill[]>([]);

  useEffect(() => {
    loadUserData();
    loadMyPills();
  }, []);

  const loadUserData = async () => {
    const userData = await authService.getCurrentUser();
    setUser(userData || {
      id: 1,
      username: 'testuser',
      nickname: '테스트유저',
      age: 25,
      gender: 'M',
    });
  };

  const loadMyPills = async () => {
    try {
      const pills = await pillService.getMyPills();
      setMyPills(pills);
    } catch (error) {
      setMyPills([
        {
          id: 1,
          name: '타이레놀',
          description: '해열진통제',
          dosage: '1정',
          warnings: [],
        },
        {
          id: 2,
          name: '게보린',
          description: '두통약',
          dosage: '1정',
          warnings: [],
        },
      ]);
    }
  };

  const handleLogout = async () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          await authService.logout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const handleRemovePill = async (pill: Pill) => {
    Alert.alert('약 삭제', `${pill.name}을(를) 목록에서 삭제하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await pillService.removePill(pill.id);
            loadMyPills();
          } catch (error) {
            setMyPills((prev) => prev.filter((p) => p.id !== pill.id));
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>마이페이지</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButton}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>내 정보</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>닉네임</Text>
            <Text style={styles.infoValue}>{user?.nickname}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>나이</Text>
            <Text style={styles.infoValue}>{user?.age}세</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>성별</Text>
            <Text style={styles.infoValue}>
              {user?.gender === 'M' ? '남성' : '여성'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>정보 수정</Text>
        </TouchableOpacity>
      </View>

      {/* My Pills */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>내 약 목록</Text>
          <Text style={styles.pillCount}>{myPills.length}개</Text>
        </View>
        {myPills.length === 0 ? (
          <View style={styles.emptyPills}>
            <Text style={styles.emptyText}>등록된 약이 없습니다.</Text>
          </View>
        ) : (
          myPills.map((pill) => (
            <View key={pill.id} style={styles.pillCard}>
              <View style={styles.pillInfo}>
                <Text style={styles.pillName}>{pill.name}</Text>
                <Text style={styles.pillDesc}>{pill.description}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemovePill(pill)}
              >
                <Text style={styles.removeButtonText}>삭제</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>설정</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>알림 설정</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>비밀번호 변경</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>앱 정보</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f7',
  },
  backButton: {
    color: '#4e7cff',
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f1f1f',
  },
  logoutButton: {
    color: '#b12020',
    fontSize: 14,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f1f1f',
    marginBottom: 12,
  },
  pillCount: {
    color: '#7a7a7a',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: '#f0f2f7',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    color: '#7a7a7a',
    fontSize: 14,
  },
  infoValue: {
    color: '#1f1f1f',
    fontSize: 14,
    fontWeight: '500',
  },
  editButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cfd6e4',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#1f1f1f',
    fontSize: 14,
  },
  emptyPills: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#7a7a7a',
  },
  pillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f2f7',
    borderRadius: 8,
    marginBottom: 8,
  },
  pillInfo: {
    flex: 1,
  },
  pillName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f1f1f',
  },
  pillDesc: {
    fontSize: 13,
    color: '#7a7a7a',
    marginTop: 2,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  removeButtonText: {
    color: '#b12020',
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f7',
  },
  settingText: {
    fontSize: 15,
    color: '#1f1f1f',
  },
  settingArrow: {
    color: '#7a7a7a',
    fontSize: 16,
  },
});
