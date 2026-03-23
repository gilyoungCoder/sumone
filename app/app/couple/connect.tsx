import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import { useCoupleStore } from '../../stores/coupleStore';
import { Colors } from '../../constants/colors';

export default function ConnectScreen() {
  const [inviteCode, setInviteCode] = useState('');
  const [myCode, setMyCode] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((s) => s.user);
  const { createCouple, joinCouple } = useCoupleStore();

  const handleCreate = async () => {
    if (!user) return;
    setLoading(true);
    const code = await createCouple(user.id);
    setMyCode(code);
    setLoading(false);
  };

  const handleJoin = async () => {
    if (!user || !inviteCode) return;
    setLoading(true);
    const { error } = await joinCouple(user.id, inviteCode);
    setLoading(false);
    if (error) {
      Alert.alert('Error', error);
    } else {
      Alert.alert('Connected! 💕', 'You are now linked with your partner!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/home') },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Connect Partner</Text>
      <Text style={styles.subtitle}>
        Share your invite code or enter your partner's code
      </Text>

      {/* Create invite code */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create Invite Code</Text>
        {myCode ? (
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{myCode}</Text>
            <Text style={styles.codeHint}>Share this code with your partner</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={handleCreate}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Generate Code</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Join with code */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Join with Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter 6-digit code"
          placeholderTextColor={Colors.textLight}
          value={inviteCode}
          onChangeText={(t) => setInviteCode(t.toUpperCase())}
          maxLength={6}
          autoCapitalize="characters"
        />
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleJoin}
          disabled={loading || inviteCode.length < 6}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            Connect
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  codeBox: {
    backgroundColor: Colors.surfaceWarm,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  codeText: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 8,
  },
  codeHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 24,
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonSecondary: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: Colors.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: Colors.textLight,
  },
});
