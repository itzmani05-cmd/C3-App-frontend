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
import DailyChallengeCard from '../components/DailyChallengeCard';
import { API_BASE_URL } from '../config/api';
import { clearSession } from '../utils/authStorage';

const cardShadow = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 2,
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen({ navigation }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    const userId = global.userId || global.user?.userId;
    if (!userId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/notifications/unread-count`, {
        headers: { userid: userId },
      });
      setUnreadCount(res.data?.count || 0);
    } catch (err) {
      console.log('Fetch unread notifications error:', err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const unsubscribe = navigation.addListener('focus', fetchUnreadCount);
    return unsubscribe;
  }, [navigation]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Do you want to log out now?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          global.userId = null;
          global.user = null;
          await clearSession();
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

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <Header
        title="Home"
        rightLabel="Logout"
        onRightPress={handleLogout}
        onBellPress={() => navigation.navigate('NotificationsScreen')}
        unreadCount={unreadCount}
      />

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

        <DailyChallengeCard navigation={navigation} />

        <View
          style={{
            marginTop: 12,
            marginHorizontal: 16,
            backgroundColor: '#FFFBEB',
            borderRadius: 16,
            padding: 14,
            borderWidth: 1,
            borderColor: '#FEF3C7',
          }}
        >
          <Text style={{ color: '#92400E', fontFamily: 'ManropeBold', fontSize: 13 }}>
            🔥 How streaks work
          </Text>
          <Text
            style={{
              marginTop: 4,
              color: '#92400E',
              fontFamily: 'ManropeRegular',
              fontSize: 12,
              lineHeight: 18,
            }}
          >
            Complete the Daily Challenge to grow your streak by 1. Miss a day and it resets to
            zero — so check in daily to keep it alive!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
