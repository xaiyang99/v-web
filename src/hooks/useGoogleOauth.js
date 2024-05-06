import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { SETTING_KEYS } from "../constants";
import { QUERY_SETTING } from "./apollo/setting";
import useAuth from "./useAuth";
import useDeepEqualEffect from "./useDeepEqualEffect";

const useManageSetting = () => {
  const [getSetting, { data: get_setting }] = useLazyQuery(QUERY_SETTING, {
    fetchPolicy: "no-cache",
  });

  async function customSettings() {
    try {
      await getSetting({});
    } catch (error) {
      console.error("Error on Setting", error);
    }
  }

  useEffect(() => {
    customSettings();
  }, []);

  return {
    data: get_setting?.general_settings?.data || [],
  };
};

const useGoogleOauth = (clientId, { onSuccess } = {}) => {
  const manageSetting = useManageSetting();
  const { user } = useAuth();
  const [isLoggedIn, setLoggedIn] = useState(null);
  const [hideOauthGoogle, setHideOauthGoogle] = useState(null);

  const findDataSetting = (productKey) => {
    const res = manageSetting.data?.some(
      (data) => data?.productKey === productKey,
    );
    return res;
  };

  useDeepEqualEffect(() => {
    if (manageSetting.data?.length > 0) {
      const oauthGoogleSetting = findDataSetting(SETTING_KEYS.OAUTH_GOOGLE);
      setHideOauthGoogle(oauthGoogleSetting);
    }
  }, [manageSetting.data]);

  const signOut = async () => {
    window.google.accounts.id.disableAutoSelect();
  };

  const signIn = (res) => {
    onSuccess(res);
  };

  useEffect(() => {
    setLoggedIn(user ? true : false);
  }, [user]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: signIn,
      });
    };
    if (isLoggedIn !== null && isLoggedIn === false) {
      if (hideOauthGoogle !== null && hideOauthGoogle === false) {
        window.google?.accounts.id.prompt();
      }
    }

    script.async = true;
    script.id = "google-client-script";
    document.querySelector("body")?.appendChild(script);

    return () => {
      window.google?.accounts.id.cancel();
      document.getElementById("google-client-script")?.remove();
    };
  }, [isLoggedIn, hideOauthGoogle]);

  const createGoogleWrapper = () => {
    const googleLoginWrapper = document.createElement("div");
    googleLoginWrapper.style.display = "none";
    googleLoginWrapper.classList.add("custom-google-button");

    document.body.appendChild(googleLoginWrapper);

    window.google?.accounts.id.renderButton(googleLoginWrapper, {
      type: "icon",
      width: "200",
    });

    const googleLoginWrapperButton =
      googleLoginWrapper.querySelector("div[role=button]");

    return {
      click: () => {
        googleLoginWrapperButton.click();
      },
    };
  };

  const googleButton = createGoogleWrapper();

  return {
    signOut,
    googleButton,
  };
};

export default useGoogleOauth;
