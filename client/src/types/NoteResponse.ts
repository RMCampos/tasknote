type NoteResponse = {
  id: number;
  title: string;
  description: string;
  url: string | null;
  tag: string;
  lastUpdate: string;
  shared: boolean;
  shareToken: string | null;
};

export type { NoteResponse };
