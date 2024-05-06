import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { QUERY_SETTING } from "../apollo";

const useSettingCategory = ({ categorykey }) => {
  const [getSetting, { data: get_setting }] = useLazyQuery(QUERY_SETTING, {
    fetchPolicy: "no-cache",
  });

  async function customSettings() {
    try {
      await getSetting({
        variables: {
          where: {
            categorykey,
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

export default useSettingCategory;
