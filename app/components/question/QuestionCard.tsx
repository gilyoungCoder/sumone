import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface QuestionCardProps {
  questionText: string;
  questionNumber: number;
  date: string;
  hasMyAnswer: boolean;
  hasPartnerAnswer: boolean;
  // For past questions list - compact mode
  compact?: boolean;
}

export function QuestionCard({
  questionText,
  questionNumber,
  date,
  hasMyAnswer,
  hasPartnerAnswer,
  compact = false,
}: QuestionCardProps) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (compact) {
    return (
      <View style={styles.compactCard}>
        <View style={styles.compactLeft}>
          <Text style={styles.compactNumber}>#{questionNumber}</Text>
          <View style={styles.compactContent}>
            <Text style={styles.compactQuestion} numberOfLines={2}>
              {questionText}
            </Text>
            <Text style={styles.compactDate}>{formatDate(date)}</Text>
          </View>
        </View>
        <View style={styles.compactHearts}>
          <Text style={styles.compactHeart}>
            {hasMyAnswer ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.compactHeart}>
            {hasPartnerAnswer ? '❤️' : '🤍'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.heartsRow}>
        <Text style={styles.heartIcon}>{hasMyAnswer ? '❤️' : '🤍'}</Text>
        <Text style={styles.heartIcon}>
          {hasPartnerAnswer ? '❤️' : '🤍'}
        </Text>
      </View>
      <Text style={styles.question}>{questionText}</Text>
      <Text style={styles.meta}>
        Question #{questionNumber} · {formatDate(date)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Full card (today's question)
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heartsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 16,
  },
  heartIcon: {
    fontSize: 32,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 30,
  },
  meta: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 16,
  },

  // Compact card (past questions list)
  compactCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  compactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  compactNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 12,
    minWidth: 28,
  },
  compactContent: {
    flex: 1,
  },
  compactQuestion: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    lineHeight: 20,
  },
  compactDate: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 4,
  },
  compactHearts: {
    flexDirection: 'row',
    gap: 2,
  },
  compactHeart: {
    fontSize: 14,
  },
});
