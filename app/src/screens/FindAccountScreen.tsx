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
    SafeAreaView,
    ActivityIndicator, // 로딩 표시를 위해 추가
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authService } from '../services/authService'; // ✨ [추가] 서버 통신 모듈 연결

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

export default function FindAccountScreen({ navigation }: Props) {
    // 현재 탭 상태 ('id' 또는 'pw')
    const [activeTab, setActiveTab] = useState<'id' | 'pw'>('id');

    // 입력값 상태 관리
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');

    // 로딩 상태 관리
    const [loading, setLoading] = useState(false);

    // 1. 아이디 찾기 로직 (실제 서버 통신)
    const handleFindId = async () => {
        if (!name || !email) {
            Alert.alert('알림', '이름과 이메일을 모두 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            // 백엔드로 요청 전송
            await authService.findId(name, email);
            Alert.alert('성공', `입력하신 이메일(${email})로 아이디를 전송했습니다.`);
        } catch (error: any) {
            const message = error.response?.data?.message || error.response?.data || '일치하는 사용자 정보가 없습니다.';
            Alert.alert('실패', typeof message === 'string' ? message : '정보를 찾을 수 없습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 2. 비밀번호 재설정 로직 (실제 서버 통신)
    const handleFindPw = async () => {
        // 비밀번호 찾기에는 아이디, 이름, 이메일이 모두 필요하다고 가정
        if (!userId || !name || !email) {
            Alert.alert('알림', '아이디, 이름, 이메일을 모두 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            // 백엔드로 요청 전송 (임시 비밀번호 발급)
            await authService.findPassword(userId, name, email);
            Alert.alert('성공', `이메일(${email})로 임시 비밀번호를 전송했습니다.\n로그인 후 비밀번호를 변경해주세요.`);

            // 성공 시 로그인 화면으로 이동할지 물어보기
            navigation.goBack();
        } catch (error: any) {
            const message = error.response?.data?.message || error.response?.data || '정보가 일치하지 않습니다.';
            Alert.alert('실패', typeof message === 'string' ? message : '정보를 찾을 수 없습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* 헤더 및 뒤로가기 */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>계정 찾기</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* 탭 버튼 (아이디 찾기 / 비밀번호 찾기) */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'id' && styles.activeTab]}
                        onPress={() => setActiveTab('id')}
                    >
                        <Text style={[styles.tabText, activeTab === 'id' && styles.activeTabText]}>
                            아이디 찾기
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'pw' && styles.activeTab]}
                        onPress={() => setActiveTab('pw')}
                    >
                        <Text style={[styles.tabText, activeTab === 'pw' && styles.activeTabText]}>
                            비밀번호 찾기
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* 입력 폼 영역 */}
                <View style={styles.formContainer}>
                    {activeTab === 'id' ? (
                        // --- [탭 1] 아이디 찾기 폼 ---
                        <View>
                            <Text style={styles.description}>
                                가입 시 등록한 이름과 이메일을 입력해주세요.
                            </Text>

                            <Text style={styles.label}>이름</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="홍길동"
                                value={name}
                                onChangeText={setName}
                                editable={!loading}
                            />

                            <Text style={styles.label}>이메일</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="example@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                                editable={!loading}
                            />

                            <TouchableOpacity
                                style={[styles.submitButton, loading && styles.buttonDisabled]}
                                onPress={handleFindId}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.submitButtonText}>아이디 찾기</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    ) : (
                        // --- [탭 2] 비밀번호 찾기 폼 ---
                        <View>
                            <Text style={styles.description}>
                                가입 정보를 입력하시면 임시 비밀번호를 발송해드립니다.
                            </Text>

                            <Text style={styles.label}>아이디</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="사용자 아이디"
                                autoCapitalize="none"
                                value={userId}
                                onChangeText={setUserId}
                                editable={!loading}
                            />

                            <Text style={styles.label}>이름</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="홍길동"
                                value={name}
                                onChangeText={setName}
                                editable={!loading}
                            />

                            <Text style={styles.label}>이메일</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="example@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                                editable={!loading}
                            />

                            <TouchableOpacity
                                style={[styles.submitButton, loading && styles.buttonDisabled]}
                                onPress={handleFindPw}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.submitButtonText}>비밀번호 재설정</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        fontSize: 24,
        color: '#333',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
    },
    tabContainer: {
        flexDirection: 'row',
        marginTop: 20,
        marginHorizontal: 20,
        borderRadius: 12,
        backgroundColor: '#e2e8f0',
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#1e293b',
        fontWeight: '700',
    },
    formContainer: {
        padding: 24,
    },
    description: {
        color: '#64748b',
        marginBottom: 24,
        fontSize: 14,
        lineHeight: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        fontSize: 15,
        color: '#1e293b',
    },
    submitButton: {
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 12,
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