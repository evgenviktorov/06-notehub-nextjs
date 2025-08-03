import { fetchNotes } from '@/lib/api'
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query'
import NotesClient from './Notes.client'

export default async function NotesPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
	const resolvedSearchParams = await searchParams

	const pageParam = resolvedSearchParams?.page
	const searchParam = resolvedSearchParams?.search

	const page = typeof pageParam === 'string' ? parseInt(pageParam, 10) : 1
	const search = typeof searchParam === 'string' ? searchParam : ''

	const queryClient = new QueryClient()

	await queryClient.prefetchQuery({
		queryKey: ['notes', page, search],
		queryFn: () => fetchNotes(page, search),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<NotesClient page={page} search={search} />
		</HydrationBoundary>
	)
}
