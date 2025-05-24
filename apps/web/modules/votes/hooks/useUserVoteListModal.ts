import { create } from "zustand";

interface ViewListUserVoteModalState {
  isOpen: boolean;
  answerId: string | null;
  open: (answerId: string | null) => void;
  close: () => void;
  reset: () => void;
}

export const useUserVoteListModal = create<ViewListUserVoteModalState>(
  (set) => ({
    isOpen: false,
    answerId: null,
    open: (answerId) => set({ isOpen: true, answerId }),
    close: () => set({ isOpen: false }),
    reset: () => set({ isOpen: false, answerId: null }),
  }),
);
