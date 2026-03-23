import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { useCoupleStore } from '../../stores/coupleStore';
import { Colors } from '../../constants/colors';

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const { couple, partnerName } = useCoupleStore();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Page</Text>

      {/* Profile Card */}
      <View style={styles.card}>
        <Text style={styles.avatar}>😊</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {couple?.user2_id && (
          <Text style={styles.coupleInfo}>
            ❤️ Connected with {partnerName ?? 'Partner'}
          </Text>
        )}
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Couple Connection</Text>
          <Text style={styles.menuValue}>
            {couple ? 'Connected' : 'Not connected'}
          </Text>
        </View>
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Notifications</Text>
          <Text style={styles.menuValue}>Coming soon</Text>
        </View>
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Language</Text>
          <Text style={styles.menuValue}>English</Text>
        </View>
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Sumone v1.0.0 (MVP)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    fontStyle: 'italic',
    marginBottom: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  avatar: {
    fontSize: 48,
    marginBottom: 12,
  },
  email: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  coupleInfo: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 8,
  },
  menu: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuText: {
    fontSize: 16,
    color: Colors.text,
  },
  menuValue: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  signOutButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: 16,
    color: Colors.error,
  },
  version: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 16,
  },
});
