type NoteResponse = {
  id: number;
  title: string;
  description: string;
  url: string | null;
  tag: string;
  lastUpdate: string;
};

export type { NoteResponse };
