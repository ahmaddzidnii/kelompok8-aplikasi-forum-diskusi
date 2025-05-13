import { withAuthServerSide } from "@/modules/auth/function/withAuthServerSide";

interface QuestionLayoutProps {
  children: React.ReactNode;
}
const QuestionLayout = ({ children }: QuestionLayoutProps) => {
  return <>{children}</>;
};

export default withAuthServerSide(QuestionLayout);
