import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { listenToAuthChanges } from "@/store/thunk/auth.thunk";
import { fetchNotesForUser } from "@/store/thunk/notes.thunk";
import { clearNotes } from "@/store/notes.slice";
import LayoutComponent from "@/components/layout.component";

function AuthListener() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.uid);

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(dispatch);
    return () => unsubscribe();
  }, [dispatch]);

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
      <LayoutComponent>
        <AuthListener />
        <Component {...pageProps} />
      </LayoutComponent>
    </Provider>
  );
}
