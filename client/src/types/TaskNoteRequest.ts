type TaskNoteRequest = {
  title?: string;
  description: string;
  urls?: string[];
  dueDate?: string;
  highPriority?: boolean;
  tags: string[];
};

export default TaskNoteRequest;
