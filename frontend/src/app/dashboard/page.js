'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
const [notes, setNotes] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
const router = useRouter()

useEffect(() => {
const token = localStorage.getItem('token')
if (!token) {
router.push('/login')
return
}
// Fetch notes from the API
const fetchNotes = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/notes', {
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    })

    const data = await res.json()
    if (res.ok) {
      setNotes(data)
    } else {
      setError(data.msg || 'Failed to fetch notes')
    }
  } catch (err) {
    setError('Error fetching notes')
  } finally {
    setLoading(false)
  }
}

fetchNotes()
}, [router])

return (
<main className="min-h-screen bg-gray-100 p-6">
<div className="max-w-4xl mx-auto">
<h1 className="text-2xl font-bold mb-6">Your Notes</h1>

    {loading && <p>Loading notes...</p>}
    {error && <p className="text-red-500">{error}</p>}

    {!loading && !error && notes.length === 0 && (
      <p>No notes found. Create your first one!</p>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {notes.map((note) => (
        <div key={note._id} className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold">{note.title || 'Untitled'}</h2>
          <p className="text-gray-600">{note.content}</p>
          <p className="text-xs text-gray-400 mt-2">
            {new Date(note.updatedAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  </div>
</main>
)
}