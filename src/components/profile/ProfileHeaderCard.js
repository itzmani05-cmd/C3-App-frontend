import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import { formatJoinDate } from '../../utils/format';
import { COLORS } from '../../theme';

export default function ProfileHeaderCard({ user }) {
  const initial = (user?.name || 'L').charAt(0).toUpperCase();

  return (
    <View style={cardStyle}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={avatarStyle}>
          <AppText variant="extraBold" style={{ color: COLORS.white, fontSize: 36 }}>
            {initial}
          </AppText>
        </View>

        <View style={{ flex: 1, marginLeft: 14 }}>
          <AppText variant="extraBold" style={{ color: COLORS.white, fontSize: 22 }}>
            {user?.name || 'Learner'}
          </AppText>
          <AppText style={{ marginTop: 4, color: COLORS.white }}>{user?.email || 'No email available'}</AppText>
          <AppText variant="medium" style={{ marginTop: 6, color: COLORS.white, fontSize: 12 }}>
            {(user?.role || 'student').toUpperCase()} | {formatJoinDate(user?.createdAt)}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const cardStyle = {
  backgroundColor: COLORS.black,
  borderRadius: 20,
  padding: 18,
};

const avatarStyle = {
  width: 74,
  height: 74,
  borderRadius: 37,
  backgroundColor: COLORS.blue600,
  justifyContent: 'center',
  alignItems: 'center',
};
