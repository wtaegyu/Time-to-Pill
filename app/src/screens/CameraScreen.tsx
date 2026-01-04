import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { pillService } from '../services/pillService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function CameraScreen({ navigation }: Props) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라 권한이 필요합니다.');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const analyzePrescription = async () => {
    if (!image) return;

    setLoading(true);
    try {
      // TODO: 실제 OCR API 연동
      // const pills = await pillService.uploadPrescription(image);

      // 현재는 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        '분석 완료',
        '처방전에서 3개의 약을 찾았습니다.\n\n- 타이레놀 500mg\n- 게보린\n- 비타민C\n\n검색 화면에서 확인하시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '확인',
            onPress: () => navigation.navigate('Search'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('오류', '처방전 분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const resetImage = () => {
    setImage(null);
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
        {!image ? (
          /* No Image State */
          <View style={styles.placeholder}>
            <View style={styles.placeholderIcon}>
              <Text style={styles.placeholderEmoji}>📋</Text>
            </View>
            <Text style={styles.placeholderTitle}>처방전을 촬영하세요</Text>
            <Text style={styles.placeholderDesc}>
              처방전을 촬영하면 자동으로{'\n'}약 정보를 인식합니다
            </Text>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.primaryButton} onPress={takePhoto}>
                <Text style={styles.primaryButtonIcon}>📷</Text>
                <Text style={styles.primaryButtonText}>카메라로 촬영</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
                <Text style={styles.secondaryButtonIcon}>🖼️</Text>
                <Text style={styles.secondaryButtonText}>갤러리에서 선택</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Image Preview State */
          <View style={styles.preview}>
            <Image source={{ uri: image }} style={styles.previewImage} resizeMode="contain" />

            <View style={styles.previewActions}>
              <TouchableOpacity style={styles.retakeButton} onPress={resetImage}>
                <Text style={styles.retakeButtonText}>다시 촬영</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.analyzeButton, loading && styles.analyzeButtonDisabled]}
                onPress={analyzePrescription}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.analyzeButtonIcon}>🔍</Text>
                    <Text style={styles.analyzeButtonText}>분석하기</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  placeholderEmoji: {
    fontSize: 48,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
  },
  primaryButtonIcon: {
    fontSize: 20,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
  },
  secondaryButtonIcon: {
    fontSize: 20,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  preview: {
    flex: 1,
    paddingTop: 20,
  },
  previewImage: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  retakeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  analyzeButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  analyzeButtonDisabled: {
    opacity: 0.7,
  },
  analyzeButtonIcon: {
    fontSize: 18,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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
