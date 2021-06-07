import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import useLocalStorage from "react-use-localstorage";
import { queryClient } from "../api";
import { languages } from "../locales/i18n";
import { colors, darkTheme } from "../slang/config";

type Theme = typeof colors;

export type Showing = "navigation" | "editor" | "settings" | "share";

// Stored in localStorage
type UserSettings = {
  mode: "light" | "dark";
  language: string;
};

// Get default languages
const browserLanguage = navigator.language.slice(0, 2);
const defaultLanguage = Object.keys(languages).includes(browserLanguage)
  ? browserLanguage
  : "en";

type TAppContext = {
  updateUserSettings: (newSettings: Partial<UserSettings>) => void;
  theme: Theme;
  shareLink: string;
  setShareLink: Dispatch<SetStateAction<string>>;
  language: string;
  showing: Showing;
  setShowing: Dispatch<SetStateAction<Showing>>;
  workspace: string | null;
  setWorkspace: (workspaceKey: string) => void;
} & Partial<UserSettings>;

export const AppContext = createContext({} as TAppContext);

const Provider = ({ children }: { children?: ReactNode }) => {
  const [showing, setShowing] = useState<Showing>("navigation");
  const [workspace, _setWorkspace] = useState<TAppContext["workspace"]>(null);
  const [shareLink, setShareLink] = useState("");
  const [userSettingsString, setUserSettings] = useLocalStorage(
    "flowcharts.fun.user.settings",
    "{}"
  );
  let { settings, theme } = useMemo<{
    settings: Partial<UserSettings>;
    theme: Theme;
  }>(() => {
    try {
      const settings = JSON.parse(userSettingsString);
      const theme =
        settings.mode === "dark"
          ? darkTheme
          : typeof settings.mode === "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
          ? darkTheme
          : colors;
      return { settings, theme };
    } catch (e) {
      console.error(e);
      return { settings: {}, theme: colors };
    }
  }, [userSettingsString]);

  const updateUserSettings = useCallback(
    (newSettings: Partial<UserSettings>) => {
      setUserSettings(JSON.stringify({ ...settings, ...newSettings }));
    },
    [setUserSettings, settings]
  );

  const setWorkspace = useCallback((workspaceKey: string) => {
    queryClient.invalidateQueries(["flowchart"]);
    _setWorkspace(workspaceKey);
  }, []);

  return (
    <AppContext.Provider
      value={{
        theme,
        shareLink,
        setShareLink,
        updateUserSettings,
        showing,
        setShowing,
        ...settings,
        language: settings.language ?? defaultLanguage,
        workspace,
        setWorkspace,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default Provider;
