import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  StatusBar,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pill } from '../types';
import { pillService } from '../services/pillService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const SYMPTOM_TAGS = ['두통', '소화불량', '감기', '알러지', '근육통', '수면장애', '피로', '관절통'];
const POPULAR_PILLS = ['타이레놀', '게보린', '판피린', '베아제'];

export default function SearchScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Pill[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('알림', '검색어를 입력해주세요.');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setSearched(true);
    try {
      const data = await pillService.searchByName(searchQuery);
      setResults(data);
    } catch (error) {
      console.log('검색 실패:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTagSearch = async (tag: string) => {
    setSearchQuery(tag);
    Keyboard.dismiss();
    setLoading(true);
    setSearched(true);
    try {
      const data = await pillService.searchBySymptom(tag);
      setResults(data);
    } catch (error) {
      console.log('증상 검색 실패:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPill = async (pill: Pill) => {
    try {
      await pillService.addPill(pill.itemSeq);
      Alert.alert('추가 완료', `${pill.name}이(가) 내 약 목록에 추가되었습니다.`);
    } catch (error) {
      console.log('약 추가 실패:', error);
      Alert.alert('추가 실패', '약을 추가하는데 실패했습니다. 다시 시도해주세요.');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setSearched(false);
  };

  const renderResultItem = ({ item }: { item: Pill }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => navigation.navigate('PillDetail', { pill: item })}
      activeOpacity={0.7}
    >
      <View style={styles.pillIconContainer}>
        <View style={styles.pillDot} />
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultDesc}>{item.description}</Text>
        {item.warnings && item.warnings.length > 0 && (
          <View style={styles.warningBadge}>
            <Text style={styles.warningText}>{item.warnings[0].message}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddPill(item)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>약 검색</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="약 이름 또는 증상으로 검색"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearIcon}>×</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e293b" />
          <Text style={styles.loadingText}>검색 중...</Text>
        </View>
      ) : !searched ? (
        /* Initial State - Show Tags */
        <View style={styles.tagsSection}>
          <Text style={styles.sectionTitle}>증상으로 찾기</Text>
          <View style={styles.tagsGrid}>
            {SYMPTOM_TAGS.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={styles.tagButton}
                onPress={() => handleTagSearch(tag)}
                activeOpacity={0.7}
              >
                <Text style={styles.tagLabel}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Popular Pills */}
          <View style={styles.popularSection}>
            <Text style={styles.sectionTitle}>인기 약품</Text>
            <View style={styles.popularList}>
              {POPULAR_PILLS.map((name, index) => (
                <TouchableOpacity
                  key={name}
                  style={[
                    styles.popularItem,
                    index === POPULAR_PILLS.length - 1 && styles.popularItemLast,
                  ]}
                  onPress={() => handleTagSearch(name)}
                >
                  <Text style={styles.popularRank}>{index + 1}</Text>
                  <Text style={styles.popularName}>{name}</Text>
                  <Text style={styles.popularArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      ) : (
        /* Search Results */
        <FlatList
          data={results}
          keyExtractor={(item) => item.itemSeq}
          contentContainerStyle={styles.resultsList}
          renderItem={renderResultItem}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            results.length > 0 ? (
              <Text style={styles.resultsCount}>
                검색 결과 {results.length}건
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Text style={styles.emptyIcon}>?</Text>
              </View>
              <Text style={styles.emptyTitle}>검색 결과가 없습니다</Text>
              <Text style={styles.emptySubtitle}>
                다른 키워드로 검색해보세요
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={clearSearch}
              >
                <Text style={styles.retryButtonText}>다시 검색하기</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
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
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1e293b',
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 18,
    color: '#94a3b8',
  },
  searchButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
  },
  tagsSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 14,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 32,
  },
  tagButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tagLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  popularSection: {
    marginTop: 8,
  },
  popularList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  popularItemLast: {
    borderBottomWidth: 0,
  },
  popularRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 14,
    overflow: 'hidden',
  },
  popularName: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
  popularArrow: {
    fontSize: 18,
    color: '#94a3b8',
  },
  resultsList: {
    padding: 20,
    paddingTop: 8,
  },
  resultsCount: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pillIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  pillDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1e293b',
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  resultDesc: {
    fontSize: 13,
    color: '#64748b',
  },
  warningBadge: {
    marginTop: 6,
    backgroundColor: '#fffbeb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  warningText: {
    fontSize: 11,
    color: '#92400e',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '400',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 28,
    color: '#94a3b8',
    fontWeight: '600',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 28,
  },
  retryButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
});
