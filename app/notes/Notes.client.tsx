'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

import Modal from '@/components/Modal/Modal'
import NoteForm from '@/components/NoteForm/NoteForm'
import NoteList from '@/components/NoteList/NoteList'
import Pagination from '@/components/Pagination/Pagination'
import SearchBox from '@/components/SearchBox/SearchBox'

import { fetchNotes, type FetchNotesResponse } from '@/lib/api'
import type { Note } from '@/types/note'

import css from './Notes.client.module.css'

interface NotesClientProps {
	page: number
	search: string
	initialData?: FetchNotesResponse
}

export default function NotesClient({
	page: initialPage,
	search: initialSearch,
	initialData,
}: NotesClientProps) {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [page, setPage] = useState(initialPage)
	const [search, setSearch] = useState(initialSearch)
	const [debouncedSearch] = useDebounce(search, 500)

	useEffect(() => {
		setPage(1)
	}, [debouncedSearch])

	const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
		queryKey: ['notes', page, debouncedSearch],
		queryFn: () => fetchNotes(page, debouncedSearch),

		initialData:
			page === initialPage && debouncedSearch === initialSearch
				? initialData
				: undefined,

		placeholderData: keepPreviousData,
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
				notes={(data?.notes ?? []) as Note[]}
				isLoading={isLoading}
				isError={isError}
			/>

			{isModalOpen && (
				<Modal onClose={() => setIsModalOpen(false)}>
					<NoteForm onClose={() => setIsModalOpen(false)} />
				</Modal>
			)}
		</div>
	)
}
