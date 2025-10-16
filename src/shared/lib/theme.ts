type ThemePreference = "system" | "light" | "dark";

const THEME_STORAGE_KEY = "take-notes-theme-preference";

let mediaQuery: MediaQueryList | null = null;
let mediaQueryListener: ((event: MediaQueryListEvent) => void) | null = null;

const isBrowser = typeof window !== "undefined";

const ensureMediaQuery = () => {
  if (!isBrowser) {
    return null;
  }

  if (!mediaQuery) {
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  }

  return mediaQuery;
};

const applyResolvedTheme = (theme: "light" | "dark") => {
  if (!isBrowser) {
    return;
  }

  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
};

const setPreferenceAttribute = (preference: ThemePreference) => {
  if (!isBrowser) {
    return;
  }

  document.documentElement.setAttribute("data-theme-preference", preference);
};

const persistPreference = (preference: ThemePreference) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, preference);
};

const readStoredPreference = (): ThemePreference | null => {
  if (!isBrowser) {
    return null;
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }

  return null;
};

const startSystemSync = () => {
  if (!isBrowser) {
    return;
  }

  const mq = ensureMediaQuery();
  if (!mq) {
    return;
  }

  const apply = (matches: boolean) => applyResolvedTheme(matches ? "dark" : "light");
  apply(mq.matches);

  if (!mediaQueryListener) {
    mediaQueryListener = (event: MediaQueryListEvent) => apply(event.matches);
    mq.addEventListener("change", mediaQueryListener);
  }
};

const stopSystemSync = () => {
  if (mediaQuery && mediaQueryListener) {
    mediaQuery.removeEventListener("change", mediaQueryListener);
  }

  mediaQueryListener = null;
};

const applyPreference = (preference: ThemePreference) => {
  if (preference === "system") {
    startSystemSync();
    return;
  }

  stopSystemSync();
  applyResolvedTheme(preference);
};

export const initializeTheme = (): ThemePreference => {
  if (!isBrowser) {
    return "system";
  }

  const stored = readStoredPreference();
  const preference = stored ?? "system";
  applyPreference(preference);
  setPreferenceAttribute(preference);
  return preference;
};

export const setThemePreference = (preference: ThemePreference) => {
  if (!isBrowser) {
    return;
  }

  persistPreference(preference);
  applyPreference(preference);
  setPreferenceAttribute(preference);
};

export const getThemePreference = (): ThemePreference => {
  if (!isBrowser) {
    return "system";
  }

  const attribute = document.documentElement.getAttribute("data-theme-preference");
  if (attribute === "light" || attribute === "dark" || attribute === "system") {
    return attribute;
  }

  const stored = readStoredPreference();
  if (stored) {
    return stored;
  }

  return "system";
};

export type { ThemePreference };
