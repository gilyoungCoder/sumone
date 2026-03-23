import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import { useCoupleStore } from '../../stores/coupleStore';
import { Colors } from '../../constants/colors';

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const { couple, partnerName, loading, fetchCouple } = useCoupleStore();

  useEffect(() => {
    if (user) fetchCouple(user.id);
  }, [user]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // No couple connected yet
  if (!couple || !couple.user2_id) {
    return (
      <View style={styles.container}>
        <View style={styles.petArea}>
          <Text style={styles.petEmoji}>💗</Text>
        </View>
        <Text style={styles.title}>SumOne</Text>
        <Text style={styles.subtitle}>
          {couple
            ? 'Waiting for your partner to join...'
            : 'Connect with your partner to start!'}
        </Text>
        <Text
          style={styles.connectButton}
          onPress={() => router.push('/couple/connect')}
        >
          {couple ? `Invite Code: ${couple.invite_code}` : 'Connect Partner →'}
        </Text>
      </View>
    );
  }

  // Calculate D-day
  const dDay = couple.anniversary_date
    ? Math.floor(
        (Date.now() - new Date(couple.anniversary_date).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1
    : null;

  return (
    <View style={styles.container}>
      {/* Couple Header */}
      <View style={styles.header}>
        <Text style={styles.coupleText}>
          You ❤️ {partnerName ?? 'Partner'}
        </Text>
        {dDay && (
          <Text style={styles.dDay}>
            Day <Text style={styles.dDayNumber}>{dDay}</Text>
          </Text>
        )}
      </View>

      {/* Pet Area */}
      <View style={styles.petArea}>
        <View style={styles.petRoom}>
          <Text style={styles.petEmoji}>💗</Text>
          <Text style={styles.petMessage}>Have a great day!</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  coupleText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  dDay: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  dDayNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    fontStyle: 'italic',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    fontStyle: 'italic',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  connectButton: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    backgroundColor: Colors.surface,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    overflow: 'hidden',
  },
  petArea: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 320,
  },
  petRoom: {
    flex: 1,
    backgroundColor: Colors.surfaceWarm,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petEmoji: {
    fontSize: 80,
  },
  petMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
  },
});
