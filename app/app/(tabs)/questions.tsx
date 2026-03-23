import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

export default function QuestionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>SumOne</Text>
      <Text style={styles.subheader}>Daily Question</Text>
      <View style={styles.card}>
        <Text style={styles.hearts}>💕💕</Text>
        <Text style={styles.question}>
          What's one small thing your partner does that always makes you smile?
        </Text>
        <Text style={styles.meta}>#1 Question · Coming soon</Text>
      </View>
      <Text style={styles.placeholder}>
        Connect with your partner to start answering daily questions together!
      </Text>
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
    color: Colors.primary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  subheader: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hearts: {
    fontSize: 32,
    marginBottom: 16,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  meta: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 16,
  },
  placeholder: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 20,
  },
});
