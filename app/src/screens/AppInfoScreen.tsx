import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Linking,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function AppInfoScreen({ navigation }: Props) {
  const handleOpenGithub = () => {
    Linking.openURL('https://github.com/your-username/timetopill');
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
        <Text style={styles.headerTitle}>앱 정보</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* App Logo & Info */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>P</Text>
          </View>
          <Text style={styles.appName}>Time To Pill</Text>
          <Text style={styles.appVersion}>버전 1.0.0</Text>
        </View>

        {/* App Description */}
        <View style={styles.section}>
          <Text style={styles.description}>
            Time To Pill은 복약 관리를 도와주는 앱입니다.{'\n'}
            복용 중인 약을 등록하고, 정해진 시간에 알림을 받아{'\n'}
            건강한 복약 습관을 만들어보세요.
          </Text>
        </View>

        {/* Version Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>버전 정보</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>앱 버전</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>빌드 번호</Text>
            <Text style={styles.infoValue}>1</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>최근 업데이트</Text>
            <Text style={styles.infoValue}>2025.01.02</Text>
          </View>
        </View>

        {/* Developer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>개발 정보</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>개발</Text>
            <Text style={styles.infoValue}>Time To Pill Team</Text>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.infoRow} onPress={handleOpenGithub}>
            <Text style={styles.infoLabel}>GitHub</Text>
            <Text style={styles.infoLink}>저장소 보기 ›</Text>
          </TouchableOpacity>
        </View>

        {/* Tech Stack */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기술 스택</Text>

          <View style={styles.techStack}>
            <View style={styles.techItem}>
              <Text style={styles.techLabel}>Frontend</Text>
              <Text style={styles.techValue}>React Native + Expo</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techLabel}>Backend</Text>
              <Text style={styles.techValue}>Spring Boot</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techLabel}>Database</Text>
              <Text style={styles.techValue}>MySQL</Text>
            </View>
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.copyright}>
          <Text style={styles.copyrightText}>
            © 2025 Time To Pill. All rights reserved.
          </Text>
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
  logoSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#64748b',
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
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 24,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: '#374151',
  },
  infoValue: {
    fontSize: 15,
    color: '#64748b',
  },
  infoLink: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  techStack: {
    gap: 12,
  },
  techItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  techLabel: {
    fontSize: 14,
    color: '#374151',
  },
  techValue: {
    fontSize: 14,
    color: '#64748b',
  },
  copyright: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  copyrightText: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
