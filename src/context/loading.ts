import { createContext } from "react";

export type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);
