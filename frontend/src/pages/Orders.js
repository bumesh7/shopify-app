import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import api from '../utils/api';

const STATUS_COLORS = {
  PENDING: { bg: 'var(--accent-light)', color: 'var(--accent)' },
  CONFIRMED: { bg: 'var(--accent-light)', color: 'var(--accent)' },
  PROCESSING: { bg: '#FFF3CD', color: '#856404' },
  SHIPPED: { bg: '#D1ECF1', color: '#0C5460' },
  DELIVERED: { bg: 'var(--success-light)', color: 'var(--success)' },
  CANCELLED: { bg: 'var(--danger-light)', color: 'var(--danger)' },
};

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data.content)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page" style={{ display: 'flex', justifyContent: 'center', paddingTop: 120 }}><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 32 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: 28 }}>My Orders</h1>
        {orders.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <h3>No orders yet</h3>
            <p>When you place orders, they'll appear here</p>
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map(order => {
              const sc = STATUS_COLORS[order.status] || STATUS_COLORS.PENDING;
              return (
                <Link key={order.id} to={`/orders/${order.orderNumber}`} style={{ display: 'block' }}>
                  <div className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{order.orderNumber}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color }}>{order.status}</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>₹{order.total?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
                      <span>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
                      <span>·</span>
                      <span>{order.paymentMethod}</span>
                      {order.trackingNumber && <><span>·</span><span>Track: {order.trackingNumber}</span></>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function OrderDetail() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${orderNumber}`).then(r => setOrder(r.data)).finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) return <div className="page" style={{ display: 'flex', justifyContent: 'center', paddingTop: 120 }}><div className="spinner" /></div>;
  if (!order) return <div className="page"><div className="container"><div className="empty-state"><h3>Order not found</h3></div></div></div>;

  const sc = STATUS_COLORS[order.status] || STATUS_COLORS.PENDING;
  const steps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentStep = steps.indexOf(order.status);

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 32, maxWidth: 800 }}>
        {location.state?.success && (
          <div style={{ background: 'var(--success-light)', border: '1px solid var(--success)', color: 'var(--success)', padding: '14px 20px', borderRadius: 'var(--radius)', marginBottom: 24, fontWeight: 600, fontSize: 15 }}>
            🎉 Order placed successfully! Thank you for shopping with us.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', marginBottom: 4 }}>{order.orderNumber}</h1>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</div>
          </div>
          <span style={{ padding: '6px 14px', borderRadius: 20, fontWeight: 700, fontSize: 13, background: sc.bg, color: sc.color }}>{order.status}</span>
        </div>

        {/* Progress */}
        {!['CANCELLED', 'REFUNDED'].includes(order.status) && (
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <h3 style={{ marginBottom: 20, fontSize: 15 }}>Order Progress</h3>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {steps.map((s, i) => (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: i <= currentStep ? 'var(--accent)' : 'var(--bg-input)', color: i <= currentStep ? '#fff' : 'var(--text-muted)', border: `2px solid ${i <= currentStep ? 'var(--accent)' : 'var(--border)'}` }}>
                      {i < currentStep ? '✓' : i + 1}
                    </div>
                    <span style={{ fontSize: 10, color: i <= currentStep ? 'var(--accent)' : 'var(--text-muted)', textAlign: 'center', maxWidth: 60 }}>{s}</span>
                  </div>
                  {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: i < currentStep ? 'var(--accent)' : 'var(--border)', margin: '0 4px', marginBottom: 20 }} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <h3 style={{ marginBottom: 16, fontSize: 15 }}>Order Items</h3>
          {order.items?.map(item => (
            <div key={item.productId} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <img src={item.thumbnail || `https://picsum.photos/seed/${item.productId}/60/60`} alt={item.productName} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} onError={e => e.target.src = `https://picsum.photos/seed/${item.productId}/60/60`} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: 2 }}>{item.productName}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Qty: {item.quantity} × ₹{item.unitPrice?.toLocaleString('en-IN')}</div>
              </div>
              <div style={{ fontWeight: 700 }}>₹{item.totalPrice?.toLocaleString('en-IN')}</div>
            </div>
          ))}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[['Subtotal', order.subtotal], ['Shipping', order.shippingCost], ['Tax', order.tax]].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{l}</span>
                <span>{l === 'Shipping' && v === 0 ? 'FREE' : `₹${v?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17, borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4 }}>
              <span>Total</span>
              <span>₹{order.total?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>

        <Link to="/orders" className="btn btn-outline">← Back to Orders</Link>
      </div>
    </div>
  );
}
