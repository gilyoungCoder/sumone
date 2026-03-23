import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

const PET_MESSAGES = [
  'Have a lovely day! 💕',
  'You two are adorable!',
  'Sending warm hugs~ 🤗',
  'Love is in the air!',
  "I'm cheering for you!",
];

function getMessageOfTheDay(): string {
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return PET_MESSAGES[dayIndex % PET_MESSAGES.length];
}

interface PetCharacterProps {
  mood?: 'happy' | 'sleepy' | 'excited';
}

export function PetCharacter({ mood = 'happy' }: PetCharacterProps) {
  const petFace = mood === 'sleepy' ? '😴' : mood === 'excited' ? '🥰' : '🐰';
  const message = getMessageOfTheDay();

  return (
    <View style={styles.container}>
      {/* Room background decorations */}
      <View style={styles.room}>
        <View style={styles.windowRow}>
          <Text style={styles.decoration}>🪟</Text>
          <Text style={styles.decoration}>🌿</Text>
        </View>

        {/* Pet character */}
        <View style={styles.petWrapper}>
          <Text style={styles.pet}>{petFace}</Text>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>{message}</Text>
          </View>
        </View>

        {/* Room floor decorations */}
        <View style={styles.floorRow}>
          <Text style={styles.floorItem}>🧸</Text>
          <Text style={styles.floorItem}>📚</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 320,
  },
  room: {
    flex: 1,
    backgroundColor: Colors.surfaceWarm,
    borderRadius: 24,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  windowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  decoration: {
    fontSize: 28,
  },
  petWrapper: {
    alignItems: 'center',
  },
  pet: {
    fontSize: 72,
  },
  speechBubble: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  speechText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  floorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  floorItem: {
    fontSize: 24,
  },
});
