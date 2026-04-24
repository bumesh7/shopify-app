import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await login(form.email, form.password); navigate(from, { replace: true }); } catch {}
  };

  return <AuthLayout title="Welcome back" subtitle="Sign in to your account">
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Email</label>
        <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" required />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Password</label>
        <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" required />
      </div>
      <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
      <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 500 }}>Create one</Link>
      </div>
      <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--text-muted)' }}>
        <strong>Demo accounts:</strong><br />
        Admin: admin@shopapp.com / admin123<br />
        User: user@shopapp.com / user123
      </div>
    </form>
  </AuthLayout>;
}

export function Register() {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '' });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await register(form); navigate('/'); } catch {}
  };

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return <AuthLayout title="Create account" subtitle="Start shopping today">
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>First Name</label>
          <input value={form.firstName} onChange={set('firstName')} placeholder="John" required />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Last Name</label>
          <input value={form.lastName} onChange={set('lastName')} placeholder="Doe" required />
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Email</label>
        <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Phone</label>
        <input value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Password</label>
        <input type="password" value={form.password} onChange={set('password')} placeholder="Min. 6 characters" required minLength={6} />
      </div>
      <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
        {loading ? 'Creating account…' : 'Create Account'}
      </button>
      <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Sign in</Link>
      </div>
    </form>
  </AuthLayout>;
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '80px 16px 40px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'var(--accent)', marginBottom: 8 }}>SHOPAPP</div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: 6 }}>{title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>{subtitle}</p>
        </div>
        <div className="card" style={{ padding: 28 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
