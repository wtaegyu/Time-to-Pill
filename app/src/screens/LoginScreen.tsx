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
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { authService } from '../services/authService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '329734818686-lni9h7e611qtkbec8f92fkef628dot8n.apps.googleusercontent.com',
    });
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { data } = response;

        try {
          const res = await authService.googleLogin(
              data.user.email || '',
              data.user.name || '',
              data.user.id
          );

          if (!res.isProfileComplete) {
            navigation.replace('CompleteProfile');
          } else {
            navigation.replace('Home');
          }
        } catch (apiError: any) {
          Alert.alert('로그인 실패', apiError.response?.data?.message || '서버 연결에 실패했습니다.');
        }
      }
    } catch (error: any) {
      if (isErrorWithCode(error)) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // 취소됨
        } else if (error.code === statusCodes.IN_PROGRESS) {
          Alert.alert('알림', '로그인 진행 중입니다.');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          Alert.alert('오류', 'Google Play 서비스를 사용할 수 없습니다.');
        } else {
          Alert.alert('오류', '구글 로그인에 실패했습니다.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('알림', '아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await authService.login({ username, password });
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('로그인 실패', '아이디 또는 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>P</Text>
            </View>
            <Text style={styles.title}>Time To Pill</Text>
            <Text style={styles.subtitle}>당신의 건강한 복약 습관</Text>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            <Text style={styles.inputLabel}>아이디</Text>
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

            <Text style={styles.inputLabel}>비밀번호</Text>
            <View style={styles.inputContainer}>
              <TextInput
                  style={styles.input}
                  placeholder="비밀번호를 입력하세요"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
              >
                <Text style={styles.eyeText}>{showPassword ? '숨김' : '표시'}</Text>
              </TouchableOpacity>
            </View>

            {/* 로그인 버튼 */}
            <TouchableOpacity
                style={[styles.loginButton, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? '로그인 중...' : '로그인'}
              </Text>
            </TouchableOpacity>

            {/* ✨ [수정됨] 링크 모음 (한 줄 배치) ✨ */}
            <View style={styles.linksContainer}>
              {/* 1. 아이디/비번 찾기 */}
              <TouchableOpacity onPress={() => navigation.navigate('FindAccount')}>
                <Text style={styles.linkText}>아이디 / 비밀번호 찾기</Text>
              </TouchableOpacity>

              {/* 2. 구분선 */}
              <Text style={styles.separator}>|</Text>

              {/* 3. 회원가입 */}
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>
                  계정이 없으신가요? <Text style={styles.linkBold}>회원가입</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login */}
          <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              disabled={loading}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleButtonText}>Google로 계속하기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
  },
  form: {
    marginBottom: 24,
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
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    color: '#1e293b',
  },
  eyeButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  eyeText: {
    fontSize: 13,
    color: '#64748b',
  },
  loginButton: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // ✨ [새로 정의된 스타일] ✨
  linksContainer: {
    flexDirection: 'row',       // 가로 정렬
    alignItems: 'center',       // 세로 가운데 정렬
    justifyContent: 'center',   // 가로 가운데 정렬
    marginTop: 24,
  },
  linkText: {
    color: '#64748b',
    fontSize: 13, // 한 줄에 잘 들어가도록 크기 조절
  },
  linkBold: {
    color: '#1e293b',
    fontWeight: '600',
  },
  separator: {
    color: '#cbd5e1', // 연한 회색
    marginHorizontal: 12, // 양옆 간격
    fontSize: 12,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#94a3b8',
    fontSize: 13,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285f4',
    marginRight: 10,
  },
  googleButtonText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '500',
  },
});