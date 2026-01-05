import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authService } from '../services/authService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function CompleteProfileScreen({ navigation }: Props) {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!age || !gender) {
      Alert.alert('알림', '나이와 성별을 모두 입력해주세요.');
      return;
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
      Alert.alert('알림', '올바른 나이를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await authService.updateProfile({
        age: ageNum,
        gender,
      });
      Alert.alert('완료', '프로필이 완성되었습니다!', [
        { text: '확인', onPress: () => navigation.replace('Home') }
      ]);
    } catch (error: any) {
      Alert.alert('오류', error.response?.data?.message || '프로필 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      '건너뛰기',
      '나이와 성별 정보는 맞춤 복약 정보를 위해 필요합니다.\n나중에 마이페이지에서 입력할 수 있습니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '건너뛰기', onPress: () => navigation.replace('Home') }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>P</Text>
            </View>
            <Text style={styles.title}>추가 정보 입력</Text>
            <Text style={styles.subtitle}>
              맞춤 복약 정보를 위해{'\n'}추가 정보를 입력해주세요
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Age */}
            <Text style={styles.inputLabel}>나이</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="나이를 입력하세요"
                placeholderTextColor="#9ca3af"
                value={age}
                onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                maxLength={3}
              />
              <Text style={styles.unitText}>세</Text>
            </View>

            {/* Gender */}
            <Text style={styles.inputLabel}>성별</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'M' && styles.genderButtonActive,
                ]}
                onPress={() => setGender('M')}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === 'M' && styles.genderButtonTextActive,
                  ]}
                >
                  남성
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'F' && styles.genderButtonActive,
                ]}
                onPress={() => setGender('F')}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === 'F' && styles.genderButtonTextActive,
                  ]}
                >
                  여성
                </Text>
              </TouchableOpacity>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>i</Text>
              <Text style={styles.infoText}>
                나이와 성별 정보는 약물 복용 시 주의사항 및{'\n'}
                맞춤형 정보 제공을 위해 사용됩니다.
              </Text>
            </View>

            {/* Buttons */}
            <TouchableOpacity
              style={[styles.completeButton, loading && styles.buttonDisabled]}
              onPress={handleComplete}
              disabled={loading}
            >
              <Text style={styles.completeButtonText}>
                {loading ? '저장 중...' : '완료'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              disabled={loading}
            >
              <Text style={styles.skipButtonText}>나중에 입력하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    color: '#1e293b',
  },
  unitText: {
    fontSize: 15,
    color: '#64748b',
    marginLeft: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#1e293b',
    borderColor: '#1e293b',
  },
  genderButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
  genderButtonTextActive: {
    color: '#fff',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 32,
  },
  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0ea5e9',
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#0369a1',
    lineHeight: 20,
  },
  completeButton: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  skipButtonText: {
    color: '#64748b',
    fontSize: 14,
  },
});
