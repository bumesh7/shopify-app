import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, updateQuantity, removeItem, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return (
    <div className="page"><div className="container"><div className="empty-state" style={{ paddingTop: 120 }}>
      <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      <h3>Please login to view your cart</h3>
      <Link to="/login" className="btn btn-primary">Login</Link>
    </div></div></div>
  );

  if (cart.items?.length === 0) return (
    <div className="page"><div className="container"><div className="empty-state" style={{ paddingTop: 120 }}>
      <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      <h3>Your cart is empty</h3>
      <p>Add some products to get started</p>
      <Link to="/shop" className="btn btn-primary">Browse Products</Link>
    </div></div></div>
  );

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 32 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: 28 }}>Shopping Cart <span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 400 }}>({cart.itemCount} items)</span></h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cart.items?.map(item => (
              <div key={item.id} className="card" style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                <Link to={`/product/${item.productId}`}>
                  <img src={item.thumbnail || `https://picsum.photos/seed/${item.productId}/100/100`}
                    alt={item.productName} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    onError={e => e.target.src = `https://picsum.photos/seed/${item.productId}/100/100`} />
                </Link>
                <div style={{ flex: 1 }}>
                  <Link to={`/product/${item.productId}`}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, marginBottom: 4 }}>{item.productName}</h3>
                  </Link>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                    ₹{(item.discountPrice || item.price).toLocaleString('en-IN')} each
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '4px 12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>-</button>
                      <span style={{ padding: '4px 10px', fontWeight: 600, fontSize: 14 }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.availableStock} style={{ padding: '4px 12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: 13, padding: '4px 8px' }}>Remove</button>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
                    ₹{item.subtotal?.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="card" style={{ padding: 24, position: 'sticky', top: 84 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 20 }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {[['Subtotal', cart.subtotal], ['Shipping', cart.shipping], ['Tax (18% GST)', cart.tax]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{l}</span>
                  <span>{l === 'Shipping' && v === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : `₹${v?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}</span>
                </div>
              ))}
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
                <span>Total</span>
                <span>₹{cart.total?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
            {cart.shipping === 0 && (
              <div style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: 13, marginBottom: 16, textAlign: 'center', fontWeight: 500 }}>
                🎉 You qualify for free shipping!
              </div>
            )}
            <button className="btn btn-primary btn-lg w-full" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
            <Link to="/shop" className="btn btn-ghost btn-sm w-full" style={{ marginTop: 10, justifyContent: 'center' }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
