import LogoComponent from "@/components/ui/logo/logo.component";
import Link from "next/link";
import React from "react";

const NavigationComponent = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-base_gray mb-4">
      <div>
        <Link href="/">
          <LogoComponent
            size={36}
            showText
            variant="default"
          />
        </Link>
      </div>
      <nav></nav>
    </header>
  );
};

export default NavigationComponent;
