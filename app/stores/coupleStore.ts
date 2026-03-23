import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Couple {
  id: string;
  user1_id: string;
  user2_id: string | null;
  invite_code: string;
  anniversary_date: string | null;
  created_at: string;
}

interface CoupleState {
  couple: Couple | null;
  partnerName: string | null;
  loading: boolean;
  fetchCouple: (userId: string) => Promise<void>;
  createCouple: (userId: string) => Promise<string>; // returns invite code
  joinCouple: (userId: string, inviteCode: string) => Promise<{ error: string | null }>;
  setAnniversary: (date: string) => Promise<void>;
}

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const useCoupleStore = create<CoupleState>((set, get) => ({
  couple: null,
  partnerName: null,
  loading: true,

  fetchCouple: async (userId) => {
    set({ loading: true });
    const { data } = await supabase
      .from('couples')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .single();

    if (data) {
      const partnerId = data.user1_id === userId ? data.user2_id : data.user1_id;
      let partnerName = null;
      if (partnerId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', partnerId)
          .single();
        partnerName = profile?.display_name ?? null;
      }
      set({ couple: data, partnerName, loading: false });
    } else {
      set({ couple: null, partnerName: null, loading: false });
    }
  },

  createCouple: async (userId) => {
    const inviteCode = generateInviteCode();
    const { data } = await supabase
      .from('couples')
      .insert({ user1_id: userId, invite_code: inviteCode })
      .select()
      .single();

    if (data) {
      set({ couple: data });
      await supabase
        .from('profiles')
        .update({ couple_id: data.id })
        .eq('id', userId);
    }
    return inviteCode;
  },

  joinCouple: async (userId, inviteCode) => {
    const { data: couple } = await supabase
      .from('couples')
      .select('*')
      .eq('invite_code', inviteCode.toUpperCase())
      .is('user2_id', null)
      .single();

    if (!couple) {
      return { error: 'Invalid or expired invite code' };
    }
    if (couple.user1_id === userId) {
      return { error: "You can't join your own couple" };
    }

    const { error } = await supabase
      .from('couples')
      .update({ user2_id: userId })
      .eq('id', couple.id);

    if (error) return { error: error.message };

    await supabase
      .from('profiles')
      .update({ couple_id: couple.id })
      .eq('id', userId);

    set({ couple: { ...couple, user2_id: userId } });
    return { error: null };
  },

  setAnniversary: async (date) => {
    const couple = get().couple;
    if (!couple) return;

    await supabase
      .from('couples')
      .update({ anniversary_date: date })
      .eq('id', couple.id);

    set({ couple: { ...couple, anniversary_date: date } });
  },
}));
