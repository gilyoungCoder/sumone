import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { useQuestionStore } from '../../stores/questionStore';
import { useAuthStore } from '../../stores/authStore';
import { useCoupleStore } from '../../stores/coupleStore';
import { QuestionCard } from '../../components/question/QuestionCard';

export default function QuestionsScreen() {
  const { user } = useAuthStore();
  const { couple, partnerName } = useCoupleStore();
  const {
    todayQuestion,
    pastQuestions,
    loading,
    submitting,
    fetchTodayQuestion,
    submitAnswer,
    fetchPartnerAnswer,
    fetchPastQuestions,
  } = useQuestionStore();

  const [answerText, setAnswerText] = useState('');
  const revealAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (couple?.id && user?.id) {
      fetchTodayQuestion(couple.id, user.id);
      fetchPastQuestions(couple.id, user.id);
    }
  }, [couple?.id, user?.id]);

  // After I answer, fetch partner's answer with reveal animation
  useEffect(() => {
    if (todayQuestion?.my_answer && user?.id) {
      fetchPartnerAnswer(user.id);
      Animated.timing(revealAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [todayQuestion?.my_answer]);

  const handleSubmit = async () => {
    if (!answerText.trim() || !user?.id) return;
    await submitAnswer(answerText.trim(), user.id);
    setAnswerText('');
  };

  const myName = user?.user_metadata?.display_name ?? 'Me';
  const partnerDisplayName = partnerName ?? 'Partner';
  const hasMyAnswer = !!todayQuestion?.my_answer;
  const hasPartnerAnswer = !!todayQuestion?.partner_answer;

  if (!couple) {
    return (
      <View style={styles.container}>
        <View style={styles.innerPadding}>
          <Text style={styles.header}>SumOne</Text>
          <Text style={styles.subheader}>Daily Question</Text>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>💕</Text>
            <Text style={styles.emptyText}>
              Connect with your partner to start exchanging daily questions!
            </Text>
          </View>
          <Text style={styles.emptyHint}>
            Go to the Home tab and share your invite code
          </Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.header}>SumOne</Text>
        <Text style={styles.subheader}>Daily Question</Text>

        {/* Today's Question Card */}
        {todayQuestion && (
          <QuestionCard
            questionText={todayQuestion.question_text}
            questionNumber={todayQuestion.question_number}
            date={todayQuestion.assigned_date}
            hasMyAnswer={hasMyAnswer}
            hasPartnerAnswer={hasPartnerAnswer}
          />
        )}

        {/* My Answer Section */}
        <View style={styles.answerSection}>
          <Text style={styles.answerName}>{myName}</Text>
          {hasMyAnswer ? (
            <Text style={styles.answerText}>{todayQuestion!.my_answer}</Text>
          ) : (
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Write your answer..."
                placeholderTextColor={Colors.textLight}
                value={answerText}
                onChangeText={setAnswerText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !answerText.trim() && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!answerText.trim() || submitting}
              >
                <Text style={styles.submitButtonText}>
                  {submitting ? 'Sending...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Partner Answer Section - hidden until I answer */}
        <Animated.View
          style={[
            styles.answerSection,
            !hasMyAnswer && styles.blurredSection,
            hasMyAnswer && { opacity: revealAnim },
          ]}
        >
          <Text style={styles.answerName}>{partnerDisplayName}</Text>
          {!hasMyAnswer ? (
            <Text style={styles.lockedText}>
              Answer first to see your partner's response
            </Text>
          ) : hasPartnerAnswer ? (
            <Text style={styles.answerText}>
              {todayQuestion!.partner_answer}
            </Text>
          ) : (
            <Text style={styles.waitingText}>
              {partnerDisplayName} hasn't answered yet...
            </Text>
          )}
        </Animated.View>

        {/* Action Buttons */}
        {hasMyAnswer && (
          <View style={styles.bottomButtons}>
            {!hasPartnerAnswer && (
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Nudge 👈</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Chat about this</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Past Questions */}
        {pastQuestions.length > 0 && (
          <View style={styles.pastSection}>
            <Text style={styles.pastTitle}>Past Questions</Text>
            <View style={styles.pastList}>
              {pastQuestions.map((q) => (
                <QuestionCard
                  key={q.id}
                  questionText={q.question_text}
                  questionNumber={q.question_number}
                  date={q.assigned_date}
                  hasMyAnswer={!!q.my_answer}
                  hasPartnerAnswer={!!q.partner_answer}
                  compact
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  innerPadding: { paddingHorizontal: 24, paddingTop: 80 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40 },
  header: { fontSize: 28, fontWeight: '700', color: Colors.primary, textAlign: 'center', fontStyle: 'italic' },
  subheader: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 24 },
  emptyCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  emptyEmoji: { fontSize: 32, marginBottom: 16 },
  emptyText: { fontSize: 16, fontWeight: '500', color: Colors.text, textAlign: 'center', lineHeight: 24 },
  emptyHint: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginTop: 24, lineHeight: 20 },
  answerSection: { marginTop: 24, backgroundColor: Colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: Colors.border },
  blurredSection: { opacity: 0.4 },
  answerName: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  answerText: { fontSize: 15, color: Colors.text, lineHeight: 22 },
  lockedText: { fontSize: 14, color: Colors.textLight, fontStyle: 'italic' },
  waitingText: { fontSize: 14, color: Colors.textSecondary },
  inputWrapper: { gap: 12 },
  input: { fontSize: 15, color: Colors.text, lineHeight: 22, minHeight: 80, textAlignVertical: 'top' },
  submitButton: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  submitButtonDisabled: { backgroundColor: Colors.primaryLight },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  bottomButtons: { flexDirection: 'row', gap: 12, marginTop: 24, justifyContent: 'center' },
  actionButton: { backgroundColor: Colors.surface, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 12, borderWidth: 1, borderColor: Colors.border },
  actionButtonText: { fontSize: 14, color: Colors.text, fontWeight: '500' },
  pastSection: { marginTop: 36 },
  pastTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 16 },
  pastList: { gap: 10 },
});
