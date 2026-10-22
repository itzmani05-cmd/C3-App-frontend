import React, { useEffect, useState } from 'react';
import { AppState, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import SplashScreen from './src/components/ui/SplashScreen';
import LockScreen from './src/components/ui/LockScreen';
import ErrorBoundary from './src/components/ui/ErrorBoundary';
import RootNavigator from './src/navigation/RootNavigator';
import useAppBootstrap from './src/hooks/useAppBootstrap';
import usePushNavigation from './src/hooks/usePushNavigation';
import { setUnauthorizedHandler } from './src/api/client';
import { clearSession } from './src/utils/authStorage';
import { clearCache } from './src/utils/offlineCache';
import { LOCK_AFTER_MS, isBiometricAvailable, isBiometricLockEnabled } from './src/utils/biometricLock';

const navigationRef = createNavigationContainerRef();

// Forget the saved login and go back to the login page (the token expired, or the student chose to log out from the lock).
async function signOut() {
  await clearSession();
  await clearCache();
  global.userId = null;
  global.user = null;
  if (navigationRef.isReady()) navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
}

async function shouldLock() {
  return Boolean(global.user) && (await isBiometricLockEnabled()) && (await isBiometricAvailable());
}

export default function App() {
  const { ready, initialRoute } = useAppBootstrap();
  const handleNavigationReady = usePushNavigation(navigationRef);
  const [splashDone, setSplashDone] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    setUnauthorizedHandler(signOut);
    return () => setUnauthorizedHandler(null);
  }, []);

  // Optional fingerprint / face lock: on a cold start, and after the app has been in the background for a while.
  useEffect(() => {
    if (!ready || initialRoute !== 'MainApp') return;
    shouldLock().then((lock) => lock && setLocked(true));
  }, [ready, initialRoute]);

  useEffect(() => {
    let leftAt = null;
    const subscription = AppState.addEventListener('change', async (state) => {
      if (state === 'background') {
        leftAt = Date.now();
        return;
      }
      if (state === 'active' && leftAt && Date.now() - leftAt > LOCK_AFTER_MS && (await shouldLock())) setLocked(true);
      if (state === 'active') leftAt = null;
    });
    return () => subscription.remove();
  }, []);

  // The app mounts as soon as it is ready and the splash fades out on top of it, so the logo intro leads straight into
  // the login page (or the home tabs for a signed-in student).
  return (
    <View style={{ flex: 1 }}>
      {ready ? (
        <ErrorBoundary>
          <SafeAreaProvider>
            <NavigationContainer ref={navigationRef} onReady={handleNavigationReady}>
              <RootNavigator initialRoute={initialRoute} />
            </NavigationContainer>
          </SafeAreaProvider>
        </ErrorBoundary>
      ) : null}
      {locked ? (
        <LockScreen
          autoPrompt={splashDone}
          onUnlock={() => setLocked(false)}
          onLogout={async () => {
            await signOut();
            setLocked(false);
          }}
        />
      ) : null}
      {splashDone ? null : <SplashScreen ready={ready} onDone={() => setSplashDone(true)} />}
    </View>
  );
}
