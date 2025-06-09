import { useState } from 'react';
import axios from 'axios';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
  const res = await axios.post(`${BASE_URL}/auth/signup`, form);
    localStorage.setItem('token', res.data.token);
    alert('Signup successful!');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" />
      <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" />
      <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" />
      <button type="submit">Sign Up</button>
    </form>
  );
}
