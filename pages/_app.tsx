import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useEffect } from "react";
import { listenToAuthChanges } from "@/store/auth.slice";
import { useAppDispatch } from "@/store/hooks";

function AuthListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(dispatch);
    return () => unsubscribe();
  }, [dispatch]);

  return null;
}

export default function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  return (
    <Provider store={store}>
      <AuthListener />
      <Component {...pageProps} />
    </Provider>
  );
}
