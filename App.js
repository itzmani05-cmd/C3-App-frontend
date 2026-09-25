import React from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import LoadingView from './src/components/ui/LoadingView';
import RootNavigator from './src/navigation/RootNavigator';
import useAppBootstrap from './src/hooks/useAppBootstrap';
import usePushNavigation from './src/hooks/usePushNavigation';
import { COLORS } from './src/theme';

const navigationRef = createNavigationContainerRef();

export default function App() {
  const { ready, initialRoute } = useAppBootstrap();
  const handleNavigationReady = usePushNavigation(navigationRef);

  if (!ready) return <LoadingView color={COLORS.blue600} style={{ backgroundColor: COLORS.white }} />;

  return (
    <NavigationContainer ref={navigationRef} onReady={handleNavigationReady}>
      <RootNavigator initialRoute={initialRoute} />
    </NavigationContainer>
  );
}
