// src/screens/PillDetailScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { pillService } from '../services/pillService'; // 나중에 추가 기능 연결시 사용

const PillDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // 검색 화면에서 넘겨준 약 정보 받기
  const { pill } = route.params as { pill: any };

  // [중요] 백엔드 데이터(DrugSearchDto)와 프론트 필드명 매칭
  // 백엔드: efficacy(효능) -> 프론트가 description으로 쓰고 있다면 여기서 매핑 확인 필요
  // 일단 화면에 뿌려봅니다.

  const handleAddPill = async () => {
      try {
          // [체크] 데이터가 pill.itemSeq에 있는지 확인
          const idToSend = pill.itemSeq;

          if (!idToSend) {
              console.log("현재 pill 데이터 구조:", pill); // 로그로 확인
              Alert.alert("오류", "약 식별 번호(itemSeq)가 없습니다.");
              return;
          }

          await pillService.addPill(idToSend);
          Alert.alert("성공", "약통에 추가되었습니다!"); // 서버 응답 성공 시에만 실행됨
          navigation.goBack();
      } catch (error: any) {
          // [중요] 서버에서 보낸 에러 메시지 확인
          const message = error.response?.data || "추가에 실패했습니다.";
          Alert.alert("알림", message);
      }
    };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* 약 이름 */}
        <Text style={styles.title}>{pill.name || pill.itemName}</Text>

        {/* 업체명 */}
        <Text style={styles.company}>{pill.entpName}</Text>

        <View style={styles.divider} />

        {/* 효능/효과 (description이 없으면 efficacy 사용) */}
        <Text style={styles.label}>효능/효과</Text>
        <Text style={styles.content}>
          {pill.description || pill.efficacy || "정보 없음"}
        </Text>

        {/* 용법/용량 (dosage가 없으면 useMethod 사용) */}
        <Text style={styles.label}>용법/용량</Text>
        <Text style={styles.content}>
          {pill.dosage || pill.useMethod || "정보 없음"}
        </Text>

        {/* 주의사항 */}
        {pill.warnings && pill.warnings.length > 0 && (
            <>
                <Text style={styles.label}>주의사항</Text>
                {pill.warnings.map((w: any, index: number) => (
                    <Text key={index} style={styles.warning}>- {w}</Text>
                ))}
            </>
        )}
      </View>

      {/* 내 약통에 추가하기 버튼 */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddPill}>
        <Text style={styles.buttonText}>내 약통에 추가하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 15, padding: 20, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  company: { fontSize: 14, color: '#666', marginBottom: 15 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  label: { fontSize: 16, fontWeight: '600', color: '#444', marginBottom: 5, marginTop: 10 },
  content: { fontSize: 15, color: '#555', lineHeight: 22 },
  warning: { fontSize: 14, color: '#e74c3c', marginTop: 2 },
  addButton: {
    backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 30
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});

export default PillDetailScreen;