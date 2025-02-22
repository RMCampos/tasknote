type TaskNoteRequest = {
  title?: string;
  description: string;
  urls?: string[];
  dueDate?: string;
  highPriority?: boolean;
  tag: string;
};

export default TaskNoteRequest;
