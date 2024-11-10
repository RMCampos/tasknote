import { API_TOKEN, REDIRECT_PATH, USER_DATA } from '../app-constants/app-constants';

const langKey = 'TASKNOTE-LANG';

/**
 * Set the default lang for the current user.
 *
 * @param {string} lang The language to be set.
 */
function setDefaultLang(lang: string): void {
  localStorage.setItem(langKey, lang);
}

/**
 * Get the default lang for the current user.
 *
 * @returns {string} the default language stored or EN.
 */
function getDefaultLang(): string {
  return localStorage.getItem(langKey) || 'en';
}

/**
 * Clear all the storage for the current user.
 */
function clearStorage(): void {
  localStorage.removeItem(langKey);
  localStorage.removeItem(API_TOKEN);
  localStorage.removeItem(REDIRECT_PATH);
  localStorage.removeItem(USER_DATA);
}

export { getDefaultLang, setDefaultLang, clearStorage };
