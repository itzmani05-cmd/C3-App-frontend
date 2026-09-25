import React, { useEffect } from 'react';
import { Alert, View } from 'react-native';
import { BookOpen, KeyRound, LifeBuoy, LogOut, Search, Settings } from 'lucide-react-native';
import AppText from '../components/ui/AppText';
import Screen from '../components/ui/Screen';
import SectionTitle from '../components/ui/SectionTitle';
import ProfileHeaderCard from '../components/profile/ProfileHeaderCard';
import ActionRow from '../components/profile/ActionRow';
import useFetch from '../hooks/useFetch';
import useLogout from '../hooks/useLogout';
import { getProfile } from '../api/user';
import { COLORS } from '../theme';

const APP_VERSION = '2.0.0';

export default function ProfileScreen({ navigation }) {
  const logout = useLogout(navigation);
  const { data: user, loading, refreshing, refresh, error } = useFetch(getProfile);

  useEffect(() => {
    if (error) Alert.alert('Error', 'Failed to load profile');
  }, [error]);

  const openTab = (screenName) => (navigation.getParent?.() || navigation).navigate(screenName);

  return (
    <Screen
      title="Profile"
      background={COLORS.appBackground}
      loaderColor={COLORS.blue600}
      loading={loading}
      refreshing={refreshing}
      onRefresh={refresh}
      contentStyle={{ paddingBottom: 28 }}
    >
      <ProfileHeaderCard user={user} />

      <View style={{ marginTop: 24 }}>
        <SectionTitle>Quick Actions</SectionTitle>
        <ActionRow icon={BookOpen} label="Go to Home" helper="Jump back to your dashboard" onPress={() => openTab('Home')} />
        <ActionRow icon={Search} label="Open Practice" helper="Start a lesson or retry a quiz" onPress={() => openTab('Practice')} />
      </View>

      <View style={{ marginTop: 24 }}>
        <SectionTitle>Account</SectionTitle>
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
        <ActionRow icon={LogOut} label="Logout" helper="Sign out from this device" danger onPress={logout} />
      </View>

      <AppText style={{ color: COLORS.gray500, fontSize: 13, textAlign: 'center', marginTop: 28 }}>
        Version {APP_VERSION}
      </AppText>
    </Screen>
  );
}
