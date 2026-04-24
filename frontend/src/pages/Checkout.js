import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1=address, 2=payment, 3=review
  const [newAddr, setNewAddr] = useState({ label: 'Home', fullName: '', phone: '', street: '', city: '', state: '', postalCode: '', country: 'India', isDefault: false });
  const [showNewAddr, setShowNewAddr] = useState(false);

  useEffect(() => {
    api.get('/addresses').then(r => { setAddresses(r.data); if (r.data.length > 0) setSelectedAddr(r.data.find(a => a.isDefault)?.id || r.data[0].id); }).catch(() => {});
  }, []);

  const saveAddress = async () => {
    try {
      const { data } = await api.post('/addresses', newAddr);
      setAddresses(prev => [...prev, data]);
      setSelectedAddr(data.id);
      setShowNewAddr(false);
      toast.success('Address saved');
    } catch { toast.error('Failed to save address'); }
  };

  const placeOrder = async () => {
    if (!selectedAddr) { toast.error('Please select a delivery address'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/orders', { shippingAddressId: selectedAddr, paymentMethod });
      await fetchCart();
      navigate(`/orders/${data.orderNumber}`, { state: { success: true } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 32, maxWidth: 900 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: 28 }}>Checkout</h1>

        {/* Steps */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 36 }}>
          {['Delivery Address', 'Payment', 'Review & Place Order'].map((s, i) => (
            <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: step > i + 1 ? 'var(--success)' : step === i + 1 ? 'var(--accent)' : 'var(--bg-input)', color: step >= i + 1 ? '#fff' : 'var(--text-muted)', flexShrink: 0 }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? 'var(--text)' : 'var(--text-muted)' }}>{s}</span>
              </div>
              {i < 2 && <div style={{ height: 1, flex: 1, background: 'var(--border)', margin: '0 8px' }} />}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
          <div>
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ marginBottom: 20 }}>Select Delivery Address</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                  {addresses.map(addr => (
                    <label key={addr.id} style={{ display: 'flex', gap: 12, padding: 16, borderRadius: 'var(--radius)', border: `2px solid ${selectedAddr === addr.id ? 'var(--accent)' : 'var(--border)'}`, cursor: 'pointer', background: selectedAddr === addr.id ? 'var(--accent-light)' : 'var(--bg-card)' }}>
                      <input type="radio" name="address" checked={selectedAddr === addr.id} onChange={() => setSelectedAddr(addr.id)} style={{ width: 'auto', marginTop: 2 }} />
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 2 }}>{addr.fullName} <span className="badge badge-accent" style={{ fontSize: 10, marginLeft: 6 }}>{addr.label}</span></div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{addr.street}, {addr.city}, {addr.state} - {addr.postalCode}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>📞 {addr.phone}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {!showNewAddr ? (
                  <button className="btn btn-outline btn-sm" onClick={() => setShowNewAddr(true)}>+ Add New Address</button>
                ) : (
                  <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
                    <h4 style={{ marginBottom: 14 }}>New Address</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {[['fullName', 'Full Name'], ['phone', 'Phone'], ['street', 'Street Address'], ['city', 'City'], ['state', 'State'], ['postalCode', 'PIN Code']].map(([k, l]) => (
                        <div key={k} style={{ gridColumn: k === 'street' ? '1/-1' : undefined }}>
                          <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>{l}</label>
                          <input value={newAddr[k]} onChange={e => setNewAddr(p => ({ ...p, [k]: e.target.value }))} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button className="btn btn-primary btn-sm" onClick={saveAddress}>Save Address</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setShowNewAddr(false)}>Cancel</button>
                    </div>
                  </div>
                )}
                <button className="btn btn-primary btn-lg" style={{ marginTop: 20 }} onClick={() => setStep(2)} disabled={!selectedAddr}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ marginBottom: 20 }}>Select Payment Method</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {[['COD', 'Cash on Delivery', '💵', 'Pay when your order arrives'], ['UPI', 'UPI Payment', '📱', 'Google Pay, PhonePe, Paytm'], ['CARD', 'Credit / Debit Card', '💳', 'Visa, Mastercard, RuPay']].map(([v, l, icon, sub]) => (
                    <label key={v} style={{ display: 'flex', gap: 12, padding: 16, borderRadius: 'var(--radius)', border: `2px solid ${paymentMethod === v ? 'var(--accent)' : 'var(--border)'}`, cursor: 'pointer', background: paymentMethod === v ? 'var(--accent-light)' : 'var(--bg-card)', alignItems: 'center' }}>
                      <input type="radio" name="payment" checked={paymentMethod === v} onChange={() => setPaymentMethod(v)} style={{ width: 'auto' }} />
                      <span style={{ fontSize: 22 }}>{icon}</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{l}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => setStep(3)}>Review Order →</button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ marginBottom: 20 }}>Review Your Order</h3>
                <div style={{ marginBottom: 16 }}>
                  {cart.items?.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                      <img src={item.thumbnail || `https://picsum.photos/seed/${item.productId}/60/60`} alt={item.productName} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} onError={e => e.target.src = `https://picsum.photos/seed/${item.productId}/60/60`} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{item.productName}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                      </div>
                      <div style={{ fontWeight: 700 }}>₹{item.subtotal?.toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
                  <div><strong>Payment:</strong> {paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod === 'UPI' ? 'UPI' : 'Card'}</div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={placeOrder} disabled={loading}>
                    {loading ? 'Placing Order…' : `Place Order — ₹${cart.total?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Summary sidebar */}
          <div className="card" style={{ padding: 20, position: 'sticky', top: 84 }}>
            <h4 style={{ marginBottom: 14, fontSize: 15 }}>Cart Summary</h4>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{cart.itemCount} items</div>
            {[['Subtotal', `₹${cart.subtotal?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`], ['Shipping', cart.shipping === 0 ? 'FREE' : `₹${cart.shipping}`], ['Tax', `₹${cart.tax?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`]].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{l}</span>
                <span style={{ color: l === 'Shipping' && cart.shipping === 0 ? 'var(--success)' : 'var(--text)', fontWeight: l === 'Shipping' && cart.shipping === 0 ? 600 : 400 }}>{v}</span>
              </div>
            ))}
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17 }}>
              <span>Total</span>
              <span>₹{cart.total?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
