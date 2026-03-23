import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PetCharacter from './PetCharacter';
import SpeechBubble from './SpeechBubble';
import { getRandomPetMessage } from '../../constants/messages';

interface Decoration {
  emoji: string;
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

const DECORATIONS: Decoration[] = [
  { emoji: '\uD83C\uDFD5\uFE0F', top: '12%', left: '8%', size: 28 },
  { emoji: '\uD83D\uDDBC\uFE0F', top: '8%', right: '10%', size: 26 },
  { emoji: '\uD83C\uDF08', top: '22%', left: '22%', size: 20 },
  { emoji: '\uD83C\uDFA8', top: '10%', right: '30%', size: 22 },
  { emoji: '\uD83E\uDDF8', bottom: '20%', right: '14%', size: 26 },
];

export default function PetRoom() {
  const message = useMemo(() => getRandomPetMessage(), []);

  return (
    <View style={styles.room}>
      <View style={styles.patternContainer}>
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <View
              key={`${row}-${col}`}
              style={[
                styles.patternCell,
                (row + col) % 2 === 0 && styles.patternCellAlt,
              ]}
            />
          ))
        )}
      </View>

      <View style={styles.floorLine} />

      {DECORATIONS.map((deco, i) => {
        const posStyle: any = { position: 'absolute' as const };
        if (deco.top) posStyle.top = deco.top;
        if (deco.left) posStyle.left = deco.left;
        if (deco.right) posStyle.right = deco.right;
        if (deco.bottom) posStyle.bottom = deco.bottom;
        return (
          <View key={i} style={posStyle}>
            <View style={styles.decoFrame}>
              <View style={[styles.decoInner, { width: deco.size + 12, height: deco.size + 12 }]}>
                <Text style={{ fontSize: deco.size }}>{deco.emoji}</Text>
              </View>
            </View>
          </View>
        );
      })}

      <View style={styles.petContainer}>
        <SpeechBubble message={message} />
        <PetCharacter />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  room: {
    width: '100%',
    aspectRatio: 0.85,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  patternCell: {
    width: `${100 / 6}%` as any,
    aspectRatio: 1,
    backgroundColor: '#FFF5E1',
  },
  patternCellAlt: {
    backgroundColor: '#FFECC8',
  },
  floorLine: {
    position: 'absolute',
    bottom: '30%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#F0DFC0',
  },
  decoFrame: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 10,
    padding: 4,
  },
  decoInner: {
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  petContainer: {
    position: 'absolute',
    bottom: '15%',
    alignSelf: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
  },
});
