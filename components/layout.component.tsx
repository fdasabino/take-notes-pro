import React from "react";
import { anaheim, doto, nunito } from "@/constants/fonts";

interface LayoutComponentProps {
  children?: React.ReactNode;
}

const LayoutComponent: React.FC<LayoutComponentProps> = ({ children }) => {
  return (
    <main
      className={`${anaheim.className} ${nunito.className} ${doto.className} container mx-auto p-4`}>
      {children}
    </main>
  );
};

export default LayoutComponent;
