import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authService } from '../services/authService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function RegisterScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [loading, setLoading] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);

  const checkNickname = async () => {
    if (!nickname) {
      Alert.alert('알림', '닉네임을 입력해주세요.');
      return;
    }
    try {
      const available = await authService.checkNickname(nickname);
      if (available) {
        Alert.alert('확인', '사용 가능한 닉네임입니다.');
        setNicknameChecked(true);
      } else {
        Alert.alert('알림', '이미 사용 중인 닉네임입니다.');
        setNicknameChecked(false);
      }
    } catch (error) {
      Alert.alert('오류', '닉네임 확인 중 오류가 발생했습니다.');
    }
  };

  const handleRegister = async () => {
    if (!username || !nickname || !password || !age) {
      Alert.alert('알림', '모든 필드를 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!nicknameChecked) {
      Alert.alert('알림', '닉네임 중복 확인을 해주세요.');
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        username,
        nickname,
        password,
        age: parseInt(age, 10),
        gender,
      });
      Alert.alert('성공', '회원가입이 완료되었습니다.', [
        { text: '확인', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      Alert.alert('회원가입 실패', '다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>아이디</Text>
          <TextInput
            style={styles.input}
            placeholder="아이디를 입력하세요"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>닉네임</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChangeText={(text) => {
                setNickname(text);
                setNicknameChecked(false);
              }}
            />
            <TouchableOpacity style={styles.checkButton} onPress={checkNickname}>
              <Text style={styles.checkButtonText}>중복확인</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>나이</Text>
          <TextInput
            style={styles.input}
            placeholder="나이를 입력하세요"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>성별</Text>
          <View style={styles.row}>
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 다시 입력하세요"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '가입 중...' : '회원가입'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 24,
    color: '#1f1f1f',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f1f1f',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cfd6e4',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  checkButton: {
    backgroundColor: '#f0f2f7',
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  checkButtonText: {
    color: '#1f1f1f',
    fontSize: 14,
  },
  genderButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cfd6e4',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#1f1f1f',
    borderColor: '#1f1f1f',
  },
  genderButtonText: {
    color: '#1f1f1f',
    fontSize: 16,
  },
  genderButtonTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#1f1f1f',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  buttonDisabled: {
    backgroundColor: '#7a7a7a',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
