import React, { useEffect, useRef, useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Lock, Mail } from '../icons';
import AppText from '../components/ui/AppText';
import AppButton from '../components/ui/AppButton';
import FormField from '../components/ui/FormField';
import { login } from '../api/user';
import { saveSession } from '../utils/authStorage';
import { registerForPushNotifications } from '../utils/pushNotifications';
import { tw } from '../theme';

const FORM_MAX_WIDTH = 440;

const LOGO = require('../../assets/C3AppLogo.png');
const REMEMBER_EMAIL_KEY = '@c3app/remember_email';
const EMAIL_PATTERN = /\S+@\S+\.\S+/;
const MIN_PASSWORD_LENGTH = 4;

function validate(email, password) {
  const errors = {};
  if (!EMAIL_PATTERN.test(email)) errors.email = 'Enter a valid email address';
  if (password.length < MIN_PASSWORD_LENGTH) errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  return errors;
}

function loginErrorMessage(err) {
  if (!err.response) return "Can't reach the server. Check your connection and try again. It may take a moment to wake up.";
  return err.response.data?.message || 'Unable to sign in right now. Please try again.';
}

function BrandHeader({ topInset }) {
  return (
    <View style={[tw`bg-ink-900 px-6 pb-20 rounded-b-3xl overflow-hidden`, { paddingTop: topInset + 28 }]}>
      <View style={tw`absolute -right-16 -top-16 w-56 h-56 rounded-full bg-brand-600 opacity-25`} />
      <View style={tw`absolute -left-20 bottom-0 w-48 h-48 rounded-full bg-brand-500 opacity-10`} />

      <View style={tw`flex-row items-center`}>
        <View style={tw`w-11 h-11 rounded-xl bg-white items-center justify-center`}>
          <Image source={LOGO} style={{ width: 34, height: 34, resizeMode: 'contain' }} />
        </View>
        <View style={tw`ml-3`}>
          <AppText variant="extraBold" style={tw`text-base text-white`}>
            C³ Institute
          </AppText>
          <AppText style={tw`text-xs text-slate-400`}>Educational Platform</AppText>
        </View>
      </View>

      <AppText variant="extraBold" style={tw`mt-8 text-[26px] leading-9 text-white`}>
        Prepare, practise and perform with confidence.
      </AppText>
      <AppText style={tw`mt-2.5 text-sm leading-5 text-slate-300`}>
        Daily challenges, practice questions and detailed results in one place.
      </AppText>
    </View>
  );
}

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const passwordRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(REMEMBER_EMAIL_KEY)
      .then((saved) => saved && setEmail(saved))
      .catch(() => {});
  }, []);

  const handleLogin = async () => {
    if (submitting) return;
    Keyboard.dismiss();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const errors = validate(normalizedEmail, normalizedPassword);
    setFieldErrors(errors);
    setFormError('');
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const session = await login(normalizedEmail, normalizedPassword);
      global.user = session;
      global.userId = session.userId;
      await saveSession(session);
      AsyncStorage.setItem(REMEMBER_EMAIL_KEY, normalizedEmail).catch(() => {});
      registerForPushNotifications(session.userId);
      navigation.replace('MainApp');
    } catch (err) {
      setFormError(loginErrorMessage(err));
      setSubmitting(false);
    }
  };

  const clearError = (field) => setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  return (
    <KeyboardAvoidingView style={tw`flex-1 bg-page`} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={tw`grow`} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <BrandHeader topInset={insets.top} />

        <View style={[tw`-mt-12 p-5 rounded-2xl bg-white border border-slate-200 shadow-md`, { maxWidth: FORM_MAX_WIDTH, alignSelf: 'center', width: '92%' }]}>
          <AppText variant="extraBold" style={tw`text-2xl text-slate-900`}>
            Sign in
          </AppText>
          <AppText style={tw`mt-1 mb-5 text-sm text-slate-500`}>Access your exam portal.</AppText>

          {formError ? (
            <View style={tw`mb-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200`} accessibilityLiveRegion="polite">
              <AppText variant="medium" style={tw`text-[13px] leading-5 text-red-700`}>
                {formError}
              </AppText>
            </View>
          ) : null}

          <FormField
            label="Email address"
            icon={Mail}
            placeholder="you@student.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              clearError('email');
            }}
            error={fieldErrors.email}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
            editable={!submitting}
          />
          <FormField
            ref={passwordRef}
            label="Password"
            icon={Lock}
            secure
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearError('password');
            }}
            error={fieldErrors.password}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={handleLogin}
            editable={!submitting}
          />

          <AppButton
            label={submitting ? 'Signing in...' : 'Sign in'}
            size="lg"
            onPress={handleLogin}
            loading={submitting}
            style={tw`mt-2 rounded-lg`}
          />

          <AppText style={tw`mt-4 text-center text-xs text-slate-500`}>
            Forgot your password? Ask your institute admin to reset it.
          </AppText>
        </View>

        <View style={[tw`items-center pt-6`, { paddingBottom: insets.bottom + 16 }]}>
          <AppText style={tw`text-xs text-slate-500`}>C³ Institute · v{Constants.expoConfig?.version || '1.0.0'}</AppText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
