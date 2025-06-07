'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TrashPage() {
const router = useRouter()
const [notes, setNotes] = useState([])

const fetchTrashNotes = async () => {
const token = localStorage.getItem('token')
try {
const res = await fetch('http://localhost:5000/api/notes/trash', {
headers: { Authorization: Bearer ${token} }
})
const data = await res.json()
setNotes(data)
} catch (err) {
console.error('Failed to fetch trash notes:', err)
}
}

useEffect(() => {
fetchTrashNotes()
}, [])

const restoreNote = async (id) => {
const token = localStorage.getItem('token')
try {
const res = await fetch(http://localhost:5000/api/notes/${id}/restore, {
method: 'PUT',
headers: {
Authorization: Bearer ${token}
}
})
if (res.ok) {
fetchTrashNotes()
}
} catch (err) {
console.error('Failed to restore:', err)
}
}

const deletePermanently = async (id) => {
const token = localStorage.getItem('token')
try {
const res = await fetch(http://localhost:5000/api/notes/${id}, {
method: 'DELETE',
headers: {
Authorization: Bearer ${token}
}
})
if (res.ok) {
fetchTrashNotes()
}
} catch (err) {
console.error('Failed to delete permanently:', err)
}
}

return (
<div className="max-w-4xl mx-auto">
<h1 className="text-2xl font-bold mb-4">Trash</h1>
{notes.length === 0 ? (
<p className="text-gray-500">No notes in trash.</p>
) : (
<ul className="space-y-4">
{notes.map(note => (
<li key={note._id} className="border p-4 rounded shadow">
<h2 className="font-bold">{note.title}</h2>
<p>{note.content}</p>
<div className="mt-2 flex gap-4">
<button
onClick={() => restoreNote(note._id)}
className="text-sm text-green-600 hover:underline"
>
Restore
</button>
<button
onClick={() => deletePermanently(note._id)}
className="text-sm text-red-600 hover:underline"
>
Delete Permanently
</button>
</div>
</li>
))}
</ul>
)}
</div>
)
}