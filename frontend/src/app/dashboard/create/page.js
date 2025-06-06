'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateNotePage() {
const [title, setTitle] = useState('')
const [content, setContent] = useState('')
const [tags, setTags] = useState('')
const [isPublic, setIsPublic] = useState(false)
const [expiryDate, setExpiryDate] = useState('')
const [error, setError] = useState('')
const router = useRouter()

const handleSubmit = async (e) => {
e.preventDefault()

php
Copy
Edit
const token = localStorage.getItem('token')
if (!token) {
  setError('You must be logged in')
  return
}

try {
  const res = await fetch('http://localhost:5000/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()),
      isPublic,
      expiryDate: expiryDate || null,
    }),
  })

  const data = await res.json()
  if (res.ok) {
    router.push('/dashboard')
  } else {
    setError(data.msg || 'Failed to create note')
  }
} catch (err) {
  setError('An error occurred')
}
}

return (
<div className="max-w-xl mx-auto p-6">
<h1 className="text-2xl font-bold mb-4">Create New Note</h1>
{error && <p className="text-red-500 mb-3">{error}</p>}

php-template
Copy
Edit
  <form onSubmit={handleSubmit} className="space-y-4">
    <input
      type="text"
      placeholder="Title"
      className="w-full border p-2 rounded"
      value={title}
      onChange={e => setTitle(e.target.value)}
    />

    <textarea
      placeholder="Content"
      className="w-full border p-2 rounded h-32"
      value={content}
      onChange={e => setContent(e.target.value)}
    ></textarea>

    <input
      type="text"
      placeholder="Tags (comma separated)"
      className="w-full border p-2 rounded"
      value={tags}
      onChange={e => setTags(e.target.value)}
    />

    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={isPublic}
        onChange={() => setIsPublic(!isPublic)}
      />
      <label>Make public</label>
    </div>

    <input
      type="date"
      className="border p-2 rounded"
      value={expiryDate}
      onChange={e => setExpiryDate(e.target.value)}
    />

    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
      Create Note
    </button>
  </form>
</div>
)
}