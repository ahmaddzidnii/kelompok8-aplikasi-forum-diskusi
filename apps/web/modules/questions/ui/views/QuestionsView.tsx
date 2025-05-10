import { QuestionsList } from "../components/QuestionList";

export const QuestionsView = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">
        Daftar pertanyaan yang anda tanyakan
      </h1>
      <QuestionsList />
    </div>
  );
};
