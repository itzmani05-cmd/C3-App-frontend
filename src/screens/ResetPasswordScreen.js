import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { Lock } from 'lucide-react-native';
import AppText from '../components/ui/AppText';
import AppButton from '../components/ui/AppButton';
import BrandLogo from '../components/ui/BrandLogo';
import FormField from '../components/ui/FormField';
import { changePassword } from '../api/user';
import { getUserId } from '../api/client';
import { COLORS } from '../theme';

const MIN_PASSWORD_LENGTH = 6;

function validate({ oldPassword, newPassword, confirmPassword }) {
  if (!oldPassword || !newPassword || !confirmPassword) return 'Please fill in all fields';
  if (newPassword !== confirmPassword) return 'New password and confirm password do not match';
  if (newPassword.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`;
  if (!getUserId()) return 'User not authenticated';
  return null;
}

export default function ResetPasswordScreen({ navigation }) {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const setField = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleResetPassword = async () => {
    const error = validate(form);
    if (error) {
      Alert.alert('Error', error);
      return;
    }

    setLoading(true);
    try {
      const response = await changePassword(form.oldPassword, form.newPassword);
      Alert.alert('Success', response?.message || 'Password changed successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: COLORS.authBackground }}>
      <BrandLogo style={{ flex: 1, marginBottom: 10 }} />

      <View style={{ marginTop: 10, flex: 1 }}>
        <AppText variant="bold" style={{ color: COLORS.black, fontSize: 20 }}>
          Reset Password
        </AppText>
        <AppText style={{ color: COLORS.gray500, marginTop: 5, marginBottom: 30, fontSize: 14 }}>
          At least {MIN_PASSWORD_LENGTH} characters.
        </AppText>

        <FormField icon={Lock} secure placeholder="Old Password" value={form.oldPassword} onChangeText={setField('oldPassword')} style={fieldStyle} />
        <FormField icon={Lock} secure placeholder="New Password" value={form.newPassword} onChangeText={setField('newPassword')} style={fieldStyle} />
        <FormField
          icon={Lock}
          secure
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChangeText={setField('confirmPassword')}
          style={[fieldStyle, { marginBottom: 15 }]}
        />

        <AppButton label="Reset Password" size="lg" loading={loading} onPress={handleResetPassword} style={{ marginTop: 15 }} />
      </View>
    </View>
  );
}

const fieldStyle = {
  borderRadius: 8,
};
