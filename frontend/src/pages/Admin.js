import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('products');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', discountPrice: '', stock: '', category: '', brand: '', thumbnail: '', featured: false });

  useEffect(() => { if (!isAdmin) { navigate('/'); return; } fetchData(); }, [isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [p, o] = await Promise.all([api.get('/products?size=100'), api.get('/orders?size=100')]);
      setProducts(p.data.content);
      setOrders(o.data.content);
    } finally { setLoading(false); }
  };

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/products', { ...form, price: parseFloat(form.price), discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null, stock: parseInt(form.stock) });
      toast.success('Product created!');
      setShowForm(false);
      setForm({ name: '', description: '', price: '', discountPrice: '', stock: '', category: '', brand: '', thumbnail: '', featured: false });
      fetchData();
    } catch { toast.error('Failed to create product'); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await api.delete(`/admin/products/${id}`); toast.success('Deleted'); fetchData(); } catch { toast.error('Delete failed'); }
  };

  const updateOrderStatus = async (id, status) => {
    try { await api.put(`/orders/admin/${id}/status?status=${status}`); toast.success('Status updated'); fetchData(); } catch { toast.error('Update failed'); }
  };

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h1 style={{ fontSize: '2rem' }}>Admin Panel</h1>
          <span className="badge badge-accent">Administrator</span>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[['Total Products', products.length, '📦'], ['Total Orders', orders.length, '🛍️'], ['Revenue', `₹${orders.reduce((s, o) => s + (o.total || 0), 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, '💰'], ['Pending Orders', orders.filter(o => o.status === 'PENDING').length, '⏳']].map(([l, v, icon]) => (
            <div key={l} className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, marginBottom: 2 }}>{v}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['products', 'orders'].map(t => (
            <button key={t} className={tab === t ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
          ))}
        </div>

        {/* Products Tab */}
        {tab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Product</button>
            </div>

            {showForm && (
              <div className="card" style={{ padding: 24, marginBottom: 20 }}>
                <h3 style={{ marginBottom: 16 }}>New Product</h3>
                <form onSubmit={createProduct}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 12 }}>
                    {[['name', 'Name', 'text'], ['price', 'Price (₹)', 'number'], ['discountPrice', 'Discount Price (₹)', 'number'], ['stock', 'Stock', 'number'], ['category', 'Category', 'text'], ['brand', 'Brand', 'text']].map(([k, l, t]) => (
                      <div key={k}>
                        <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>{l}</label>
                        <input type={t} value={form[k]} onChange={set(k)} required={['name', 'price', 'stock', 'category'].includes(k)} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Thumbnail URL</label>
                    <input value={form.thumbnail} onChange={set('thumbnail')} placeholder="https://..." />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Description</label>
                    <textarea value={form.description} onChange={set('description')} rows={3} style={{ resize: 'vertical' }} />
                  </div>
                  <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, marginBottom: 16 }}>
                    <input type="checkbox" checked={form.featured} onChange={set('featured')} style={{ width: 'auto' }} />
                    Featured product
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="submit" className="btn btn-primary">Create Product</button>
                    <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--bg-input)' }}>
                    {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <img src={p.thumbnail || `https://picsum.photos/seed/${p.id}/40/40`} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} onError={e => e.target.src = `https://picsum.photos/seed/${p.id}/40/40`} />
                          <span style={{ fontWeight: 500 }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{p.category}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>₹{(p.discountPrice || p.price).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ color: p.stock > 10 ? 'var(--success)' : p.stock > 0 ? 'var(--accent)' : 'var(--danger)', fontWeight: 600 }}>{p.stock}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>{p.featured ? '⭐' : '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--bg-input)' }}>
                  {['Order #', 'User', 'Items', 'Total', 'Status', 'Date', 'Update'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{o.orderNumber}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: 12 }}>User #{o.userId}</td>
                    <td style={{ padding: '12px 16px' }}>{o.items?.length}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>₹{o.total?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'var(--accent-light)', color: 'var(--accent)' }}>{o.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)} style={{ fontSize: 12, padding: '4px 8px', width: 'auto' }}>
                        {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
