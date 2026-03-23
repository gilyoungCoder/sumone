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

export default function QuestionsScreen() {
  const { user } = useAuthStore();
  const { couple, partnerName } = useCoupleStore();
  const {
    todayQuestion,
    loading,
    submitting,
    fetchTodayQuestion,
    submitAnswer,
    fetchPartnerAnswer,
  } = useQuestionStore();

  const [answerText, setAnswerText] = useState('');
  const revealAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (couple?.id && user?.id) {
      fetchTodayQuestion(couple.id, user.id);
    }
  }, [couple?.id, user?.id]);

  // 내가 답변하면 파트너 답변 fetch + reveal 애니메이션
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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const myName = user?.user_metadata?.display_name ?? '나';
  const partnerDisplayName = partnerName ?? '상대방';
  const hasMyAnswer = !!todayQuestion?.my_answer;
  const hasPartnerAnswer = !!todayQuestion?.partner_answer;

  if (!couple) {
    return (
      <View style={styles.container}>
        <View style={styles.innerPadding}>
          <Text style={styles.header}>SumOne</Text>
          <Text style={styles.subheader}>Daily Question</Text>
          <View style={styles.card}>
            <Text style={styles.hearts}>💕💕</Text>
            <Text style={styles.question}>
              커플 연결 후 매일 질문을 주고받을 수 있어요!
            </Text>
          </View>
          <Text style={styles.emptyHint}>
            홈 탭에서 초대 코드를 공유하고 파트너와 연결하세요
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

        {/* Question Card */}
        <View style={styles.card}>
          {/* Hearts */}
          <View style={styles.heartsRow}>
            <Text style={styles.heartIcon}>
              {hasMyAnswer ? '❤️' : '🤍'}
            </Text>
            <Text style={styles.heartIcon}>
              {hasPartnerAnswer ? '❤️' : '🤍'}
            </Text>
          </View>

          {/* Question */}
          <Text style={styles.question}>
            {todayQuestion?.question_text ?? '질문을 불러오는 중...'}
          </Text>

          {/* Meta */}
          <Text style={styles.meta}>
            #{todayQuestion?.question_number ?? 0}번째 질문 · {todayQuestion ? formatDate(todayQuestion.assigned_date) : ''}
          </Text>
        </View>

        {/* My Answer Section */}
        <View style={styles.answerSection}>
          <Text style={styles.answerName}>{myName}</Text>
          {hasMyAnswer ? (
            <Text style={styles.answerText}>{todayQuestion!.my_answer}</Text>
          ) : (
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="당신의 답변을 적어주세요..."
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
                  {submitting ? '보내는 중...' : '답변하기'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Partner Answer Section */}
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
              먼저 답변해야 상대방의 답변을 볼 수 있어요
            </Text>
          ) : hasPartnerAnswer ? (
            <Text style={styles.answerText}>{todayQuestion!.partner_answer}</Text>
          ) : (
            <Text style={styles.waitingText}>
              {partnerDisplayName}은(는) 아직 답변하지 않았어요...
            </Text>
          )}
        </Animated.View>

        {/* Bottom Buttons */}
        {hasMyAnswer && (
          <View style={styles.bottomButtons}>
            {!hasPartnerAnswer && (
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>쿡 찌르기 👈</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>이 주제로 대화 나누기</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  innerPadding: {
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
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
    marginBottom: 24,
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
  answerSection: {
    marginTop: 24,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  blurredSection: {
    opacity: 0.4,
  },
  answerName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  answerText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  lockedText: {
    fontSize: 14,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  waitingText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  inputWrapper: {
    gap: 12,
  },
  input: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.primaryLight,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  emptyHint: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 20,
  },
});
