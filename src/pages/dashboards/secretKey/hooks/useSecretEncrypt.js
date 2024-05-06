import { useLazyQuery } from "@apollo/client";
import { QUERY_SETTING } from "../../settings/apollo";
import { useEffect } from "react";

const useSecretEncrypted = () => {
  const [getSetting, { data: dataSetting }] = useLazyQuery(QUERY_SETTING, {
    fetchPolicy: "no-cache",
  });
  const categoryKey = "SKFBBST";

  async function fetchingDataSetting() {
    try {
      await getSetting({
        variables: {
          where: { categoryKey },
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchingDataSetting();
  }, []);

  return {
    data: dataSetting?.general_settings?.data || [],
  };
};

export default useSecretEncrypted;
