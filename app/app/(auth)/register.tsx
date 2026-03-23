import { useState } from 'react';
import {
  View, Text, StyleSheet,
  KeyboardAvoidingView, Platform, Alert,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import { Button, Input } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const signUp = useAuthStore((s) => s.signUp);

  const validate = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = 'Name is required';
    if (!email.trim()) next.email = 'Email is required';
    if (!password) next.password = 'Password is required';
    else if (password.length < 6) next.password = 'Must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const clearError = (field: keyof typeof errors) => {
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    const { error } = await signUp(email.trim(), password, name.trim());
    setLoading(false);

    if (error) {
      Alert.alert('Sign up failed', error);
      return;
    }

    Alert.alert('Welcome!', 'Please check your email to verify your account.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>SumOne</Text>
        <Text style={styles.subtitle}>Start your love story</Text>

        <View style={styles.form}>
          <Input
            label="Your name"
            placeholder="How should we call you?"
            value={name}
            onChangeText={(t) => { setName(t); clearError('name'); }}
            autoCapitalize="words"
            autoComplete="name"
            error={errors.name}
          />
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={(t) => { setEmail(t); clearError('email'); }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
          />
          <Input
            label="Password"
            placeholder="6+ characters"
            value={password}
            onChangeText={(t) => { setPassword(t); clearError('password'); }}
            secureTextEntry
            autoComplete="new-password"
            error={errors.password}
          />

          <Button
            title={loading ? 'Creating account...' : 'Create Account'}
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            size="lg"
          />
        </View>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>
              Already have an account?{' '}
              <Text style={styles.linkBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  logo: {
    fontSize: 42,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 48,
  },
  form: {
    gap: 4,
  },
  linkButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  linkBold: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
});
