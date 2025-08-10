import { fetchNotes, type FetchNotesResponse } from '@/lib/api'
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query'
import NotesClient from './Notes.client'

type SearchParams = Record<string, string | string[] | undefined>

export default async function NotesPage({
	searchParams,
}: {
	searchParams?: SearchParams
}) {
	const pageStr = Array.isArray(searchParams?.page)
		? searchParams?.page[0]
		: searchParams?.page
	const searchStr = Array.isArray(searchParams?.search)
		? searchParams?.search[0]
		: searchParams?.search

	const page = pageStr ? parseInt(pageStr, 10) : 1
	const search = searchStr ?? ''

	const queryClient = new QueryClient()

	await queryClient.prefetchQuery({
		queryKey: ['notes', page, search],
		queryFn: () => fetchNotes(page, search),
	})

	const initialData = queryClient.getQueryData<FetchNotesResponse>([
		'notes',
		page,
		search,
	])

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<NotesClient page={page} search={search} initialData={initialData} />
		</HydrationBoundary>
	)
}
