type TaskNoteRequest = {
  title?: string;
  description: string;
  urls?: string[];
  dueDate?: string;
  highPriority?: boolean;
};

export default TaskNoteRequest;
