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

export { getDefaultLang, setDefaultLang };
