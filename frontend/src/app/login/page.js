'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
const [form, setForm] = useState({ username: '', password: '' })
const [message, setMessage] = useState('')
const router = useRouter()

const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value })
}

const handleSubmit = async (e) => {
e.preventDefault()
setMessage('')

javascript
Copy
Edit
try {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  })

  const data = await res.json()

  if (res.ok) {
    localStorage.setItem('token', data.token)
    router.push('/dashboard') // or /notes
  } else {
    setMessage(data.msg || 'Login failed')
  }
} catch (err) {
  setMessage('Server error. Try again.')
}
}

return (
<main className="flex items-center justify-center min-h-screen bg-gray-100">
<div className="w-full max-w-md p-8 bg-white shadow-md rounded">
<h2 className="text-2xl font-bold text-center mb-6">Login</h2>

php-template
Copy
Edit
    {message && (
      <p className="text-center mb-4 text-red-600 font-medium">{message}</p>
    )}

    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  </div>
</main>
)
}