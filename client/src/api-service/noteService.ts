import { API_TOKEN } from '../app-constants/app-constants';
import ApiConfig from './apiConfig';

/**
 * Sends a DELETE request to the server to delete a note by its ID.
 *
 * @param {number} id - The ID of the note to delete.
 * @returns {Promise<undefined>} A promise that resolves to undefined if the deletion was
 * successful.
 * @throws {Error} An error object if there was an error
 */
async function deleteNoteRequest(id: number): Promise<undefined> {
  try {
    const tokenState = localStorage.getItem(API_TOKEN);
    const response = await fetch(`${ApiConfig.notesUrl}/${id}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenState}`
      }
    });
    if (response.status === 204) {
      return;
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

export {
  deleteNoteRequest
};
