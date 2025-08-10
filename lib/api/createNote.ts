import type { Note, CreateNoteData } from '@/types/note';
import axios from 'axios';

// export interface CreateNoteData {
//   title: string;
//   content: string;
//   tag: string;
// }

export const createNote = async (note: CreateNoteData): Promise<Note> => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  const response = await axios.post<Note>(
    'https://notehub-public.goit.study/api/notes',
    note,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
