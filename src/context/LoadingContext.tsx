import { useState, ReactNode } from "react";
import { LoadingContext } from "@/context/loading";

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  return <LoadingContext.Provider value={{ isLoading, setIsLoading }}>{children}</LoadingContext.Provider>;
};
