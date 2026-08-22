import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import {
  ChevronRight,
  BookOpen,
  Search,
  KeyRound,
  Settings,
  LifeBuoy,
  LogOut,
} from 'lucide-react-native';
import Header from '../components/Header';
import { API_BASE_URL } from '../config/api';
import { clearSession } from '../utils/authStorage';

function formatPercent(value) {
  return `${Math.round(value || 0)}%`;
}

function formatJoinDate(value) {
  if (!value) {
    return 'Member';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Member';
  }

  return `Joined ${date.toLocaleDateString('en-IN', {
    month: 'short',
    year: 'numeric',
  })}`;
}

function StatCard({ label, value, accent }) {
  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
      }}
    >
      <Text style={{ color: '#6B7280', fontFamily: 'ManropeMedium', fontSize: 12 }}>
        {label}
      </Text>
      <Text
        style={{
          marginTop: 8,
          color: accent,
          fontFamily: 'ManropeExtraBold',
          fontSize: 22,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function ActionRow({ icon: Icon, label, helper, onPress, tone = 'default' }) {
  const iconBackgroundColor = tone === 'danger' ? '#FEE2E2' : '#F3F4F6';
  const iconTintColor = tone === 'danger' ? '#DC2626' : '#2563EB';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginTop: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          backgroundColor: iconBackgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Icon size={20} color={iconTintColor} />
      </View>

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ color: '#000000', fontFamily: 'ManropeBold', fontSize: 15 }}>
          {label}
        </Text>
        <Text
          style={{
            marginTop: 4,
            color: '#6B7280',
            fontFamily: 'ManropeRegular',
            fontSize: 12,
          }}
        >
          {helper}
        </Text>
      </View>

      <ChevronRight size={20} color="#2563EB" />
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const userId = global.userId || global.user?.userId;
  const tabNavigation = navigation.getParent?.();

  const handleLogout = () => {
    Alert.alert('Logout', 'Do you want to log out now?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await clearSession();
          global.userId = null;
          global.user = null;
          const rootNavigation =
            navigation.getParent?.()?.getParent?.() ||
            navigation.getParent?.() ||
            navigation;

          if (rootNavigation?.replace) {
            rootNavigation.replace('Login');
          } else {
            navigation.navigate('Login');
          }
        },
      },
    ]);
  };

  const fetchProfileData = async (isRefreshing = false) => {
    if (!userId) {
      setUser(null);
      setStats({});
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
      const headers = { userid: userId };
      const [profileRes, dashboardRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/user/profile`, { headers }),
        axios.get(`${API_BASE_URL}/api/user/dashboard`, { headers }),
      ]);

      setUser(profileRes.data || null);
      setStats(dashboardRes.data?.stats || {});
    } catch (err) {
      console.log('Profile screen error:', err);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const openTab = (screenName) => {
    if (tabNavigation?.navigate) {
      tabNavigation.navigate(screenName);
      return;
    }

    navigation.navigate(screenName);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
        <Header title="Profile" rightLabel="Logout" onRightPress={handleLogout} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <Header title="Profile" onRightPress={handleLogout} />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchProfileData(true)} />
        }
      >
        <View
          style={{
            backgroundColor: '#000000',
            borderRadius: 20,
            padding: 18,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 74,
                height: 74,
                borderRadius: 37,
                backgroundColor: '#2563EB',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'ManropeExtraBold',
                  fontSize: 36,
                }}
              >
                {(user?.name || 'L').charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'ManropeExtraBold',
                  fontSize: 22,
                }}
              >
                {user?.name || 'Learner'}
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  color: '#FFFFFF',
                  fontFamily: 'ManropeRegular',
                }}
              >
                {user?.email || 'No email available'}
              </Text>
              <Text
                style={{
                  marginTop: 6,
                  color: '#FFFFFF',
                  fontFamily: 'ManropeMedium',
                  fontSize: 12,
                }}
              >
                {(user?.role || 'student').toUpperCase()} | {formatJoinDate(user?.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 24 }}>
          <Text style={{ color: '#000000', fontFamily: 'ManropeBold', fontSize: 18 }}>
            Quick Actions
          </Text>

          <ActionRow
            icon={BookOpen}
            label="Go to Home"
            helper="Jump back to your dashboard"
            onPress={() => openTab('Home')}
          />
          <ActionRow
            icon={Search}
            label="Open Practice"
            helper="Start a lesson or retry a quiz"
            onPress={() => openTab('Practice')}
          />
        </View>

        <View style={{ marginTop: 24 }}>
          <Text style={{ color: '#000000', fontFamily: 'ManropeBold', fontSize: 18 }}>
            Account
          </Text>

          <ActionRow
            icon={KeyRound}
            label="Change Password"
            helper="Update your account password"
            onPress={() => navigation.navigate('ResetPassword')}
          />
          <ActionRow
            icon={Settings}
            label="Settings"
            helper="Preferences screen is not added yet"
            onPress={() => Alert.alert('Coming Soon', 'Settings will be available soon.')}
          />
          <ActionRow
            icon={LifeBuoy}
            label="Support"
            helper="Get help with your learning account"
            onPress={() => Alert.alert('Support', 'Please contact 6369925623 for help.')}
          />
          <ActionRow
            icon={LogOut}
            label="Logout"
            helper="Sign out from this device"
            tone="danger"
            onPress={handleLogout}
          />
        </View>

        <Text
          style={{
            color: '#6B7280',
            fontFamily: 'ManropeRegular',
            fontSize: 13,
            textAlign: 'center',
            marginTop: 28,
          }}
        >
          Version 1.2.0
        </Text>
      </ScrollView>
    </View>
  );
}

