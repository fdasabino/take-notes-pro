import React from "react";
import { anaheim, nunito } from "@/shared/config/fonts";
import NavigationBar from "@/shared/ui/navigation/NavigationBar";
import { useRouter } from "next/router";
import { useAppSelector } from "@/store/hooks";
import AppFooter from "@/shared/ui/footer/AppFooter";

interface LayoutComponentProps {
  children?: React.ReactNode;
}

const PUBLIC_PATHS = ["/auth/login", "/auth/register", "/auth/reset", "/_next", "/favicon.ico"];
const isPublicPath = (path: string) =>
  PUBLIC_PATHS.some((publicPath) => path === publicPath || path.startsWith(`${publicPath}/`));

const AppLayout: React.FC<LayoutComponentProps> = ({ children }) => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { pathname } = router;

  return (
    <>
      {isPublicPath(pathname) ? null : (
        <NavigationBar
          userEmail={user?.email ?? undefined}
          userImage={user?.imageURL ?? undefined}
          userName={user?.name ?? undefined}
        />
      )}
      <main
        className={`${anaheim.className} ${nunito.className} relative container mx-auto p-4 mb-20`}>
        {children}
        {isPublicPath(pathname) ? null : <AppFooter />}
      </main>
    </>
  );
};

export default AppLayout;
