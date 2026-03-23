import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { FALLBACK_QUESTIONS } from '../constants/questions';

interface DailyQuestion {
  id: string;
  couple_id: string;
  question_id: string;
  question_text: string;
  question_number: number;
  assigned_date: string;
  my_answer: string | null;
  partner_answer: string | null;
  my_answered_at: string | null;
  partner_answered_at: string | null;
}

interface QuestionState {
  todayQuestion: DailyQuestion | null;
  pastQuestions: DailyQuestion[];
  loading: boolean;
  submitting: boolean;
  fetchTodayQuestion: (coupleId: string, userId: string) => Promise<void>;
  submitAnswer: (text: string, userId: string) => Promise<void>;
  fetchPartnerAnswer: (userId: string) => Promise<void>;
  fetchPastQuestions: (coupleId: string, userId: string) => Promise<void>;
}

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

// Maps a raw daily_questions row into our DailyQuestion shape
function mapDailyQuestion(
  row: any,
  userId: string,
  questionText: string,
  questionNumber: number,
): DailyQuestion {
  const isUser1 = row.user1_id === userId;
  return {
    id: row.id,
    couple_id: row.couple_id,
    question_id: row.question_id,
    question_text: questionText,
    question_number: questionNumber,
    assigned_date: row.assigned_date,
    my_answer: isUser1 ? row.user1_answer : row.user2_answer,
    partner_answer: isUser1 ? row.user2_answer : row.user1_answer,
    my_answered_at: isUser1 ? row.user1_answered_at : row.user2_answered_at,
    partner_answered_at: isUser1 ? row.user2_answered_at : row.user1_answered_at,
  };
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  todayQuestion: null,
  pastQuestions: [],
  loading: false,
  submitting: false,

  fetchTodayQuestion: async (coupleId, userId) => {
    set({ loading: true });
    const today = getTodayDateString();

    try {
      // Check if today's question already exists
      const { data: existing } = await supabase
        .from('daily_questions')
        .select('*, questions(question_text, question_number)')
        .eq('couple_id', coupleId)
        .eq('assigned_date', today)
        .single();

      if (existing) {
        const q = existing.questions as any;
        set({
          todayQuestion: mapDailyQuestion(
            existing, userId,
            q?.question_text ?? '', q?.question_number ?? 0,
          ),
          loading: false,
        });
        return;
      }

      // No question today - assign a new one
      const { count } = await supabase
        .from('daily_questions')
        .select('*', { count: 'exact', head: true })
        .eq('couple_id', coupleId);

      const nextIndex = (count ?? 0) % FALLBACK_QUESTIONS.length;

      const { data: nextQuestion } = await supabase
        .from('questions')
        .select('*')
        .eq('question_number', nextIndex + 1)
        .single();

      if (nextQuestion) {
        const { data: couple } = await supabase
          .from('couples')
          .select('user1_id, user2_id')
          .eq('id', coupleId)
          .single();

        const { data: newDaily } = await supabase
          .from('daily_questions')
          .insert({
            couple_id: coupleId,
            question_id: nextQuestion.id,
            assigned_date: today,
            user1_id: couple?.user1_id,
            user2_id: couple?.user2_id,
          })
          .select('*, questions(question_text, question_number)')
          .single();

        if (newDaily) {
          const q = newDaily.questions as any;
          set({
            todayQuestion: mapDailyQuestion(
              newDaily, userId,
              q?.question_text ?? '', q?.question_number ?? 0,
            ),
            loading: false,
          });
          return;
        }
      }

      // Fallback when questions table is empty
      set({
        todayQuestion: {
          id: 'fallback',
          couple_id: coupleId,
          question_id: 'fallback',
          question_text: FALLBACK_QUESTIONS[nextIndex],
          question_number: nextIndex + 1,
          assigned_date: today,
          my_answer: null,
          partner_answer: null,
          my_answered_at: null,
          partner_answered_at: null,
        },
        loading: false,
      });
    } catch {
      // Offline fallback - pick question based on day of year
      const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
      );
      const index = dayOfYear % FALLBACK_QUESTIONS.length;

      set({
        todayQuestion: {
          id: 'fallback',
          couple_id: coupleId,
          question_id: 'fallback',
          question_text: FALLBACK_QUESTIONS[index],
          question_number: index + 1,
          assigned_date: today,
          my_answer: null,
          partner_answer: null,
          my_answered_at: null,
          partner_answered_at: null,
        },
        loading: false,
      });
    }
  },

  submitAnswer: async (text, userId) => {
    const { todayQuestion } = get();
    if (!todayQuestion || todayQuestion.id === 'fallback') return;

    set({ submitting: true });

    const { data: daily } = await supabase
      .from('daily_questions')
      .select('user1_id')
      .eq('id', todayQuestion.id)
      .single();

    const isUser1 = daily?.user1_id === userId;
    const answerField = isUser1 ? 'user1_answer' : 'user2_answer';
    const answeredAtField = isUser1 ? 'user1_answered_at' : 'user2_answered_at';

    const now = new Date().toISOString();
    await supabase
      .from('daily_questions')
      .update({ [answerField]: text, [answeredAtField]: now })
      .eq('id', todayQuestion.id);

    set({
      todayQuestion: { ...todayQuestion, my_answer: text, my_answered_at: now },
      submitting: false,
    });
  },

  fetchPartnerAnswer: async (userId) => {
    const { todayQuestion } = get();
    if (!todayQuestion || todayQuestion.id === 'fallback') return;

    const { data } = await supabase
      .from('daily_questions')
      .select('user1_id, user1_answer, user2_answer, user1_answered_at, user2_answered_at')
      .eq('id', todayQuestion.id)
      .single();

    if (data) {
      const isUser1 = data.user1_id === userId;
      set({
        todayQuestion: {
          ...todayQuestion,
          partner_answer: isUser1 ? data.user2_answer : data.user1_answer,
          partner_answered_at: isUser1 ? data.user2_answered_at : data.user1_answered_at,
        },
      });
    }
  },

  fetchPastQuestions: async (coupleId, userId) => {
    const today = getTodayDateString();

    try {
      const { data } = await supabase
        .from('daily_questions')
        .select('*, questions(question_text, question_number)')
        .eq('couple_id', coupleId)
        .lt('assigned_date', today)
        .order('assigned_date', { ascending: false })
        .limit(20);

      if (data) {
        const mapped = data.map((row: any) => {
          const q = row.questions as any;
          return mapDailyQuestion(
            row, userId,
            q?.question_text ?? '', q?.question_number ?? 0,
          );
        });
        set({ pastQuestions: mapped });
      }
    } catch {
      set({ pastQuestions: [] });
    }
  },
}));
