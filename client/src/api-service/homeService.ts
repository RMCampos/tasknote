import { API_TOKEN } from '../app-constants/app-constants';
import { SummaryResponse } from '../types/SummaryResponse';
import ApiConfig from './apiConfig';

/**
 *
 */
async function getHomeSummary(): Promise<SummaryResponse | Error> {
  try {
    const tokenState = localStorage.getItem(API_TOKEN);
    const response = await fetch(`${ApiConfig.homeUrl}/summary`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenState}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    if (response.status === 403) {
      return new Error('Forbidden! Access denied');
    }
    if (response.status === 500) {
      return new Error('Internal Server Error!');
    }
  } catch (e) {
    if (typeof e === 'string') {
      return new Error(e as string);
    }
  }
  return new Error('Unknown error');
}

export { getHomeSummary };
