import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

type FAQItem = {
  question: string;
  answer: string;
};

const FAQ_LIST: FAQItem[] = [
  {
    question: '약을 어떻게 추가하나요?',
    answer: '홈 화면 하단의 + 버튼을 누르거나, 검색 탭에서 약 이름 또는 증상으로 검색하여 추가할 수 있습니다.',
  },
  {
    question: '복약 알림은 언제 오나요?',
    answer: '설정한 복약 시간(아침 08:00, 점심 12:00, 저녁 18:00)에 푸시 알림이 발송됩니다. 알림 설정에서 시간을 변경할 수 있습니다.',
  },
  {
    question: '복용 완료는 어떻게 체크하나요?',
    answer: '홈 화면에서 약 카드를 탭하면 복용 완료로 체크됩니다. 다시 탭하면 체크가 해제됩니다.',
  },
  {
    question: '약 정보는 어디서 가져오나요?',
    answer: '식품의약품안전처의 공공데이터를 활용하여 정확한 약 정보를 제공합니다.',
  },
  {
    question: '개인정보는 안전한가요?',
    answer: '모든 개인정보는 암호화되어 안전하게 저장됩니다. 자세한 내용은 개인정보처리방침을 확인해주세요.',
  },
  {
    question: '비밀번호를 잊어버렸어요.',
    answer: '로그인 화면에서 "비밀번호 찾기"를 통해 재설정할 수 있습니다. 등록된 이메일로 인증 링크가 발송됩니다.',
  },
];

export default function HelpScreen({ navigation }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
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
        <Text style={styles.headerTitle}>도움말</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>자주 묻는 질문</Text>

          {FAQ_LIST.map((item, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.faqItem}
                onPress={() => toggleExpand(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Text style={styles.faqArrow}>
                  {expandedIndex === index ? '−' : '+'}
                </Text>
              </TouchableOpacity>
              {expandedIndex === index && (
                <View style={styles.faqAnswerContainer}>
                  <Text style={styles.faqAnswer}>{item.answer}</Text>
                </View>
              )}
              {index < FAQ_LIST.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>문의하기</Text>

          <TouchableOpacity style={styles.contactItem}>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>이메일 문의</Text>
              <Text style={styles.contactValue}>support@timetopill.com</Text>
            </View>
            <Text style={styles.contactArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.contactItem}>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>카카오톡 문의</Text>
              <Text style={styles.contactValue}>@timetopill</Text>
            </View>
            <Text style={styles.contactArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Terms Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>약관 및 정책</Text>

          <TouchableOpacity style={styles.linkItem}>
            <Text style={styles.linkText}>이용약관</Text>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.linkItem}>
            <Text style={styles.linkText}>개인정보처리방침</Text>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.linkItem}>
            <Text style={styles.linkText}>오픈소스 라이선스</Text>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>
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
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1e293b',
    paddingRight: 12,
  },
  faqArrow: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '500',
  },
  faqAnswerContainer: {
    paddingBottom: 14,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 13,
    color: '#64748b',
  },
  contactArrow: {
    fontSize: 18,
    color: '#94a3b8',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  linkText: {
    fontSize: 15,
    color: '#374151',
  },
  linkArrow: {
    fontSize: 18,
    color: '#94a3b8',
  },
});
