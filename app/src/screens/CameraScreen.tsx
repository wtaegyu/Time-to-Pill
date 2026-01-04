import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function CameraScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);

  const handleCameraPress = () => {
    Alert.alert(
      '준비 중',
      '카메라 기능은 준비 중입니다.\n검색 화면에서 직접 약을 검색해주세요.',
      [
        { text: '취소', style: 'cancel' },
        { text: '검색하기', onPress: () => navigation.navigate('Search') },
      ]
    );
  };

  const handleGalleryPress = () => {
    Alert.alert(
      '준비 중',
      '갤러리 기능은 준비 중입니다.\n검색 화면에서 직접 약을 검색해주세요.',
      [
        { text: '취소', style: 'cancel' },
        { text: '검색하기', onPress: () => navigation.navigate('Search') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>처방전 스캔</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.placeholder}>
          <View style={styles.placeholderIcon}>
            <View style={styles.placeholderCamera} />
          </View>
          <Text style={styles.placeholderTitle}>처방전을 촬영하세요</Text>
          <Text style={styles.placeholderDesc}>
            처방전을 촬영하면 자동으로{'\n'}약 정보를 인식합니다
          </Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleCameraPress}>
              <Text style={styles.primaryButtonText}>카메라로 촬영</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleGalleryPress}>
              <Text style={styles.secondaryButtonText}>갤러리에서 선택</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.comingSoonText}>* 카메라 기능은 준비 중입니다</Text>
        </View>
      </View>

      {/* Tips */}
      <View style={styles.tips}>
        <Text style={styles.tipsTitle}>촬영 팁</Text>
        <View style={styles.tipsList}>
          <Text style={styles.tipItem}>• 처방전을 평평한 곳에 놓으세요</Text>
          <Text style={styles.tipItem}>• 밝은 조명에서 촬영하세요</Text>
          <Text style={styles.tipItem}>• 글씨가 잘 보이도록 가까이서 촬영하세요</Text>
        </View>
      </View>
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
    paddingHorizontal: 20,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  placeholderCamera: {
    width: 40,
    height: 32,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#94a3b8',
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  placeholderDesc: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  comingSoonText: {
    marginTop: 24,
    fontSize: 13,
    color: '#94a3b8',
  },
  tips: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  tipsList: {
    gap: 6,
  },
  tipItem: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
  },
});
