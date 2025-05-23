import { CategoriesSection } from "@/modules/core/ui/sections/CategoriesSection";
import { CardAnswerSection } from "../sections/CardAnswerSection";
import { ThreadsListSection } from "../sections/ThreadsListSection";

interface MainViewProps {
  categoryId?: string;
}

export const MainView = ({ categoryId }: MainViewProps) => {
  return (
    <div className="flex flex-col gap-4 px-2">
      <CategoriesSection categoryId={categoryId} />
      <CardAnswerSection />
      <ThreadsListSection categoryId={categoryId} />
    </div>
  );
};
