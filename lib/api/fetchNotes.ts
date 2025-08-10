import type { FetchNotesResponse } from '@/types/note';
import axios from 'axios';

// export interface FetchNotesResponse {
//   notes: Note[];
//   totalPages: number;
//   page: number;
//   perPage: number;
// }

export const fetchNotes = async (
  page: number,
  search?: string
): Promise<FetchNotesResponse> => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  const response = await axios.get<FetchNotesResponse>(
    'https://notehub-public.goit.study/api/notes',
    {
      params: {
        page,
        perPage: 12,
        ...(search ? { search } : {}),
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
