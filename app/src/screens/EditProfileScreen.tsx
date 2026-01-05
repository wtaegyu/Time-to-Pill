import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authService } from '../services/authService';
import { User } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function EditProfileScreen({ navigation }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | null>(null);
  const [loading, setLoading] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userData = await authService.getCurrentUser();
    if (userData) {
      setUser(userData);
      setNickname(userData.nickname || '');
      setAge(userData.age?.toString() || '');
      setGender(userData.gender as 'M' | 'F' | null);
    }
  };

  const checkNickname = async () => {
    if (!nickname || nickname === user?.nickname) {
      setNicknameAvailable(null);
      return;
    }
    try {
      const available = await authService.checkNickname(nickname);
      setNicknameAvailable(available);
    } catch (error) {
      setNicknameAvailable(null);
    }
  };

  const handleSave = async () => {
    if (!nickname.trim()) {
      Alert.alert('알림', '닉네임을 입력해주세요.');
      return;
    }

    if (nicknameAvailable === false) {
      Alert.alert('알림', '이미 사용 중인 닉네임입니다.');
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile({
        nickname: nickname.trim(),
        age: age ? parseInt(age) : undefined,
        gender: gender || undefined,
      });
      Alert.alert('완료', '프로필이 수정되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('오류', error.response?.data?.message || '프로필 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>프로필 수정</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            {/* 닉네임 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>닉네임</Text>
              <View style={styles.inputRow}>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="닉네임을 입력하세요"
                    placeholderTextColor="#9ca3af"
                    value={nickname}
                    onChangeText={(text) => {
                      setNickname(text);
                      setNicknameAvailable(null);
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={styles.checkButton}
                  onPress={checkNickname}
                >
                  <Text style={styles.checkButtonText}>중복확인</Text>
                </TouchableOpacity>
              </View>
              {nicknameAvailable === true && (
                <Text style={styles.successText}>사용 가능한 닉네임입니다</Text>
              )}
              {nicknameAvailable === false && (
                <Text style={styles.errorText}>이미 사용 중인 닉네임입니다</Text>
              )}
            </View>

            {/* 나이 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>나이</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="나이를 입력하세요"
                  placeholderTextColor="#9ca3af"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* 성별 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>성별</Text>
              <View style={styles.genderRow}>
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
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? '저장 중...' : '저장'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: {
    paddingVertical: 16,
    fontSize: 15,
    color: '#1e293b',
  },
  checkButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  successText: {
    fontSize: 12,
    color: '#059669',
    marginTop: 8,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 8,
    marginLeft: 4,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
  bottomContainer: {
    padding: 20,
    paddingBottom: 36,
  },
  submitButton: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
