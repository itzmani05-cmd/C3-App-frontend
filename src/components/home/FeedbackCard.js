import React from 'react';
import { View } from 'react-native';
import { MessageCircle } from '../../icons';
import AppText from '../ui/AppText';
import AppButton from '../ui/AppButton';
import Card from '../ui/Card';
import IconTile from '../ui/IconTile';
import { tw } from '../../theme';

// The last thing on Home: an invitation to tell the team what to improve.
export default function FeedbackCard({ onPress }) {
  return (
    <View style={tw`px-4 mt-6`}>
      <Card elevation="sm">
        <View style={tw`flex-row items-center`}>
          <IconTile icon={MessageCircle} tone="brand" />
          <View style={tw`flex-1 ml-3`}>
            <AppText type="heading" style={tw`text-slate-900`}>
              Enjoying C³ Institute?
            </AppText>
            <AppText type="small" style={tw`mt-0.5 text-slate-500`}>
              Tell us what works and what to improve. It takes a minute.
            </AppText>
          </View>
        </View>
        <AppButton label="Give feedback" tone="secondary" onPress={onPress} style={tw`mt-4`} />
      </Card>
    </View>
  );
}
