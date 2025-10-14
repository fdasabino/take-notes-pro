import React from "react";
import { anaheim, doto, nunito } from "@/constants/fonts";
import NavigationComponent from "@/components/ui/navigation/navigation.component";
import { useRouter } from "next/router";
interface LayoutComponentProps {
  children?: React.ReactNode;
}

const PUBLIC_PATHS = ["/auth/login", "/auth/register", "/_next", "/favicon.ico"];
const isPublicPath = (path: string) =>
  PUBLIC_PATHS.some((publicPath) => path === publicPath || path.startsWith(`${publicPath}/`));

const LayoutComponent: React.FC<LayoutComponentProps> = ({ children }) => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <>
      {isPublicPath(pathname) ? null : <NavigationComponent />}
      <main
        className={`${anaheim.className} ${nunito.className} ${doto.className} container mx-auto p-4`}>
        {children}
      </main>
    </>
  );
};

export default LayoutComponent;
