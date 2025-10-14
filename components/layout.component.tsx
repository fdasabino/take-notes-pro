import React from "react";

interface LayoutComponentProps {
  children?: React.ReactNode;
}

const LayoutComponent: React.FC<LayoutComponentProps> = ({ children }) => {
  return (
    <>
      <header>Header</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </>
  );
};

export default LayoutComponent;
