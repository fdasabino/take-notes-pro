import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { listenToAuthChanges } from "@/features/auth/api/auth.thunk";
import { fetchNotesForUser } from "@/features/notes/api/notes.thunk";
import { clearNotes } from "@/features/notes/state/notes.slice";
import AppLayout from "@/shared/layout/AppLayout";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
const PUBLIC_PATHS = ["/auth/login", "/auth/register", "/auth/reset", "/_next", "/favicon.ico"];
const AUTH_PATHS = ["/auth/login", "/auth/register"];

const isPublicPath = (path: string) =>
  PUBLIC_PATHS.some((publicPath) => path === publicPath || path.startsWith(`${publicPath}/`));

function AuthListener() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, loading } = useAppSelector((state) => state.auth);
  const userId = user?.uid;

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(dispatch);
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (!router.isReady || loading) {
      return;
    }

    const currentPath = router.asPath.split("?")[0];
    if (!user && !isPublicPath(currentPath)) {
      router.replace(
        {
          pathname: "/auth/login",
          query: { redirect: router.asPath },
        },
        undefined,
        { shallow: true }
      );
    }

    if (user && AUTH_PATHS.includes(currentPath)) {
      router.replace("/", undefined, { shallow: true });
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchNotesForUser({ userId }));
    } else {
      dispatch(clearNotes());
    }
  }, [userId, dispatch]);

  return null;
}

export default function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  return (
    <Provider store={store}>
      <AppLayout>
        <AuthListener />
        <Toaster position="bottom-center" />
        <Component {...pageProps} />
      </AppLayout>
    </Provider>
  );
}
