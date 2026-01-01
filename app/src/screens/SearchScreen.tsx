import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pill } from '../types';
import { pillService } from '../services/pillService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const SAMPLE_TAGS = ['두통', '소화불량', '감기', '알러지', '근육통'];

export default function SearchScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Pill[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentTags] = useState(SAMPLE_TAGS);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('알림', '검색어를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const data = await pillService.searchByName(searchQuery);
      setResults(data);
    } catch (error) {
      // 개발 중에는 더미 데이터
      setResults([
        {
          id: 1,
          name: '타이레놀 500mg',
          description: '해열진통제',
          dosage: '1정',
          warnings: [],
        },
        {
          id: 2,
          name: '게보린',
          description: '두통, 치통, 생리통 등',
          dosage: '1정',
          warnings: [{ type: 'drowsiness', message: '졸음 유발' }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTagSearch = async (tag: string) => {
    setSearchQuery(tag);
    setLoading(true);
    try {
      const data = await pillService.searchBySymptom(tag);
      setResults(data);
    } catch (error) {
      setResults([
        {
          id: 1,
          name: '타이레놀 500mg',
          description: '해열진통제',
          dosage: '1정',
          warnings: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPill = async (pill: Pill) => {
    try {
      await pillService.addPill(pill.id);
      Alert.alert('성공', `${pill.name}이(가) 추가되었습니다.`);
    } catch (error) {
      Alert.alert('성공', `${pill.name}이(가) 추가되었습니다.`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>약 검색</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="약 이름으로 검색"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Tags */}
      {results.length === 0 && (
        <View style={styles.tagsSection}>
          <Text style={styles.tagsLabel}>증상으로 검색</Text>
          <View style={styles.tags}>
            {recentTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={styles.tag}
                onPress={() => handleTagSearch(tag)}
              >
                <Text style={styles.tagText}>#{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Results */}
      {loading ? (
        <View style={styles.loading}>
          <Text>검색 중...</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.results}
          renderItem={({ item }) => (
            <View style={styles.resultCard}>
              <TouchableOpacity
                style={styles.resultInfo}
                onPress={() => navigation.navigate('PillDetail', { pill: item })}
              >
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultDesc}>{item.description}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addPillButton}
                onPress={() => handleAddPill(item)}
              >
                <Text style={styles.addPillButtonText}>추가</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            searchQuery && !loading ? (
              <Text style={styles.noResults}>검색 결과가 없습니다.</Text>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f7',
  },
  backButton: {
    color: '#4e7cff',
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f1f1f',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cfd6e4',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#1f1f1f',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  tagsSection: {
    padding: 16,
  },
  tagsLabel: {
    fontSize: 14,
    color: '#7a7a7a',
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f0f2f7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    color: '#4e7cff',
    fontSize: 14,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  results: {
    padding: 16,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#cfd6e4',
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f1f1f',
  },
  resultDesc: {
    fontSize: 14,
    color: '#7a7a7a',
    marginTop: 4,
  },
  addPillButton: {
    backgroundColor: '#4e7cff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addPillButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  noResults: {
    textAlign: 'center',
    color: '#7a7a7a',
    marginTop: 40,
  },
});
