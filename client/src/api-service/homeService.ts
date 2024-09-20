import { API_TOKEN } from '../app-constants/app-constants';
import { HomeSearchResponse } from '../types/HomeSearchResponse';
import { SummaryResponse } from '../types/SummaryResponse';
import ApiConfig from './apiConfig';

/**
 * Sends a GET request to the server to get summaries for the home page.
 *
 * @returns {Promise<SummaryResponse>} A promise that resolves to SummaryResponse if the request
 * was successful.
 * @throws {Error} An error object if there was an error
 */
async function getHomeSummary(): Promise<SummaryResponse> {
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
      throw new Error('Forbidden! Access denied');
    }
    if (response.status === 500) {
      throw new Error('Internal Server Error!');
    }
  } catch (e) {
    if (typeof e === 'string') {
      throw new Error(e as string);
    }
  }
  throw new Error('Unknown error');
}

/**
 * Sends a GET request to the server to get summaries for the home page.
 *
 * @returns {Promise<HomeSearchResponse>} A promise that resolves to HomeSearchResponse if the
 * request was successful.
 * @throws {Error} An error object if there was an error
 */
async function searchHomeRequest(term: string): Promise<HomeSearchResponse> {
  try {
    const tokenState = localStorage.getItem(API_TOKEN);
    const response = await fetch(`${ApiConfig.homeUrl}/search?term=${term}`, {
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
      throw new Error('Forbidden! Access denied');
    }
    if (response.status === 500) {
      throw new Error('Internal Server Error!');
    }
  } catch (e) {
    if (typeof e === 'string') {
      throw new Error(e as string);
    }
  }
  throw new Error('Unknown error');
}

export { getHomeSummary, searchHomeRequest };
