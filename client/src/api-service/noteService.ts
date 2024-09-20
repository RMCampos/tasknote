import { API_TOKEN } from '../app-constants/app-constants';
import TaskNoteRequest from '../types/TaskNoteRequest';
import { NoteResponse } from '../types/NoteResponse';
import ApiConfig from './apiConfig';

async function addNoteRequest(note: TaskNoteRequest): Promise<NoteResponse | Error> {
  try {
    const tokenState = localStorage.getItem(API_TOKEN);
    const response = await fetch(ApiConfig.notesUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenState}`
      },
      body: JSON.stringify(note)
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    if (response.status === 400) {
      return new Error('Wrong or missing information!');
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

async function getNotesRequest(): Promise<NoteResponse[] | Error> {
  try {
    const tokenState = localStorage.getItem(API_TOKEN);
    const response = await fetch(ApiConfig.notesUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenState}`
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

async function updateNoteRequest(id: number, desc: string): Promise<Error | undefined> {
  try {
    const tokenState = localStorage.getItem(API_TOKEN);
    const response = await fetch(`${ApiConfig.notesUrl}/${id}`, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenState}`
      },
      body: JSON.stringify({ description: desc })
    });
    if (response.ok) {
      await response.json();
      return;
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

async function deleteNoteRequest(id: number): Promise<Error | undefined> {
  try {
    const tokenState = localStorage.getItem(API_TOKEN);
    const response = await fetch(`${ApiConfig.notesUrl}/${id}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenState}`
      }
    });
    if (response.status === 204) {
      return;
    }
    if (response.status === 403) {
      return new Error('Forbidden! Access denied');
    }
    if (response.status === 500) {
      return new Error('Internal Server Error!');
    }
  } catch (e) {
    console.log('aha!');
    if (typeof e === 'string') {
      return new Error(e as string);
    }
  }
  return new Error('Unknown error');
}
    
export { addNoteRequest, getNotesRequest, updateNoteRequest, deleteNoteRequest };
