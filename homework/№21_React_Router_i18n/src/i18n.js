import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        home: "Home",
        courses: "Courses",
        teacher: "Teacher",
        details: "Details",
        notfound: "404 Page Not Found",
      },
    },

    hy: {
      translation: {
        home: "Գլխավոր",
        courses: "Դասընթացներ",
        teacher: "Դասախոս",
        details: "Մանրամասներ",
        notfound: "404 Էջը չի գտնվել",
      },
    },
  },

  lng: "en",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;