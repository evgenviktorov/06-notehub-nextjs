import { fetchNotes } from '@/lib/api'
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query'
import NotesClient from './Notes.client'

interface Props {
	searchParams?: Record<string, string | string[] | undefined>
}

export default async function NotesPage({ searchParams }: Props) {
	const pageParam = searchParams?.page
	const searchParam = searchParams?.search

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
