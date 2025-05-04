import { CategoriesSection } from "../../../core/ui/sections/CategoriesSection";
import { QuestionsSection } from "../sections/QuestionsSection";

interface ForumViewProps {
  categoryId?: string;
}

export const ForumView = ({ categoryId }: ForumViewProps) => {
  return (
    <div className="mb-10 flex flex-col gap-y-6 px-4 pt-2.5">
      <CategoriesSection categoryId={categoryId} />
      <QuestionsSection />
    </div>
  );
};
