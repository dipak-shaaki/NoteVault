'use client'
import { useState } from 'react'

export default function RegisterPage() {
const [form, setForm] = useState({
email: '',
username: '',
password: '',
})

const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value })
}

const handleSubmit = async (e) => {
e.preventDefault()
try {
const res = await fetch('http://localhost:5000/api/auth/register', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(form),
})
const data = await res.json()
alert(data.msg)
} catch (err) {
alert('Something went wrong')
}
}

return (
<main className="flex items-center justify-center min-h-screen bg-gray-50">
<div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
<h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
<form onSubmit={handleSubmit} className="space-y-4">
<input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
<input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
<input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
<button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition" >
Send OTP
</button>
</form>
</div>
</main>
)
}