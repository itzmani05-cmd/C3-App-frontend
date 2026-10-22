import React, { useRef, useState } from 'react';
import { Alert, Keyboard, View } from 'react-native';
import { Lock } from '../icons';
import AppText from '../components/ui/AppText';
import AppButton from '../components/ui/AppButton';
import Card from '../components/ui/Card';
import FormField from '../components/ui/FormField';
import Screen from '../components/ui/Screen';
import { changePassword } from '../api/user';
import { getUserId } from '../api/client';
import { COLORS, tw } from '../theme';

const MIN_PASSWORD_LENGTH = 6;

function validate({ oldPassword, newPassword, confirmPassword }) {
  const errors = {};
  if (!oldPassword) errors.oldPassword = 'Enter your current password';
  if (!newPassword) errors.newPassword = 'Enter a new password';
  else if (newPassword.length < MIN_PASSWORD_LENGTH) errors.newPassword = `Use at least ${MIN_PASSWORD_LENGTH} characters`;
  if (!confirmPassword) errors.confirmPassword = 'Confirm your new password';
  else if (newPassword && newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
}

export default function ResetPasswordScreen({ navigation }) {
  const newRef = useRef(null);
  const confirmRef = useRef(null);
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const setField = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleResetPassword = async () => {
    if (loading) return;
    Keyboard.dismiss();

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    if (!getUserId()) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const response = await changePassword(form.oldPassword, form.newPassword);
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      Alert.alert('Success', response?.message || 'Password changed successfully', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen title="Change Password" onBack={navigation.goBack} background={COLORS.appBackground}>
      <Card elevation="sm" style={tw`p-5`}>
        <AppText variant="extraBold" style={tw`text-xl text-slate-900`}>
          Update your password
        </AppText>
        <AppText style={tw`mt-1 mb-5 text-[13px] leading-5 text-slate-500`}>Use at least {MIN_PASSWORD_LENGTH} characters that you do not use elsewhere.</AppText>

        <FormField
          label="Current password"
          icon={Lock}
          secure
          placeholder="Enter current password"
          value={form.oldPassword}
          onChangeText={setField('oldPassword')}
          error={errors.oldPassword}
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => newRef.current?.focus()}
          blurOnSubmit={false}
        />
        <FormField
          ref={newRef}
          label="New password"
          icon={Lock}
          secure
          placeholder="Enter new password"
          value={form.newPassword}
          onChangeText={setField('newPassword')}
          error={errors.newPassword}
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
          blurOnSubmit={false}
        />
        <FormField
          ref={confirmRef}
          label="Confirm new password"
          icon={Lock}
          secure
          placeholder="Re-enter new password"
          value={form.confirmPassword}
          onChangeText={setField('confirmPassword')}
          error={errors.confirmPassword}
          autoCapitalize="none"
          returnKeyType="go"
          onSubmitEditing={handleResetPassword}
        />

        <View style={tw`mt-2`}>
          <AppButton label="Update password" size="lg" loading={loading} onPress={handleResetPassword} style={tw`rounded-lg`} />
        </View>
      </Card>
    </Screen>
  );
}
