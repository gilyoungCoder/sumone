import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/authStore';
import { useCoupleStore } from '../../stores/coupleStore';
import { Colors } from '../../constants/colors';
import PetRoom from '../../components/pet/PetRoom';
import PetCharacter from '../../components/pet/PetCharacter';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const { couple, partnerName, loading, fetchCouple } = useCoupleStore();

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

  if (!couple || !couple.user2_id) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <PetCharacter />
        <Text style={styles.soloTitle}>Find your SumOne</Text>
        <Text style={styles.soloSubtitle}>
          {couple
            ? 'Waiting for your partner to join...'
            : 'Connect with your partner to start!'}
        </Text>
        <TouchableOpacity
          style={styles.connectButton}
          onPress={() => router.push('/couple/connect')}
        >
          <Text style={styles.connectButtonText}>
            {couple ? `Invite Code: ${couple.invite_code}` : 'Connect Partner \u2192'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const dDay = couple.anniversary_date
    ? Math.floor(
        (Date.now() - new Date(couple.anniversary_date).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1
    : null;

  const myName = profile?.display_name ?? 'You';
  const formatDDay = (n: number) => n.toLocaleString();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 8 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Text style={styles.coinBadge}>{'\uD83E\uDE99'} 0</Text>
          <Text style={styles.heartBadge}>{'\uD83D\uDC97'} 0</Text>
        </View>
        <View style={styles.topBarRight}>
          <Text style={styles.topBarIcon}>{'\uD83D\uDE0A'}</Text>
          <Text style={styles.topBarIcon}>{'\uD83D\uDC8C'}</Text>
          <Text style={styles.topBarIcon}>{'\uD83D\uDD14'}</Text>
        </View>
      </View>

      <View style={styles.coupleSection}>
        <View style={styles.coupleNames}>
          <Text style={styles.coupleName}>{myName}</Text>
          <Text style={styles.coupleHeart}> {'\u2764\uFE0F'} </Text>
          <Text style={styles.coupleName}>{partnerName ?? 'Partner'}</Text>
        </View>
        {dDay ? (
          <View style={styles.dDayRow}>
            <Text style={styles.dDayLabel}>{'\uC0AC\uB791\uD55C \uC9C0'} </Text>
            <Text style={styles.dDayNumber}>{formatDDay(dDay)}</Text>
            <Text style={styles.dDayLabel}>{'\uC77C \uC9F8'}</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.setDateButton}>
            <Text style={styles.setDateText}>Set your anniversary date {'\uD83D\uDC95'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.quickActions}>
        <View style={styles.quickActionBtn}>
          <Text style={styles.quickActionEmoji}>{'\uD83C\uDFAE'}</Text>
          <Text style={styles.quickActionLabel}>Game</Text>
        </View>
        <View style={styles.quickActionBtn}>
          <Text style={styles.quickActionEmoji}>{'\uD83C\uDF89'}</Text>
          <Text style={styles.quickActionLabel}>Event</Text>
        </View>
      </View>

      <PetRoom />

      <View style={styles.bottomMessage}>
        <Text style={styles.bottomText}>Collect daily pebbles! {'\uD83E\uDEA8'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  topBarLeft: {
    flexDirection: 'row',
    gap: 10,
  },
  coinBadge: {
    fontSize: 14,
    color: Colors.text,
    backgroundColor: '#FFF3D6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  heartBadge: {
    fontSize: 14,
    color: Colors.text,
    backgroundColor: '#FFE8EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  topBarRight: {
    flexDirection: 'row',
    gap: 12,
  },
  topBarIcon: {
    fontSize: 22,
  },
  coupleSection: {
    alignItems: 'flex-end',
    marginTop: 4,
    marginBottom: 8,
    paddingRight: 4,
  },
  coupleNames: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coupleName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  coupleHeart: {
    fontSize: 14,
  },
  dDayRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  dDayLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  dDayNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text,
    fontStyle: 'italic',
  },
  setDateButton: {
    marginTop: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
  },
  setDateText: {
    fontSize: 14,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  quickActionBtn: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  soloTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    fontStyle: 'italic',
    marginTop: 20,
  },
  soloSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
  },
  connectButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  bottomMessage: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
  },
  bottomText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
