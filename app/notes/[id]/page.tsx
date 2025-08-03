import NoteDetailsClient from './NoteDetails.client'
import { fetchNoteById } from '@/lib/api'
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query'

export default async function NoteDetailsPage({
	params,
}: {
	params: { id: string }
}) {
	const queryClient = new QueryClient()

	await queryClient.prefetchQuery({
		queryKey: ['note', params.id],
		queryFn: () => fetchNoteById(params.id),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<NoteDetailsClient id={params.id} />
		</HydrationBoundary>
	)
}
