import FuseLayout from "@fuse/core/FuseLayout";
import FuseTheme from "@fuse/core/FuseTheme";
import { SnackbarProvider } from "notistack";
import rtlPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { selectCurrentLanguageDirection } from "app/store/i18nSlice";
import themeLayouts from "app/theme-layouts/themeLayouts";
import { selectMainTheme } from "@fuse/core/FuseSettings/fuseSettingsSlice";
// import MockAdapterProvider from "@mock-api/MockAdapterProvider";
import { useAppSelector, useAppDispatch } from "app/store/hooks";
import { useDispatch, useSelector } from "react-redux";
import withAppProviders from "./withAppProviders";
import AuthenticationProvider from "./auth/AuthenticationProvider";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { LOAD_SYSTEM_SETTINGS } from "./gql/queries";
import FuseSplashScreen from "@fuse/core/FuseSplashScreen";
import {
  selectSystemSettings,
  setAppTheme,
  setSystemSettings,
} from "./store/appSlice";
// import axios from 'axios';
/**
 * Axios HTTP Request defaults
 */
// axios.defaults.baseURL = "";
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
const emotionCacheOptions = {
  rtl: {
    key: "muirtl",
    stylisPlugins: [rtlPlugin],
    insertionPoint: document.getElementById("emotion-insertion-point"),
  },
  ltr: {
    key: "muiltr",
    stylisPlugins: [],
    insertionPoint: document.getElementById("emotion-insertion-point"),
  },
};

/**
 * The main App component.
 */
function App() {
  // load system settings here
  const { loading, error, data } = useQuery(LOAD_SYSTEM_SETTINGS);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      const dbTheme = data.system_settings?.find(
        (setting) => setting.setting_title == "theme"
      )?.setting_value;
      dispatch(setAppTheme(dbTheme));
    }
  }, [data]);

  const langDirection = useAppSelector(selectCurrentLanguageDirection);
  /**
   * The main theme from the Redux store.
   */
  const mainTheme = useSelector(selectMainTheme);
  
  // Block app rendering until system settings query resolves
  if (loading) {
    return <FuseSplashScreen />;
  }

  if (error) {
    return (
      <div className="p-24 text-center">
        Failed to load system settings. Please refresh.
      </div>
    );
  }
  return (
    // <MockAdapterProvider>
    <CacheProvider value={createCache(emotionCacheOptions[langDirection])}>
      <FuseTheme theme={mainTheme} root>
        <AuthenticationProvider>
          <SnackbarProvider
            maxSnack={5}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            classes={{
              containerRoot:
                "bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99",
            }}
          >
            <FuseLayout layouts={themeLayouts} />
          </SnackbarProvider>
        </AuthenticationProvider>
      </FuseTheme>
    </CacheProvider>
    // </MockAdapterProvider>
  );
}

export default withAppProviders(App);
