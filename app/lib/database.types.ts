export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          profile_image: string | null;
          couple_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          profile_image?: string | null;
          couple_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          profile_image?: string | null;
          couple_id?: string | null;
          created_at?: string;
        };
      };
      couples: {
        Row: {
          id: string;
          user1_id: string;
          user2_id: string | null;
          invite_code: string;
          anniversary_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user1_id: string;
          user2_id?: string | null;
          invite_code: string;
          anniversary_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user1_id?: string;
          user2_id?: string | null;
          invite_code?: string;
          anniversary_date?: string | null;
          created_at?: string;
        };
      };
      questions: {
        Row: {
          id: number;
          text: string;
          category: string;
          sort_order: number;
        };
        Insert: {
          id?: number;
          text: string;
          category?: string;
          sort_order: number;
        };
        Update: {
          id?: number;
          text?: string;
          category?: string;
          sort_order?: number;
        };
      };
      daily_questions: {
        Row: {
          id: string;
          couple_id: string;
          question_id: number;
          assigned_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          question_id: number;
          assigned_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          couple_id?: string;
          question_id?: number;
          assigned_date?: string;
          created_at?: string;
        };
      };
      answers: {
        Row: {
          id: string;
          daily_question_id: string;
          user_id: string;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          daily_question_id: string;
          user_id: string;
          text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          daily_question_id?: string;
          user_id?: string;
          text?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_my_couple_id: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: Record<string, never>;
  };
}
