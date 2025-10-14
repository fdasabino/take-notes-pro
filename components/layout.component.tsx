import React from "react";
import { anaheim, doto, nunito } from "@/constants/fonts";
import NavigationComponent from "@/components/ui/navigation/navigation.component";

interface LayoutComponentProps {
  children?: React.ReactNode;
}

const LayoutComponent: React.FC<LayoutComponentProps> = ({ children }) => {
  return (
    <>
      <NavigationComponent />
      <main
        className={`${anaheim.className} ${nunito.className} ${doto.className} container mx-auto p-4`}>
        {children}
      </main>
    </>
  );
};

export default LayoutComponent;
