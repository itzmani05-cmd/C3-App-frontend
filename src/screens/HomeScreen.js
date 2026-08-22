import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import axios from 'axios';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { API_BASE_URL } from '../config/api';

const cardShadow = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 2,
};

function formatPercent(value) {
  return `${Math.round(value || 0)}%`;
}

function formatDateTime(value) {
  if (!value) {
    return 'No attempts yet';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'No attempts yet';
  }

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function StatCard({ label, value }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        ...cardShadow,
      }}
    >
      <Text style={{ color: '#6B7280', fontFamily: 'ManropeMedium', fontSize: 12 }}>
        {label}
      </Text>
      <Text
        style={{
          marginTop: 8,
          color: '#2563EB',
          fontFamily: 'ManropeExtraBold',
          fontSize: 20,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    Alert.alert('Logout', 'Do you want to log out now?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          global.userId = null;
          global.user = null;
          const rootNavigation = navigation.getParent?.() || navigation;
          if (rootNavigation?.replace) {
            rootNavigation.replace('Login');
          } else {
            navigation.navigate('Login');
          }
        },
      },
    ]);
  };

  const fetchDashboard = async (isRefreshing = false) => {
    const userId = global.userId || global.user?.userId;

    if (!userId) {
      setDashboard(null);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/dashboard`, {
        headers: {
          userid: userId,
        },
      });
      setDashboard(res.data);
    } catch (err) {
      console.log('Home dashboard error:', err);
      setDashboard(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  const user = dashboard?.user;
  const stats = dashboard?.stats || {};
  const recentActivity = (dashboard?.recentActivity || []).filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      (item.title || '').toLowerCase().includes(query) ||
      (item.subtitle || '').toLowerCase().includes(query)
    );
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <Header title="Home" rightLabel="Logout" onRightPress={handleLogout} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchDashboard(true)} />
        }
      >
        <View
          style={{
            marginTop: 16,
            marginHorizontal: 16,
            backgroundColor: '#FFFFFF',
            borderRadius: 18,
            padding: 18,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            ...cardShadow,
          }}
        >
          <Text style={{ color: '#6B7280', fontFamily: 'ManropeMedium', fontSize: 13 }}>
            {getGreeting()}
          </Text>
          <Text
            style={{
              marginTop: 4,
              color: '#0F172A',
              fontFamily: 'ManropeExtraBold',
              fontSize: 24,
            }}
          >
            {user?.name || 'Learner'}
          </Text>
        </View>

        {dashboard ? (
          <View style={{ marginTop: 14, paddingHorizontal: 12, flexDirection: 'row' }}>
            <StatCard label="Avg. Score" value={formatPercent(stats.averageScore)} />
            <StatCard label="Lessons Cleared" value={`${stats.lessonsCleared || 0}`} />
            <StatCard label="Attempts" value={`${stats.totalAttempts || 0}`} />
          </View>
        ) : null}

        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search activity..." />

      <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
        <Text style={{ color: '#0F172A', fontFamily: 'ManropeBold', fontSize: 18 }}>
          Recent Activity
        </Text>

        {recentActivity.length === 0 ? (
          <Text style={{ marginTop: 10, color: '#6B7280', fontFamily: 'ManropeRegular' }}>
            Your recent quiz activity will appear here.
          </Text>
        ) : (
          recentActivity.slice(0, 4).map((item) => (
            <View
              key={item.id}
              style={{
                marginTop: 12,
                backgroundColor: '#FFFFFF',
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                ...cardShadow,
              }}
            >
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={{ color: '#0F172A', fontFamily: 'ManropeBold' }}>{item.title}</Text>
                <Text
                  style={{
                    marginTop: 4,
                    color: '#6B7280',
                    fontFamily: 'ManropeRegular',
                    fontSize: 12,
                  }}
                >
                  {item.subtitle}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: '#2563EB', fontFamily: 'ManropeExtraBold', fontSize: 16 }}>
                  {formatPercent(item.percentage)}
                </Text>
                <Text
                  style={{
                    marginTop: 4,
                    color: item.isTimedOut ? '#DC2626' : '#6B7280',
                    fontFamily: 'ManropeRegular',
                    fontSize: 12,
                  }}
                >
                  {item.isTimedOut ? 'Timed out' : formatDateTime(item.submittedAt)}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
      </ScrollView>
    </View>
  );
}
