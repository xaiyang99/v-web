import { useLazyQuery } from "@apollo/client";
import { createContext, useContext, useEffect, useMemo } from "react";
import { QUERY_SETTING } from "./apollo/Setting";

export const SETTING_KEYS = {
  PUBLIC_KEY_STRIPE: "stkehp",
  SECRET_KEY_STRIPE: "kpwjen",
  ACCESS_KEY_BUNNY: "sckfbn",
  HOST_KEY_BUNNY: "hbnsck",
  CAPCHA_GOOGLE: "ECPTCHP",
  OAUTH_GITHUB: "LOGVGTS",
  OAUTH_GOOGLE: "LOGVAGG",
  OAUTH_FACEBOOK: "LOGVAFB",
  SIGN_IN_LIMIT: "LGONLIG",
};

export const SettingKeyContext = createContext({});

const SettingKeyProvider = ({ children }) => {
  const [getSetting, { data }] = useLazyQuery(QUERY_SETTING, {
    fetchPolicy: "no-cache",
  });

  const dataSetting = data?.general_settings?.data;

  async function customSettings() {
    try {
      await getSetting({
        variables: {
          noLimit: true,
        },
      });
    } catch (error) {
      console.error("Error on Setting", error);
    }
  }

  useEffect(() => {
    customSettings();
  }, []);

  const result = useMemo(() => {
    return Object.keys(SETTING_KEYS).map((settingKey) => {
      const isDataSettingFound = dataSetting?.find(
        (data) => data?.productKey === SETTING_KEYS[settingKey],
      );
      return { [settingKey]: isDataSettingFound?.action || null };
    });
  }, [dataSetting]);

  return (
    <SettingKeyContext.Provider
      value={{
        data: Object.assign({}, ...result),
      }}
    >
      {children}
    </SettingKeyContext.Provider>
  );
};

export const useSettingKey = () => {
  const settingKeyContext = useContext(SettingKeyContext);
  return settingKeyContext;
};

export default SettingKeyProvider;
