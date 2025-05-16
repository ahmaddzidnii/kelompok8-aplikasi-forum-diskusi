import { create } from "zustand";

interface AnswerModalStore {
  isOpen: boolean;
  questionId: string | undefined;
  questionContent: string | undefined;
  open: ({
    questionId,
    questionContent,
  }: {
    questionId: string;
    questionContent: string;
  }) => void;
  close: () => void;
}

export const useAnswerModalStore = create<AnswerModalStore>((set) => ({
  isOpen: false,
  questionId: undefined,
  questionContent: undefined,
  open: (question) =>
    set({
      isOpen: true,
      questionId: question.questionId,
      questionContent: question.questionContent,
    }),
  close: () =>
    set({ isOpen: false, questionId: undefined, questionContent: undefined }),
}));
