import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import { useCoupleStore } from '../../stores/coupleStore';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { Avatar, CoupleAvatar } from '../../components/ui/Avatar';
import { Divider } from '../../components/ui/Divider';
import { Button } from '../../components/ui/Button';

function MenuItem({ icon, label, value, onPress }: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.menuLeft}>
        <Text style={styles.menuIcon}>{icon}</Text>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Text style={styles.menuValue}>{value ?? ''}</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const { couple, partnerName } = useCoupleStore();
  const router = useRouter();

  const displayName = user?.user_metadata?.display_name ?? user?.email?.split('@')[0] ?? 'You';
  const isConnected = !!couple?.user2_id;

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  const anniversaryText = couple?.anniversary_date
    ? new Date(couple.anniversary_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not set';

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Card variant="highlight" padding={24} style={styles.profileCard}>
          {isConnected ? (
            <CoupleAvatar emoji1="😊" emoji2="😄" size="lg" />
          ) : (
            <Avatar emoji="😊" size="lg" />
          )}
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {isConnected && (
            <View style={styles.coupleTag}>
              <Text style={styles.coupleTagText}>
                💕 with {partnerName ?? 'Partner'}
              </Text>
            </View>
          )}
        </Card>

        {/* Couple Info */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Couple</Text>
          <Divider />
          <MenuItem
            icon="💑"
            label="Status"
            value={isConnected ? 'Connected' : 'Not connected'}
            onPress={!isConnected ? () => router.push('/couple/connect') : undefined}
          />
          <MenuItem
            icon="📅"
            label="Anniversary"
            value={anniversaryText}
          />
          {couple?.invite_code && (
            <MenuItem
              icon="🔑"
              label="Invite Code"
              value={couple.invite_code}
            />
          )}
        </Card>

        {/* Settings */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Divider />
          <MenuItem icon="🔔" label="Notifications" value="Coming soon" />
          <MenuItem icon="🌐" label="Language" value="English" />
          <MenuItem icon="🎨" label="Theme" value="Default" />
        </Card>

        {/* Sign Out */}
        <Button
          title="Sign Out"
          variant="ghost"
          onPress={handleSignOut}
          textStyle={{ color: Colors.error }}
          style={styles.signOutBtn}
        />

        <Text style={styles.version}>Sumone v1.0.0 (MVP)</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 16,
  },
  displayName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginTop: 12,
  },
  email: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  coupleTag: {
    marginTop: 12,
    backgroundColor: Colors.primaryLight + '40',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  coupleTagText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuLabel: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
  menuValue: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  signOutBtn: {
    marginTop: 8,
  },
  version: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 16,
  },
});
