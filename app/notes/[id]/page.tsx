import NoteDetailsClient from './NoteDetails.client'
import { fetchNoteById } from '@/lib/api'
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query'

interface Params {
	params: {
		id: string
	}
}

export default async function NoteDetailsPage({ params }: Params) {
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
