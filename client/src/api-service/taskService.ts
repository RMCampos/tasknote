import { API_TOKEN } from '../app-constants/app-constants';
import TaskRequest from '../types/TaskRequest';
import { TaskResponse } from '../types/TaskResponse';
import ApiConfig from './apiConfig';

async function addTaskRequest(task: TaskRequest): Promise<TaskResponse | Error> {
  try {
    const tokenState = localStorage.getItem(API_TOKEN);
    const response = await fetch(ApiConfig.tasksUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenState}`
      },
      body: JSON.stringify(task)
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

async function getTasksRequest(): Promise<TaskResponse[] | Error> {
  try {
    const tokenState = localStorage.getItem(API_TOKEN);
    const response = await fetch(ApiConfig.tasksUrl, {
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

async function updateTaskDoneRequest(id: number, done: boolean): Promise<Error | undefined> {
  try {
    const tokenState = localStorage.getItem(API_TOKEN);
    const response = await fetch(`${ApiConfig.tasksUrl}/${id}`, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenState}`
      },
      body: JSON.stringify({ done })
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

async function deleteTaskRequest(id: number): Promise<Error | undefined> {
  try {
    const tokenState = localStorage.getItem(API_TOKEN);
    const response = await fetch(`${ApiConfig.tasksUrl}/${id}`, {
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
    
export { addTaskRequest, getTasksRequest, updateTaskDoneRequest, deleteTaskRequest };
