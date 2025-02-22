type TaskResponse = {
  id: number;
  description: string;
  done: boolean;
  highPriority: boolean;
  dueDate: string;
  dueDateFmt: string;
  lastUpdate: string;
  tag: string;
  urls: string[];
};

export type { TaskResponse };
