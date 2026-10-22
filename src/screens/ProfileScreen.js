import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import Constants from 'expo-constants';
import { FingerprintPattern, House, KeyRound, LifeBuoy, Library, LogOut } from '../icons';
import AppText from '../components/ui/AppText';
import Screen from '../components/ui/Screen';
import { ProfileSkeleton } from '../components/ui/Skeletons';
import SectionTitle from '../components/ui/SectionTitle';
import ProfileHeaderCard from '../components/profile/ProfileHeaderCard';
import ActionRow from '../components/profile/ActionRow';
import ProfileStats from '../components/profile/ProfileStats';
import ToggleRow from '../components/profile/ToggleRow';
import useFetch from '../hooks/useFetch';
import useFeaturesMenu from '../hooks/useFeaturesMenu';
import useLogout from '../hooks/useLogout';
import { getProfile } from '../api/user';
import { getProgressOverview } from '../api/dailyChallenge';
import {
  authenticateWithBiometrics,
  isBiometricAvailable,
  isBiometricLockEnabled,
  setBiometricLockEnabled,
} from '../utils/biometricLock';
import { COLORS, tw } from '../theme';

const APP_VERSION = Constants.expoConfig?.version || '2.0.0';

export default function ProfileScreen({ navigation }) {
  const logout = useLogout(navigation);
  const menu = useFeaturesMenu(navigation);
  const { data: user, loading, refreshing, refresh, error } = useFetch(getProfile, [], { cacheKey: 'profile' });
  const { data: overview } = useFetch(getProgressOverview, [], { refetchOnFocus: true, cacheKey: 'progress-overview' });

  useEffect(() => {
    if (error) Alert.alert('Error', 'Failed to load profile');
  }, [error]);

  // Optional fingerprint / face lock. The row only appears when the phone supports it and has one set up.
  const [bioAvailable, setBioAvailable] = useState(false);
  const [bioEnabled, setBioEnabled] = useState(false);

  useEffect(() => {
    isBiometricAvailable().then(setBioAvailable);
    isBiometricLockEnabled().then(setBioEnabled);
  }, []);

  const toggleBiometricLock = async (enable) => {
    if (enable && !(await authenticateWithBiometrics('Confirm it is you to turn on app lock'))) return;
    await setBiometricLockEnabled(enable);
    setBioEnabled(enable);
  };

  const openTab = (screenName) => (navigation.getParent?.() || navigation).navigate(screenName);

  return (
    <Screen
      title="Profile"
      largeTitle="Profile"
      headerProps={{ onMenuPress: menu.open }}
      background={COLORS.appBackground}
      loaderColor={COLORS.brand600}
      loading={loading}
      skeleton={<ProfileSkeleton />}
      refreshing={refreshing}
      onRefresh={refresh}
      contentStyle={{ paddingBottom: 28 }}
    >
      <ProfileHeaderCard user={user} />
      <ProfileStats summary={overview?.summary} />

      <View style={tw`mt-6`}>
        <SectionTitle>Shortcuts</SectionTitle>
        <ActionRow icon={House} label="Home" helper="Jump back to your dashboard" onPress={() => openTab('Home')} />
        <ActionRow icon={Library} label="Learn" helper="Start a lesson or retry a quiz" onPress={() => openTab('Practice')} />
      </View>

      <View style={tw`mt-4`}>
        <SectionTitle>Account</SectionTitle>
        <ActionRow icon={KeyRound} label="Change Password" helper="Update your account password" onPress={() => navigation.navigate('ResetPassword')} />
        {bioAvailable ? (
          <ToggleRow
            icon={FingerprintPattern}
            label="App lock"
            helper="Ask for your fingerprint or face to open the app"
            value={bioEnabled}
            onValueChange={toggleBiometricLock}
          />
        ) : null}
        <ActionRow icon={LifeBuoy} label="Support" helper="Get help with your account" onPress={() => Alert.alert('Support', 'Please contact 6369925623 for help.')} />
        <ActionRow icon={LogOut} label="Log out" helper="Sign out from this device" danger onPress={logout} />
      </View>

      <AppText style={tw`mt-6 text-center text-xs text-slate-500`}>C³ Institute · Version {APP_VERSION}</AppText>
      {menu.sheet}
    </Screen>
  );
}
