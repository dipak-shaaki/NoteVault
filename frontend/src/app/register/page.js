'use client';
import { useState } from 'react';
import axios from '../../services/api'; // we'll create this soon
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await axios.post('/auth/register', formData);
      setMsg(res.data.msg);
      if (res.data.msg.includes('OTP')) {
        // Save email in sessionStorage for verify step
        sessionStorage.setItem('verifyEmail', formData.email);
        router.push('/verify');
      }
    } catch (err) {
      setMsg(err?.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        /><br/>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        /><br/>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br/>
        <button type="submit" disabled={loading}>
          {loading ? 'Sending OTP...' : 'Register'}
        </button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
