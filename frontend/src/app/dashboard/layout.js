'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({ children }) {
const router = useRouter()

const handleLogout = () => {
localStorage.removeItem('token')
router.push('/login')
}

useEffect(() => {
const token = localStorage.getItem('token')
if (!token) {
router.push('/login')
}
}, [])

return (
<div className="min-h-screen flex flex-col">
<header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
<h1 className="text-xl font-bold">NoteVault</h1>
<nav className="space-x-4">
<Link href="/dashboard" className="hover:underline">Dashboard</Link>
<Link href="/dashboard/create" className="hover:underline">Create</Link>
<button onClick={handleLogout} className="hover:underline">Logout</button>
</nav>
</header>

php-template
Copy
Edit
  <main className="flex-1 bg-gray-100 p-6">
    {children}
  </main>
</div>
)
}