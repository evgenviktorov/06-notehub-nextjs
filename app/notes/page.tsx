import { fetchNotes, type FetchNotesResponse } from '@/lib/api/fetchNotes';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function NotesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const pageStr = Array.isArray(params.page) ? params.page[0] : params.page;
  const searchStr = Array.isArray(params.search)
    ? params.search[0]
    : params.search;

  const page = pageStr ? parseInt(pageStr, 10) : 1;
  const search = searchStr ?? '';

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes(page, search),
  });

  const initialData = queryClient.getQueryData<FetchNotesResponse>([
    'notes',
    page,
    search,
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient page={page} search={search} initialData={initialData} />
    </HydrationBoundary>
  );
}
