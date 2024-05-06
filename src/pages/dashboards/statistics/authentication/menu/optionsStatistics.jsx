import { useTranslation } from "react-i18next";

const OptionsStatistics = () => {
  const { t } = useTranslation();
  const menuOption = [
    {
      value: "weekly",
      label: t("_weekly"),
    },
    {
      value: "monthly",
      label: t("_monthly"),
    },
    {
      value: "yearly",
      label: t("_yearly"),
    },
  ];

  return menuOption;
};
export default OptionsStatistics;
