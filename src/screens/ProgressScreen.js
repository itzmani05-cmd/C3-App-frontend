import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert
} from 'react-native';
import axios from 'axios';
import Header from '../components/Header';
import { API_BASE_URL } from '../config/api';

export default function ProgressScreen() {
  const [view, setView] = useState('units');

  const [units, setUnits] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [studentData, setStudentData] = useState([]);

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/content/units`);
      setUnits(res.data || []);
      setTopics([]);
      setSubtopics([]);
      setStudentData([]);
      setSelectedUnit(null);
      setSelectedTopic(null);
      setSelectedSubtopic(null);
      setView('units');
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to load units");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const fetchTopics = async (unit) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/content/topics/${unit._id}`);
      setTopics(res.data || []);
      setSubtopics([]);
      setStudentData([]);
      setSelectedUnit(unit);
      setSelectedTopic(null);
      setSelectedSubtopic(null);
      setView('topics');
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to load topics");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentProgressForTopic = async (topic) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/progress/topic/${topic._id}`
      );

      setStudentData(res.data || []);
      setSelectedTopic(topic);
      setSelectedSubtopic(null);
      setView('progress');

    } catch (err) {
      console.log(err);
      const status = err.response?.status;
      Alert.alert("Error", `Failed to load topic progress ${status ? `(Status: ${status})` : ''}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubtopics = async (topic) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/content/subtopics/${topic._id}`);
      const subs = res.data || [];
      
      if (subs.length === 0) {
        // No subtopics, fetch topic progress directly
        return fetchStudentProgressForTopic(topic);
      }

      setSubtopics(subs);
      setStudentData([]);
      setSelectedTopic(topic);
      setSelectedSubtopic(null);
      setView('subtopics');
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to load subtopics");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentProgress = async (subtopic) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/progress/subtopic/${subtopic._id}`
      );

      setStudentData(res.data || []);
      setSelectedSubtopic(subtopic);
      setView('progress');

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to load progress");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (view === 'progress') {
      if (selectedSubtopic) {
        setSelectedSubtopic(null);
        setView('subtopics');
      } else {
        setSelectedTopic(null);
        setView('topics');
      }
      return;
    }

    if (view === 'subtopics') {
      setSubtopics([]);
      setSelectedTopic(null);
      setView('topics');
      return;
    }

    if (view === 'topics') {
      setTopics([]);
      setSelectedUnit(null);
      setView('units');
      return;
    }
  };

  const handleRefresh = () => {
    if (view === 'progress') {
      if (selectedSubtopic) {
        fetchStudentProgress(selectedSubtopic);
      } else if (selectedTopic) {
        fetchStudentProgressForTopic(selectedTopic);
      }
      return;
    }

    if (view === 'subtopics' && selectedTopic) {
      fetchSubtopics(selectedTopic);
      return;
    }

    if (view === 'topics' && selectedUnit) {
      fetchTopics(selectedUnit);
      return;
    }

    fetchUnits(true);
  };

  const getSafeScore = (value) => {
    const numericScore = Number(value);

    if (!Number.isFinite(numericScore)) {
      return 0;
    }

    return Math.max(0, Math.min(Math.round(numericScore), 100));
  };

  const renderUnits = () => (
  <>
    <Text style={headingStyle}>Available Units</Text>

    {units.length === 0 ? (
      <Text style={emptyTextStyle}>
        No units available
      </Text>
      ) : (
        units.map((unit) => (
          <TouchableOpacity
            key={unit._id}
            onPress={() => fetchTopics(unit)}
            style={cardStyle}
          >
            <View style={{ flex: 1 }}>
              <Text style={titleStyle}>
                {unit.name}
              </Text>

              <Text style={subTitleStyle}>
                Open topics for this unit
              </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={arrowStyle}>→</Text>

              <Text style={statusStyle}>
                Open
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </>
  );

  const renderTopics = () => (
  <>
    <Text style={headingStyle}>Topics</Text>

    {topics.length === 0 ? (
      <Text style={emptyTextStyle}>
        No topics available
      </Text>
      ) : (
        topics.map((topic) => (
          <TouchableOpacity
            key={topic._id}
            onPress={() => fetchSubtopics(topic)}
            style={cardStyle}
          >
            <View style={{ flex: 1 }}>
              <Text style={titleStyle}>
                {topic.name}
              </Text>

              <Text style={subTitleStyle}>
                Open subtopics
              </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={arrowStyle}>→</Text>
              <Text style={statusStyle}>Open</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </>
  );

  const renderSubtopics = () => (
  <>
    <Text style={headingStyle}>Subtopics</Text>

    {subtopics.length === 0 ? (
      <Text style={emptyTextStyle}>
        No subtopics available
      </Text>
      ) : (
        subtopics.map((sub) => (
          <TouchableOpacity
            key={sub._id}
            onPress={() => fetchStudentProgress(sub)}
            style={cardStyle}
          >
            <View style={{ flex: 1 }}>
              <Text style={titleStyle}>
                {sub.name}
              </Text>

              <Text style={subTitleStyle}>
                View student progress
              </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={arrowStyle}>→</Text>
              <Text style={statusStyle}>Open</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </>
  );

  const renderProgress = () => {
    const attendedCount = studentData.filter(
      (item) => Number(item.attemptCount || 0) > 0
    ).length;
    const notAttendedCount = studentData.length - attendedCount;

    return (
      <>
        <Text style={headingStyle}>Student Progress</Text>

        {studentData.length > 0 ? (
          <Text style={summaryTextStyle}>
            Attended: {attendedCount} | Not Attended: {notAttendedCount}
          </Text>
        ) : null}

        {studentData.length === 0 ? (
          <Text style={emptyTextStyle}>No students available for this selection</Text>
        ) : (
          studentData.map((item, index) => {
            const bestScore = getSafeScore(item.bestScore);
            const hasAttempted = Boolean(
              item.hasAttempted || Number(item.attemptCount || 0) > 0
            );
            const statusLabel = hasAttempted
              ? (item.isCleared ? 'Cleared' : 'Not Cleared')
              : 'Not Attended';
            const statusColor = hasAttempted
              ? (item.isCleared ? '#2563EB' : '#DC2626')
              : '#6B7280';
            const progressColor = hasAttempted
              ? (bestScore >= 70 ? '#2563EB' : '#DC2626')
              : '#D1D5DB';
              
            return (
              <View
                key={item.email || `${item.name}-${index}`}
                style={{
                  marginTop: 12,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 18,
                  padding: 18,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  shadowColor: '#0F172A',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.05,
                  shadowRadius: 10,
                  elevation: 2,
                }}
              >
                {/* Top Row */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  {/* Left Side */}
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text
                      style={{
                        fontFamily: 'ManropeBold',
                        fontSize: 16,
                        color: '#000000',
                      }}
                    >
                      {item.name || 'Unknown Student'}
                    </Text>

                    <Text
                      style={{
                        marginTop: 4,
                        color: '#6B7280',
                        fontFamily: 'ManropeRegular',
                        fontSize: 12,
                      }}
                    >
                      {item.email || 'No email available'}
                    </Text>
                  </View>

                  {/* Right Status */}
                  <View
                    style={{
                      backgroundColor: hasAttempted
                        ? item.isCleared
                          ? '#DCFCE7'
                          : '#FEE2E2'
                        : '#F3F4F6',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: statusColor,
                        fontFamily: 'ManropeSemiBold',
                        fontSize: 12,
                      }}
                    >
                      {statusLabel}
                    </Text>
                  </View>
                </View>

                {/* Progress */}
                {hasAttempted ? (
                  <>
                    <View
                      style={{
                        marginTop: 14,
                        height: 8,
                        backgroundColor: '#E5E7EB',
                        borderRadius: 10,
                        overflow: 'hidden',
                      }}
                    >
                      <View
                        style={{
                          width: `${bestScore}%`,
                          height: '100%',
                          backgroundColor: progressColor,
                        }}
                      />
                    </View>

                    {/* Score Row */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: '#374151',
                          fontFamily: 'ManropeMedium',
                          fontSize: 13,
                        }}
                      >
                        Score: {bestScore}%
                      </Text>

                      <Text
                        style={{
                          color: '#374151',
                          fontFamily: 'ManropeMedium',
                          fontSize: 13,
                        }}
                      >
                        Attempts: {item.attemptCount || 0}
                      </Text>
                    </View>
                  </>
                ) : null}
              </View>
            );
          })
        )}
      </>
    );
  };

  const renderContent = () => {
    if (view === 'topics') return renderTopics();
    if (view === 'subtopics') return renderSubtopics();
    if (view === 'progress') return renderProgress();
    return renderUnits();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>

      <Header
        title="Progress"
        showBack={view !== 'units'}
        onBackPress={handleBack}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {renderContent()}
        </ScrollView>
      )}
    </View>
  );
}

const cardStyle = {
  marginTop: 12,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  padding: 18,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  flexDirection:'row',
  justifyContent:'space-between',
  alignItems:'center',
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 2,
};

const progressBarBg = {
  height: 8,
  backgroundColor: '#E5E7EB',
  borderRadius: 10,
  marginVertical: 8,
  overflow: 'hidden'
};

const emptyTextStyle = {
  color: '#6B7280',
  fontFamily: 'ManropeRegular',
  marginTop: 12
};

const summaryTextStyle = {
  color: '#6B7280',
  fontFamily: 'ManropeMedium',
  marginBottom: 8
};

const subTitleStyle = {
  marginTop: 4,
  color: '#6B7280',
  fontFamily: 'ManropeRegular',
  fontSize: 12,
};

const arrowStyle = {
  color: '#2563EB',
  fontFamily: 'ManropeExtraBold',
  fontSize: 18,
};

const statusStyle = {
  marginTop: 4,
  color: '#2563EB',
  fontFamily: 'ManropeSemiBold',
  fontSize: 12,
};

const headingStyle = {
  fontSize: 18,
  fontFamily: 'ManropeBold',
  marginBottom: 10,
  color: '#000000',
};

const titleStyle = {
  fontFamily: 'ManropeBold',
  fontSize: 16,
  color: '#000000',
};
