'use client'
import { useState } from 'react'

export default function VerifyPage() {
const [form, setForm] = useState({ email: '', otp: '' })
const [message, setMessage] = useState('')

const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value })
}

const handleSubmit = async (e) => {
e.preventDefault()

javascript
Copy
Edit
try {
  const res = await fetch('http://localhost:5000/api/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  })
  const data = await res.json()

  setMessage(data.msg)
} catch (err) {
  setMessage('Verification failed')
}
}

return (
<main className="flex items-center justify-center min-h-screen bg-gray-50">
<div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
<h2 className="text-2xl font-semibold text-center mb-6">Verify OTP</h2>

php-template
Copy
Edit
    {message && (
      <p className="text-center mb-4 text-blue-600 font-medium">{message}</p>
    )}

    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        name="email"
        placeholder="Your email"
        value={form.email}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-md"
        required
      />

      <input
        type="text"
        name="otp"
        placeholder="Enter OTP"
        value={form.otp}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-md"
        required
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
      >
        Verify
      </button>
    </form>
  </div>
</main>
)
}