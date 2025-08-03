import { fetchNoteById } from '@/lib/api'
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query'
import NoteDetailsClient from './NoteDetails.client'

export default async function NoteDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const resolvedParams = await params
	const id = resolvedParams.id

	const queryClient = new QueryClient()

	await queryClient.prefetchQuery({
		queryKey: ['note', id],
		queryFn: () => fetchNoteById(id),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<NoteDetailsClient id={id} />
		</HydrationBoundary>
	)
}
