import React,{useState,useCallback} from 'react'
import {ActivityIndicator,Alert,View ,Text,TouchableOpacity} from 'react-native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchLearningPath as loadLearningPath } from '../utils/learningPathApi';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import useSelectedExam from '../hooks/useSelectedExam';
import ExamPicker from '../components/ExamPicker';
import NoExamAssigned from '../components/NoExamAssigned';

export default function ExploreScreen ({navigation}) {

  const [units,setUnits]=useState([]);
  const [loading,setLoading]=useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { loading: examLoading, exams, selectedExamId, needsSelection, noExamsAssigned, selectExam, clearSelectedExam } = useSelectedExam();

  const fetchUnitsFallback = useCallback(async (examId) => {
    const res = await axios.get(`${API_BASE_URL}/api/content/units`, {
      params: examId ? { examId } : {},
    });
    const plainUnits = Array.isArray(res.data) ? res.data : [];

    setUnits(
      plainUnits.map((unit) => ({
        ...unit,
        isUnlocked: true,
        isCleared: false,
      }))
    );
  }, []);

  const fetchLearningPath = useCallback(async (examId) => {
    const userId = global.userId || global.user?.userId;

    try {
      setLoading(true);
      const learningPath = await loadLearningPath(userId ? { userid: userId } : {}, examId);
      const nextUnits = Array.isArray(learningPath?.units) ? learningPath.units : [];

      if (nextUnits.length > 0) {
        setUnits(nextUnits);
      } else {
        await fetchUnitsFallback(examId);
      }
    } catch (err) {
      console.log('Learning path fetch error:', err);
      try {
        await fetchUnitsFallback(examId);
      } catch (fallbackErr) {
        console.log('Units fallback fetch error:', fallbackErr);
        setUnits([]);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchUnitsFallback]);

  useFocusEffect(
    useCallback(() => {
      if (examLoading || needsSelection || noExamsAssigned) return;
      fetchLearningPath(selectedExamId);
    }, [fetchLearningPath, examLoading, needsSelection, noExamsAssigned, selectedExamId])
  );

  if (!examLoading && needsSelection) {
    return <ExamPicker exams={exams} onSelect={selectExam} />;
  }

  if (!examLoading && noExamsAssigned) {
    return <NoExamAssigned />;
  }

  const handleUnitPress = (unit) => {
    navigation.navigate("TopicsScreen",{unitId:unit._id,unitName:unit.name});
  };


  return (
    <View style={{flex:1,backgroundColor:'#F8FAFC'}}>
      <Header
        title="Explore Units"
        showBack={true}
      />
      {exams.length > 1 ? (
        <TouchableOpacity
          onPress={clearSelectedExam}
          style={{
            marginTop: 10,
            marginHorizontal: 16,
            alignSelf: 'flex-start',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: '#EEF2FF',
          }}
        >
          <Text style={{ fontFamily: 'ManropeSemiBold', fontSize: 12, color: '#4F46E5' }}>
            {exams.find((e) => e._id === selectedExamId)?.name || 'Exam'} · Switch
          </Text>
        </TouchableOpacity>
      ) : null}
       <View style={{ marginTop: 10 }}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search units..."
        />
      </View>

      <Text style={{fontFamily:"ManropeMedium",marginHorizontal:16,marginBottom:10,marginTop:14,fontSize:18}}>
        Available Units
      </Text>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
      <FlatList
        data={units.filter((u) => {
          if (!searchQuery.trim()) return true;
          return (u.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        })}
        keyExtractor={(item) => item._id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginHorizontal: 16,
          paddingBottom: 30,
        }}
        ListEmptyComponent={
          <View style={{alignItems: 'center', marginTop: 50}}>
            <Text
              style={{
                marginHorizontal: 16,
                marginTop: 12,
                color: '#6B7280',
                fontFamily: 'ManropeMedium',
              }}
            >
              No units available right now.
            </Text>
          </View>
          
        }
        
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleUnitPress(item)}
            style={{
              marginTop:12,
              padding: 18,
              marginalHorizontal: 16,
              backgroundColor: '#FFFFFF',
              borderRadius: 18,
              borderColor:'#E5E7EB',
              borderWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
           <View style={{ flex: 1, marginRight: 12 }}>
              <Text
                style={{
                  color: '#000000',
                  fontFamily: 'ManropeBold',
                  fontSize: 16,
                }}
              >
                {item.name}
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  color: '#6B7280',
                  fontFamily: 'ManropeRegular',
                  fontSize: 12,
                }}
              >
                Open topics for this unit
              </Text>
            </View>

            {/* Right Side */}
            <View style={{ alignItems: 'flex-end' }}>
              <Text
                style={{
                  color: item?.isCleared
                    ? '#16A34A'
                    : '#2563EB',
                  fontFamily: 'ManropeExtraBold',
                  fontSize: 16,
                }}
              >
                {item?.isCleared ? '✓' : '→'}
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  color: item?.isCleared
                    ? '#16A34A'
                    : '#2563EB',
                  fontFamily: 'ManropeSemiBold',
                  fontSize: 12,
                }}
              >
                {item?.isCleared ? 'Done' : 'Open'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      )}

      
    </View>
  )
}

