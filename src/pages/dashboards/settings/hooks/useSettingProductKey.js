import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { QUERY_SETTING } from "../apollo";

const useSettingProductKey = ({ productKey }) => {
  const [getSetting, { data: get_setting }] = useLazyQuery(QUERY_SETTING, {
    fetchPolicy: "no-cache",
  });

  async function customSettings() {
    try {
      await getSetting({
        variables: {
          where: {
            productKey,
          },
        },
      });
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

export default useSettingProductKey;
