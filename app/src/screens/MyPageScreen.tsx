import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native'; // [추가] 화면 포커스 감지
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
  const isFocused = useIsFocused(); // [추가] 약을 추가하고 돌아왔을 때 새로고침하기 위함

  useEffect(() => {
    if (isFocused) {
      loadUserData();
      loadMyPills();
    }
  }, [isFocused]);

  const loadUserData = async () => {
    const userData = await authService.getCurrentUser();
    if (userData) {
      setUser(userData);
    }
  };

  const loadMyPills = async () => {
    try {
      const pills = await pillService.getMyPills();
      setMyPills(pills);
    } catch (error) {
      console.error("내 약 목록 불러오기 실패:", error);
      // 에러 시 빈 목록 처리
      setMyPills([]);
    }
  };

  const handleLogout = async () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
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
    // [수정] itemName 또는 name 중 있는 것 사용
    const displayName = pill.itemName || pill.name;
    // [중요] 삭제에 사용할 ID는 itemSeq
    const idToRemove = pill.itemSeq || (pill as any).id?.toString();

    Alert.alert('약 삭제', `${displayName}을(를) 삭제하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            if (!idToRemove) throw new Error("ID 없음");
            await pillService.removePill(idToRemove);
            Alert.alert("성공", "삭제되었습니다.");
            loadMyPills(); // 삭제 후 목록 새로고침
          } catch (error) {
            Alert.alert("오류", "삭제에 실패했습니다.");
          }
        },
      },
    ]);
  };

  // ... menuItems 설정은 동일 ...
  const menuItems = [
    { label: '알림 설정', onPress: () => navigation.navigate('NotificationSettings') },
    { label: '비밀번호 변경', onPress: () => navigation.navigate('ChangePassword') },
    { label: '복약 통계', onPress: () => navigation.navigate('Statistics') },
    { label: '도움말', onPress: () => navigation.navigate('Help') },
    { label: '앱 정보', onPress: () => navigation.navigate('AppInfo') },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.nickname?.charAt(0) || user?.username?.charAt(0) || '?'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.nickname}>{user?.nickname || '사용자'}</Text>
              <Text style={styles.username}>@{user?.username}</Text>
            </View>
          </View>
          {/* ... statsRow 생략 (기존과 동일) ... */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{myPills.length}</Text>
              <Text style={styles.statLabel}>등록된 약</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.age || '-'}</Text>
              <Text style={styles.statLabel}>나이</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {user?.gender === 'M' ? '남' : user?.gender === 'F' ? '여' : '-'}
              </Text>
              <Text style={styles.statLabel}>성별</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>프로필 수정</Text>
          </TouchableOpacity>
        </View>

        {/* My Pills Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>내 약 목록</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.addLink}>+ 추가</Text>
            </TouchableOpacity>
          </View>
          {myPills.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>등록된 약이 없습니다</Text>
            </View>
          ) : (
            myPills.map((pill) => (
              <View key={pill.itemSeq || pill.id} style={styles.pillItem}>
                <View style={styles.pillDot} />
                <View style={styles.pillInfo}>
                  {/* [수정] 백엔드 필드명 itemName 사용 */}
                  <Text style={styles.pillName}>{pill.itemName || pill.name}</Text>
                  <Text style={styles.pillDesc} numberOfLines={1}>
                    {pill.entpName} · {pill.efficacy || pill.description}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.pillRemove}
                  onPress={() => handleRemovePill(pill)}
                >
                  <Text style={styles.pillRemoveText}>×</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* ... Menu Section 및 Logout 버튼 기존과 동일 ... */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>설정</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, index === menuItems.length - 1 && styles.menuItemLast]}
              onPress={item.onPress}
            >
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
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
  profileCard: {
    margin: 20,
    marginTop: 8,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  nickname: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: '#64748b',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  editProfileButton: {
    backgroundColor: '#f1f5f9',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  addLink: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  pillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1e293b',
    marginRight: 14,
  },
  pillInfo: {
    flex: 1,
  },
  pillName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  pillDesc: {
    fontSize: 13,
    color: '#64748b',
  },
  pillRemove: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillRemoveText: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuLabel: {
    fontSize: 15,
    color: '#374151',
  },
  menuArrow: {
    fontSize: 18,
    color: '#94a3b8',
  },
  logoutButton: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#dc2626',
  },
});
