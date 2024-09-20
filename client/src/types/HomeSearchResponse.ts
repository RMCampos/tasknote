import { NoteResponse } from './NoteResponse';
import { TaskResponse } from './TaskResponse';

export type HomeSearchResponse = {
  tasks: TaskResponse[],
  notes: NoteResponse[]
}
