import { create } from "zustand";

interface EditCommentModalState {
  isOpen: boolean;
  commentId: string | undefined;
  openModal: (commentId: string) => void;
  closeModal: () => void;
}

export const useEditCommentModal = create<EditCommentModalState>((set) => ({
  isOpen: false,
  commentId: undefined,
  openModal: (commentId) => set({ isOpen: true, commentId }),
  closeModal: () => set({ isOpen: false, commentId: undefined }),
}));
