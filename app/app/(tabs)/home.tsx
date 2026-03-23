import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/authStore';
import { useCoupleStore } from '../../stores/coupleStore';
import { Colors } from '../../constants/colors';
import { Card } from '../../components/ui';
import { PetCharacter } from '../../components/pet/PetCharacter';
import { DdayCounter } from '../../components/home/DdayCounter';

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const { couple, partnerName, loading, fetchCouple } = useCoupleStore();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (user) fetchCouple(user.id);
  }, [user]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // No couple connected yet
  if (!couple || !couple.user2_id) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.logo}>🏠</Text>
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

  // Determine pet mood based on time of day
  const hour = new Date().getHours();
  const petMood = hour < 7 || hour > 22 ? 'sleepy' : 'happy';

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Couple Header */}
      <Card variant="highlight" padding={20} style={styles.coupleCard}>
        <View style={styles.coupleHeader}>
          <Text style={styles.coupleEmoji}>👤</Text>
          <Text style={styles.heartIcon}>❤️</Text>
          <Text style={styles.coupleEmoji}>👤</Text>
        </View>
        <Text style={styles.coupleNames}>
          You & {partnerName ?? 'Partner'}
        </Text>
        {couple.anniversary_date && (
          <DdayCounter anniversaryDate={couple.anniversary_date} />
        )}
      </Card>

      {/* Pet Room */}
      <View style={styles.petSection}>
        <Text style={styles.sectionLabel}>Your Cozy Room</Text>
        <PetCharacter mood={petMood} />
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <Card variant="warm" padding={16} style={styles.actionCard}>
          <Text style={styles.actionEmoji}>💌</Text>
          <Text style={styles.actionLabel}>Today's Q</Text>
        </Card>
        <Card variant="warm" padding={16} style={styles.actionCard}>
          <Text style={styles.actionEmoji}>📸</Text>
          <Text style={styles.actionLabel}>Moments</Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  centered: {
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
  logo: {
    fontSize: 64,
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
  coupleCard: {
    width: '100%',
    alignItems: 'center',
  },
  coupleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  coupleEmoji: {
    fontSize: 32,
  },
  heartIcon: {
    fontSize: 20,
  },
  coupleNames: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 8,
  },
  petSection: {
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    width: '100%',
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 28,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 6,
  },
});
