interface HomeTemplateProps {
  children: React.ReactNode;
}
const HomeTemplate = async ({ children }: HomeTemplateProps) => {
  return <>{children}</>;
};

export default HomeTemplate;
