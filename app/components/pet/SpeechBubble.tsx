import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface SpeechBubbleProps {
  message: string;
}

export default function SpeechBubble({ message }: SpeechBubbleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{message}</Text>
      </View>
      <View style={styles.tail} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 4,
  },
  bubble: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 13,
    color: Colors.text,
    textAlign: 'center',
  },
  tail: {
    width: 12,
    height: 12,
    backgroundColor: Colors.surface,
    transform: [{ rotate: '45deg' }],
    marginTop: -7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
