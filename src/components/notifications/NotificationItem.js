import React from 'react';
import { View } from 'react-native';
import { Bell, BookOpen, Brain, Clock, FileText, Hourglass, Megaphone, MessageCircle, PenLine, Siren, TriangleAlert } from '../../icons';
import AppText from '../ui/AppText';
import Card from '../ui/Card';
import IconTile from '../ui/IconTile';
import { formatDateTime } from '../../utils/format';
import { COLORS, tw } from '../../theme';

const VISUALS = {
  daily_challenge_published: { icon: Bell, tone: 'brand' },
  daily_challenge_reminder: { icon: Clock, tone: 'warning' },
  daily_challenge_ending_soon: { icon: TriangleAlert, tone: 'danger' },
  assignment_new: { icon: PenLine, tone: 'brand' },
  assignment_deadline: { icon: Hourglass, tone: 'warning' },
  quiz_new: { icon: Brain, tone: 'accent' },
  quiz_deadline: { icon: Hourglass, tone: 'warning' },
  course_new: { icon: BookOpen, tone: 'brand' },
  material_new: { icon: FileText, tone: 'neutral' },
  announcement: { icon: Megaphone, tone: 'brand' },
  important_announcement: { icon: Siren, tone: 'danger' },
  trainer_message: { icon: MessageCircle, tone: 'accent' },
};

export default function NotificationItem({ notification, onPress }) {
  const unread = !notification.read;
  const visual = VISUALS[notification.type] || { icon: Bell, tone: 'neutral' };

  return (
    <Card
      onPress={onPress}
      elevation="sm"
      style={[tw`mb-2.5 p-3.5`, unread ? { borderColor: COLORS.brand100, backgroundColor: COLORS.brand50 } : null]}
    >
      <View style={tw`flex-row items-start`}>
        <IconTile icon={visual.icon} tone={visual.tone} size={38} iconSize={18} />
        <View style={tw`flex-1 mx-3`}>
          <AppText variant={unread ? 'bold' : 'semiBold'} style={tw`text-sm text-slate-900`}>
            {notification.title}
          </AppText>
          <AppText style={tw`mt-1 text-[13px] leading-[19px] text-slate-600`}>{notification.message}</AppText>
          <AppText style={tw`mt-1.5 text-[11px] text-slate-500`}>{formatDateTime(notification.createdAt)}</AppText>
        </View>
        {unread ? <View style={tw`w-2 h-2 rounded-full bg-brand-600 mt-1.5`} /> : null}
      </View>
    </Card>
  );
}
