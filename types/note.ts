export interface Note {
  id: string;
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
  createdAt: string;
  updatedAt: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: string;
}
