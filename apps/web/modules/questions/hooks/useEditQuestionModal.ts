import { create } from "zustand";

interface EditQuestionModalState {
  isOpen: boolean;
  slug: string | undefined;
  open: (slug: string) => void;
  close: () => void;
  reset: () => void;
}

export const useEditQuestionModal = create<EditQuestionModalState>((set) => ({
  isOpen: false,
  slug: undefined,
  open: (slug: string) => set({ isOpen: true, slug }),
  close: () => set({ isOpen: false }),
  reset: () => set({ isOpen: false, slug: undefined }),
}));
