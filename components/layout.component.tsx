import React from "react";
import { anaheim, doto, nunito } from "@/constants/fonts";
import NavigationComponent from "@/components/ui/navigation/navigation.component";
import { useRouter } from "next/router";
import { useAppSelector } from "@/store/hooks";
import FooterComponent from "@/components/ui/footer/footer.component";
interface LayoutComponentProps {
  children?: React.ReactNode;
}

const PUBLIC_PATHS = ["/auth/login", "/auth/register", "/auth/reset", "/_next", "/favicon.ico"];
const isPublicPath = (path: string) =>
  PUBLIC_PATHS.some((publicPath) => path === publicPath || path.startsWith(`${publicPath}/`));

const LayoutComponent: React.FC<LayoutComponentProps> = ({ children }) => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { pathname } = router;

  return (
    <>
      {isPublicPath(pathname) ? null : (
        <NavigationComponent
          userEmail={user?.email ?? undefined}
          userImage={user?.imageURL ?? undefined}
          userName={user?.name ?? undefined}
        />
      )}
      <main
        className={`${anaheim.className} ${nunito.className} ${doto.className} relative container mx-auto p-4 mb-20`}>
        {children}
        {isPublicPath(pathname) ? null : <FooterComponent />}
      </main>
    </>
  );
};

export default LayoutComponent;
