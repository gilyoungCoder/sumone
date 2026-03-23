import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { FALLBACK_QUESTIONS } from '../constants/questions';

interface Question {
  id: string;
  question_text: string;
  question_number: number;
}

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
  loading: boolean;
  submitting: boolean;
  fetchTodayQuestion: (coupleId: string, userId: string) => Promise<void>;
  submitAnswer: (text: string, userId: string) => Promise<void>;
  fetchPartnerAnswer: (userId: string) => Promise<void>;
}

function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  todayQuestion: null,
  loading: false,
  submitting: false,

  fetchTodayQuestion: async (coupleId, userId) => {
    set({ loading: true });
    const today = getTodayDateString();

    try {
      // 오늘 배정된 질문 조회
      const { data: existing } = await supabase
        .from('daily_questions')
        .select('*, questions(question_text, question_number)')
        .eq('couple_id', coupleId)
        .eq('assigned_date', today)
        .single();

      if (existing) {
        const question = existing.questions as unknown as Question;
        const isUser1 = existing.user1_id === userId;

        set({
          todayQuestion: {
            id: existing.id,
            couple_id: existing.couple_id,
            question_id: existing.question_id,
            question_text: question?.question_text ?? '',
            question_number: question?.question_number ?? 0,
            assigned_date: existing.assigned_date,
            my_answer: isUser1 ? existing.user1_answer : existing.user2_answer,
            partner_answer: isUser1 ? existing.user2_answer : existing.user1_answer,
            my_answered_at: isUser1 ? existing.user1_answered_at : existing.user2_answered_at,
            partner_answered_at: isUser1 ? existing.user2_answered_at : existing.user1_answered_at,
          },
          loading: false,
        });
        return;
      }

      // 오늘 질문이 없으면 새로 배정
      // 이전에 배정된 질문 수 확인
      const { count } = await supabase
        .from('daily_questions')
        .select('*', { count: 'exact', head: true })
        .eq('couple_id', coupleId);

      const nextIndex = (count ?? 0) % FALLBACK_QUESTIONS.length;

      // questions 테이블에서 다음 질문 가져오기
      const { data: nextQuestion } = await supabase
        .from('questions')
        .select('*')
        .eq('question_number', nextIndex + 1)
        .single();

      if (nextQuestion) {
        // 커플 정보 조회해서 user1_id 확인
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
          const q = newDaily.questions as unknown as Question;
          set({
            todayQuestion: {
              id: newDaily.id,
              couple_id: newDaily.couple_id,
              question_id: newDaily.question_id,
              question_text: q?.question_text ?? '',
              question_number: q?.question_number ?? 0,
              assigned_date: newDaily.assigned_date,
              my_answer: null,
              partner_answer: null,
              my_answered_at: null,
              partner_answered_at: null,
            },
            loading: false,
          });
          return;
        }
      }

      // Supabase 질문 테이블이 비었으면 폴백 사용
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
      // 오프라인 폴백
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

    // 현재 유저가 user1인지 user2인지 확인
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
      .update({
        [answerField]: text,
        [answeredAtField]: now,
      })
      .eq('id', todayQuestion.id);

    set({
      todayQuestion: {
        ...todayQuestion,
        my_answer: text,
        my_answered_at: now,
      },
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
}));
