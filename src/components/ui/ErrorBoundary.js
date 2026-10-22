import React from 'react';
import { View } from 'react-native';
import AppText from './AppText';
import AppButton from './AppButton';
import { tw } from '../../theme';

// Last line of defence: a render error in any screen shows this instead of a blank crash.
export default class ErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.log('Unhandled render error:', error?.message || error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <View style={tw`flex-1 items-center justify-center bg-white px-8`}>
        <AppText variant="extraBold" style={tw`text-xl text-slate-900 text-center`}>
          Something went wrong
        </AppText>
        <AppText style={tw`mt-2 text-sm text-slate-500 text-center`}>The app hit an unexpected problem. Please try again.</AppText>
        <AppButton label="Reload" onPress={() => this.setState({ failed: false })} style={tw`mt-5 px-8`} />
      </View>
    );
  }
}
