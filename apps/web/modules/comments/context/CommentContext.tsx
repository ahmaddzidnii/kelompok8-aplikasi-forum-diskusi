import { createContext, useState } from "react";

type CommentContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const CommentContext = createContext<CommentContextType>({
  isOpen: false,
  setIsOpen: () => {},
});

export const CommentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CommentContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </CommentContext.Provider>
  );
};
