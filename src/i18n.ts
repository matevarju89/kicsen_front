import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from './locales/hu/translations.json';
import Cookies from 'universal-cookie';

/*const cookies = new Cookies();
if (!cookies.get('language')) {
  cookies.set('language', 'Hu', { path: '/' });
}*/
let currentLang = window.localStorage.getItem('language')
  ? (window.localStorage.getItem('language') as string)
  : 'Hu';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: translations,
    lng: currentLang.toLowerCase(),
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
