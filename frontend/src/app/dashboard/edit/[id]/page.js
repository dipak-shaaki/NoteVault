'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EditNote({ params }) {
const router = useRouter()
const noteId = params.id
const [note, setNote] = useState(null)
const [loading, setLoading] = useState(true)
const [form, setForm] = useState({
title: '',
content: '',
tags: '',
isPublic: false,
expiryDate: ''
})

const fetchNote = async () => {
try {
const token = localStorage.getItem('token')
const res = await fetch('http://localhost:5000/api/notes', {
headers: { Authorization: Bearer ${token} }
})
const data = await res.json()
const targetNote = data.find(n => n._id === noteId)
if (targetNote) {
setForm({
title: targetNote.title,
content: targetNote.content,
tags: targetNote.tags?.join(', ') || '',
isPublic: targetNote.isPublic || false,
expiryDate: targetNote.expiryDate ? targetNote.expiryDate.split('T')[0] : ''
})
setNote(targetNote)
}
setLoading(false)
} catch (err) {
console.error('Failed to fetch note:', err)
setLoading(false)
}
}

useEffect(() => {
fetchNote()
}, [])

const handleChange = (e) => {
const { name, value, type, checked } = e.target
setForm(prev => ({
...prev,
[name]: type === 'checkbox' ? checked : value
}))
}

const handleSubmit = async (e) => {
e.preventDefault()
try {
const token = localStorage.getItem('token')
const res = await fetch(http://localhost:5000/api/notes/${noteId}, {
method: 'PUT',
headers: {
'Authorization': Bearer ${token},
'Content-Type': 'application/json'
},
body: JSON.stringify({
...form,
tags: form.tags.split(',').map(t => t.trim())
})
})
if (res.ok) {
router.push('/dashboard')
} else {
const errData = await res.json()
alert(errData.msg || 'Failed to update note')
}
} catch (err) {
console.error(err)
}
}

if (loading) return <p>Loading...</p>

return (
<div className="max-w-xl mx-auto">
<h1 className="text-2xl font-bold mb-4">Edit Note</h1>
<form onSubmit={handleSubmit} className="space-y-4">
<input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full px-3 py-2 border rounded" />
<textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" className="w-full px-3 py-2 border rounded" rows="5" />
<input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full px-3 py-2 border rounded" />
<label className="flex items-center space-x-2">
<input type="checkbox" name="isPublic" checked={form.isPublic} onChange={handleChange} />
<span>Make Public</span>
</label>
<input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
Save Changes
</button>
</form>
</div>
)
}