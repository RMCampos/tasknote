import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './constants/english';
import esTranslations from './constants/spanish';
import ptBrTranslations from './constants/portuguese';
import ruTranslations from './constants/russian';

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    resources: {
      en: {
        translation: enTranslations
      },
      es: {
        translation: esTranslations
      },
      pt_br: {
        translation: ptBrTranslations
      },
      ru: {
        translation: ruTranslations
      }
    }
  });

export default i18n;
