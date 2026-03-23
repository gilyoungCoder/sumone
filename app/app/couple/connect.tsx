import { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert, Share, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import { useCoupleStore } from '../../stores/coupleStore';
import { Header, Button, Card, Input, Divider } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { AnniversaryPicker } from '../../components/AnniversaryPicker';

type Step = 'connect' | 'anniversary';

export default function ConnectScreen() {
  const [step, setStep] = useState<Step>('connect');
  const [inviteCode, setInviteCode] = useState('');
  const [myCode, setMyCode] = useState('');
  const [loading, setLoading] = useState(false);

  const user = useAuthStore((s) => s.user);
  const { createCouple, joinCouple, setAnniversary } = useCoupleStore();

  const handleCreate = async () => {
    if (!user) return;
    setLoading(true);
    const code = await createCouple(user.id);
    if (code) {
      setMyCode(code);
    } else {
      Alert.alert('Error', 'Failed to generate code. Please try again.');
    }
    setLoading(false);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on SumOne! Enter my invite code: ${myCode}`,
      });
    } catch {
      // User cancelled share
    }
  };

  const handleJoin = async () => {
    if (!user || inviteCode.length < 6) return;
    setLoading(true);
    const { error } = await joinCouple(user.id, inviteCode);
    setLoading(false);
    if (error) {
      Alert.alert('Error', error);
    } else {
      setStep('anniversary');
    }
  };

  const handleAnniversaryDone = async (date: string | null) => {
    if (date) {
      setLoading(true);
      await setAnniversary(date);
      setLoading(false);
    }
    router.replace('/(tabs)/home');
  };

  if (step === 'anniversary') {
    return (
      <View style={styles.container}>
        <Header showBack onBack={() => setStep('connect')} />
        <AnniversaryPicker
          loading={loading}
          onDone={handleAnniversaryDone}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header showBack onBack={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Connect Partner</Text>
        <Text style={styles.subtitle}>
          Share your invite code or enter your partner's code
        </Text>

        {/* Generate invite code section */}
        <Card variant="warm" padding={20} style={styles.section}>
          <Text style={styles.sectionTitle}>Create Invite Code</Text>
          {myCode ? (
            <View style={styles.codeDisplay}>
              <Text style={styles.codeText}>{myCode}</Text>
              <Text style={styles.codeHint}>Share this code with your partner</Text>
              <Button
                title="Share Code"
                onPress={handleShare}
                variant="secondary"
                size="sm"
                style={styles.shareButton}
              />
            </View>
          ) : (
            <Button
              title="Generate Code"
              onPress={handleCreate}
              loading={loading}
              disabled={loading}
            />
          )}
        </Card>

        <Divider text="OR" style={styles.divider} />

        {/* Join with code section */}
        <Card padding={20} style={styles.section}>
          <Text style={styles.sectionTitle}>Join with Code</Text>
          <Input
            placeholder="Enter 6-digit code"
            value={inviteCode}
            onChangeText={(t) => setInviteCode(t.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
            maxLength={6}
            autoCapitalize="characters"
            style={styles.codeInput}
            containerStyle={styles.inputContainer}
          />
          <Button
            title="Connect"
            onPress={handleJoin}
            variant="secondary"
            loading={loading}
            disabled={loading || inviteCode.length < 6}
          />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: 28,
  },
  section: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 14,
  },
  codeDisplay: {
    alignItems: 'center',
  },
  codeText: {
    fontSize: 36,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    letterSpacing: 8,
  },
  codeHint: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  shareButton: {
    marginTop: 16,
  },
  divider: {
    marginVertical: 20,
  },
  codeInput: {
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: FontWeight.bold,
  },
  inputContainer: {
    marginBottom: 8,
  },
});
