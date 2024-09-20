type NoteUrlResponse = {
  id: number,
  url: string
}

type NoteResponse = {
  id: number,
  description: string,
  urls: NoteUrlResponse[]
}

export type { NoteUrlResponse, NoteResponse };
