interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // return <AppLayout>{children}</AppLayout>;
  return <div>{children}</div>;
};

export default Layout;
