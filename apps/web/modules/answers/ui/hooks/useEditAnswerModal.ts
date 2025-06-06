import { create } from "zustand";

interface EditAnswerModalState {
  isOpen: boolean;
  answerId: string | undefined;
  answerContent: any;
  questionContent?: string;
  // Alternatif penamaan yang lebih spesifik:
  openEditModal: ({
    answerId,
    answerContent,
    questionContent,
  }: {
    answerId: string;
    answerContent?: any;
    questionContent: string;
  }) => void;
  closeEditModal: () => void;
}

export const useEditAnswerModal = create<EditAnswerModalState>((set) => ({
  isOpen: false,
  answerId: undefined,
  answerContent: undefined,
  questionContent: undefined,

  openEditModal: ({ answerId, questionContent, answerContent }) =>
    set({
      isOpen: true,
      answerId,
      answerContent,
      questionContent,
    }),

  closeEditModal: () =>
    set({
      isOpen: false,
      answerId: undefined,
      questionContent: undefined,
      answerContent: undefined,
    }),
}));
