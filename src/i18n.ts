import Vue from 'vue';
import VueI18n, { LocaleMessages } from 'vue-i18n';
import messages from "@/locales/en";
import axios from 'axios';

Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages,
});

const loadedLanguages = ['en']; // our default language that is preloaded

function setI18nLanguage (lang) {
  i18n.locale = lang;
  axios.defaults.headers.common['Accept-Language'] = lang;
  document.querySelector('html')?.setAttribute('lang', lang);
  return lang;
}

export function loadLanguageAsync(lang: string) {
  // If the same language
  if (i18n.locale === lang) {
    return Promise.resolve(setI18nLanguage(lang));
  }

  // If the language was already loaded
  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang));
  }

  // If the language hasn't been loaded yet
  return import(/* webpackChunkName: "lang-[request]" */ `@/locales/${lang}.js`).then(
    messages => {
      i18n.setLocaleMessage(lang, messages.default);
      loadedLanguages.push(lang);
      return setI18nLanguage(lang);
    }
  );
}

