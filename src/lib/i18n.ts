import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en.json';
import hi from '../locales/hi.json';
import bn from '../locales/bn.json';
import mr from '../locales/mr.json';
import te from '../locales/te.json';
import ta from '../locales/ta.json';
import gu from '../locales/gu.json';
import kn from '../locales/kn.json';

const resources = {
    en: { translation: en },
    hi: { translation: hi },
    bn: { translation: bn },
    mr: { translation: mr },
    te: { translation: te },
    ta: { translation: ta },
    gu: { translation: gu },
    kn: { translation: kn }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        fallbackLng: "en",
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
