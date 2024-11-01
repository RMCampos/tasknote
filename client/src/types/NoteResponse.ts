type NoteUrlResponse = {
  id: number;
  url: string;
};

type NoteResponse = {
  id: number;
  title: string;
  description: string;
  urls: NoteUrlResponse[];
};

export type { NoteUrlResponse, NoteResponse };
