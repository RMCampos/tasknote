type TaskUrlResponse = {
  id: number,
  url: string
}

type TaskResponse = {
  id: number,
  description: string,
  done: boolean,
  urls: TaskUrlResponse[]
}

export type { TaskUrlResponse, TaskResponse };
