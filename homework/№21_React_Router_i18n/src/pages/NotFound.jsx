import { useTranslation } from "react-i18next";

function NotFound() {
  const { t } = useTranslation();

  return <h1>{t("notfound")}</h1>;
}

export default NotFound;
