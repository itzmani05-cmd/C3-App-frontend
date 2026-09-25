import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { Lock, Mail } from 'lucide-react-native';
import AppText from '../components/ui/AppText';
import AppButton from '../components/ui/AppButton';
import BrandLogo from '../components/ui/BrandLogo';
import FormField from '../components/ui/FormField';
import { login } from '../api/user';
import { saveSession } from '../utils/authStorage';
import { registerForPushNotifications } from '../utils/pushNotifications';
import { COLORS } from '../theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      Alert.alert('Login Failed', 'Enter both email and password');
      return;
    }

    setSubmitting(true);
    try {
      const session = await login(normalizedEmail, normalizedPassword);
      global.user = session;
      global.userId = session.userId;
      await saveSession(session);
      registerForPushNotifications(session.userId);
      navigation.replace('MainApp');
    } catch (err) {
      Alert.alert('Login Failed', err.response?.data?.message || 'Unable to log in right now');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={containerStyle} keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1, paddingTop: 30 }}>
            <BrandLogo style={{ height: 245, marginBottom: 50, marginTop: 40 }} />

            <AppText variant="bold" style={{ fontSize: 20, marginBottom: 3, marginTop: 50 }}>
              Welcome back!
            </AppText>
            <AppText style={{ color: COLORS.gray500, fontSize: 14, marginBottom: 15 }}>Student Login</AppText>

            <FormField
              icon={Mail}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <FormField icon={Lock} secure placeholder="Password" value={password} onChangeText={setPassword} style={{ marginBottom: 15 }} />

            <AppButton
              label={submitting ? 'Logging in...' : 'Login'}
              size="lg"
              onPress={handleLogin}
              disabled={submitting}
              style={[{ marginVertical: 15 }, submitting ? { backgroundColor: COLORS.blue300, opacity: 1 } : null]}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const containerStyle = {
  flexGrow: 1,
  paddingHorizontal: 20,
  paddingTop: 40,
  backgroundColor: COLORS.authBackground,
};
