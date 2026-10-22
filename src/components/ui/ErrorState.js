import React from 'react';
import { View } from 'react-native';
import AppText from './AppText';
import AppButton from './AppButton';
import Illustration from './Illustration';
import { tw } from '../../theme';

export default function ErrorState({ message = 'Something went wrong. Please check your connection and try again.', onRetry, style }) {
  return (
    <View style={[tw`flex-1 items-center justify-center px-8`, style]}>
      <Illustration kind="offline" size={140} />
      <AppText type="heading" style={tw`mt-3 text-slate-900 text-center`}>
        Couldn't load this
      </AppText>
      <AppText type="small" style={tw`mt-1.5 leading-5 text-slate-500 text-center`}>
        {message}
      </AppText>
      {onRetry ? <AppButton label="Try again" onPress={onRetry} style={tw`mt-5 px-8`} /> : null}
    </View>
  );
}
