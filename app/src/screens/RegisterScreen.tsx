import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authService } from '../services/authService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function RegisterScreen({ navigation }: Props) {
  const [step, setStep] = useState(1);

  // ✨ [추가됨] 이름, 이메일 상태
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | null>(null);
  const [loading, setLoading] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState(false);

  const checkNickname = async () => {
    if (!nickname) {
      Alert.alert('알림', '닉네임을 입력해주세요.');
      return;
    }
    try {
      const available = await authService.checkNickname(nickname);
      setNicknameChecked(true);
      setNicknameAvailable(available);
      if (!available) {
        Alert.alert('알림', '이미 사용 중인 닉네임입니다.');
      }
    } catch (error) {
      Alert.alert('오류', '닉네임 확인 중 오류가 발생했습니다.');
    }
  };

  const handleNext = () => {
    if (step === 1) {
      // ✨ [수정됨] 이름, 이메일 체크 추가
      if (!name || !email || !username || !nickname) {
        Alert.alert('알림', '모든 기본 정보를 입력해주세요.');
        return;
      }
      if (!nicknameChecked || !nicknameAvailable) {
        Alert.alert('알림', '닉네임 중복 확인을 해주세요.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!age || !gender) {
        Alert.alert('알림', '나이와 성별을 선택해주세요.');
        return;
      }
      setStep(3);
    }
  };

  const handleRegister = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('알림', '비밀번호를 입력해주세요.');
      return;
    }
    if (password.length < 4) {
      Alert.alert('알림', '비밀번호는 4자 이상이어야 합니다.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    try {
      // ✨ [수정됨] name, email 포함하여 전송
      await authService.register({
        username,
        password,
        nickname,
        name,      // 추가됨
        email,     // 추가됨
        age: parseInt(age, 10),
        gender: gender!,
      });
      Alert.alert('환영합니다', '회원가입이 완료되었습니다.', [
        { text: '로그인하기', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error: any) {
      // 에러 메시지 상세 표시
      const message = error.response?.data?.message || '다시 시도해주세요.';
      Alert.alert('회원가입 실패', message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
      <>
        {/* ✨ [추가됨] 이름 입력 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>이름</Text>
          <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="실명을 입력하세요"
                placeholderTextColor="#9ca3af"
                value={name}
                onChangeText={setName}
            />
          </View>
        </View>

        {/* ✨ [추가됨] 이메일 입력 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>이메일</Text>
          <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="example@email.com"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>아이디</Text>
          <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="아이디를 입력하세요"
                placeholderTextColor="#9ca3af"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>닉네임</Text>
          <View style={styles.nicknameRow}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <TextInput
                  style={styles.input}
                  placeholder="닉네임을 입력하세요"
                  placeholderTextColor="#9ca3af"
                  value={nickname}
                  onChangeText={(text) => {
                    setNickname(text);
                    setNicknameChecked(false);
                    setNicknameAvailable(false);
                  }}
              />
            </View>
            <TouchableOpacity
                style={[
                  styles.checkButton,
                  nicknameChecked && nicknameAvailable && styles.checkButtonSuccess,
                ]}
                onPress={checkNickname}
            >
              <Text style={[
                styles.checkButtonText,
                nicknameChecked && nicknameAvailable && styles.checkButtonTextSuccess,
              ]}>
                {nicknameChecked && nicknameAvailable ? '확인됨' : '중복확인'}
              </Text>
            </TouchableOpacity>
          </View>
          {nicknameChecked && nicknameAvailable && (
              <Text style={styles.successText}>사용 가능한 닉네임입니다</Text>
          )}
        </View>
      </>
  );

  const renderStep2 = () => (
      <>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>나이</Text>
          <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="나이를 입력하세요"
                placeholderTextColor="#9ca3af"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>성별</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity
                style={[styles.genderButton, gender === 'M' && styles.genderButtonActive]}
                onPress={() => setGender('M')}
            >
              <Text style={[styles.genderText, gender === 'M' && styles.genderTextActive]}>
                남성
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.genderButton, gender === 'F' && styles.genderButtonActive]}
                onPress={() => setGender('F')}
            >
              <Text style={[styles.genderText, gender === 'F' && styles.genderTextActive]}>
                여성
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
  );

  const renderStep3 = () => (
      <>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>비밀번호</Text>
          <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="비밀번호를 입력하세요"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="비밀번호를 다시 입력하세요"
                placeholderTextColor="#9ca3af"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
          </View>
          {confirmPassword && password !== confirmPassword && (
              <Text style={styles.errorText}>비밀번호가 일치하지 않습니다</Text>
          )}
          {confirmPassword && password === confirmPassword && (
              <Text style={styles.successText}>비밀번호가 일치합니다</Text>
          )}
        </View>
      </>
  );

  return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()}
              >
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
              <Text style={styles.title}>회원가입</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Progress */}
            <View style={styles.progressContainer}>
              {[1, 2, 3].map((s) => (
                  <View key={s} style={styles.progressItem}>
                    <View style={[styles.progressDot, s <= step && styles.progressDotActive]}>
                      {s < step ? (
                          <Text style={styles.progressCheck}>✓</Text>
                      ) : (
                          <Text style={[styles.progressNumber, s <= step && styles.progressNumberActive]}>
                            {s}
                          </Text>
                      )}
                    </View>
                    <Text style={[styles.progressLabel, s <= step && styles.progressLabelActive]}>
                      {s === 1 ? '기본정보' : s === 2 ? '추가정보' : '비밀번호'}
                    </Text>
                    {s < 3 && <View style={[styles.progressLine, s < step && styles.progressLineActive]} />}
                  </View>
              ))}
            </View>

            {/* Form */}
            <View style={styles.form}>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </View>
          </ScrollView>

          {/* Bottom Button */}
          <View style={styles.bottomContainer}>
            {step < 3 ? (
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                  <Text style={styles.nextButtonText}>다음</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={[styles.nextButton, loading && styles.buttonDisabled]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                  <Text style={styles.nextButtonText}>
                    {loading ? '가입 중...' : '가입 완료'}
                  </Text>
                </TouchableOpacity>
            )}
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 28,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotActive: {
    backgroundColor: '#1e293b',
  },
  progressNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },
  progressNumberActive: {
    color: '#fff',
  },
  progressCheck: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  progressLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginLeft: 6,
  },
  progressLabelActive: {
    color: '#1e293b',
    fontWeight: '600',
  },
  progressLine: {
    width: 24,
    height: 2,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: '#1e293b',
  },
  form: {
    paddingHorizontal: 24,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    color: '#1e293b',
  },
  nicknameRow: {
    flexDirection: 'row',
    gap: 10,
  },
  checkButton: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonSuccess: {
    backgroundColor: '#1e293b',
  },
  checkButtonText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
  checkButtonTextSuccess: {
    color: '#fff',
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  genderButtonActive: {
    backgroundColor: '#1e293b',
    borderColor: '#1e293b',
  },
  genderText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
  genderTextActive: {
    color: '#fff',
  },
  bottomContainer: {
    padding: 24,
    paddingBottom: 36,
  },
  nextButton: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});