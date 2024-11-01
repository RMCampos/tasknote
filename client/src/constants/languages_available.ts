import USER_LANG from '../types/UserLangs';

export interface LangAvailable {
  lang: string;
  key: string;
}

export const languages: LangAvailable[] = [
  { lang: USER_LANG.ENGLISH, key: 'landing_btn_english' },
  { lang: USER_LANG.PORTUGUESE, key: 'landing_btn_portuguese' },
  { lang: USER_LANG.SPANISH, key: 'landing_btn_spanish' }
];
