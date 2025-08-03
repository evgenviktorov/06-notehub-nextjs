'use client'

import NoteForm from '@/components/NoteForm/NoteForm'
import NoteList from '@/components/NoteList/NoteList'
import NoteModal from '@/components/NoteModal/NoteModal'
import Pagination from '@/components/Pagination/Pagination'
import SearchBox from '@/components/SearchBox/SearchBox'
import { fetchNotes } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import css from './Notes.client.module.css'

interface Props {
	page: number
	search: string
}

export default function NotesClient({
	page: initialPage,
	search: initialSearch,
}: Props) {
	const [page, setPage] = useState(initialPage)
	const [search, setSearch] = useState(initialSearch)
	const [debouncedSearch] = useDebounce(search, 500)
	const [isModalOpen, setIsModalOpen] = useState(false)

	useEffect(() => {
		setPage(1)
	}, [debouncedSearch])

	const { data, isLoading, isError } = useQuery({
		queryKey: ['notes', page, debouncedSearch],
		queryFn: () => fetchNotes(page, debouncedSearch),
		placeholderData: previousData => previousData,
	})

	return (
		<div className={css.app}>
			<div className={css.toolbar}>
				<button className={css.button} onClick={() => setIsModalOpen(true)}>
					Create note +
				</button>
				{data && data.totalPages > 1 && (
					<Pagination
						currentPage={page}
						totalPages={data.totalPages}
						onPageChange={setPage}
					/>
				)}
				<SearchBox value={search} onChange={value => setSearch(value)} />
			</div>

			<NoteList
				notes={data?.notes ?? []}
				isLoading={isLoading}
				isError={isError}
			/>
			{isModalOpen && (
				<NoteModal onClose={() => setIsModalOpen(false)}>
					<NoteForm onClose={() => setIsModalOpen(false)} />
				</NoteModal>
			)}
		</div>
	)
}
