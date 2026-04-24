import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { Stars } from '../components/shop/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="spinner" />
    </div>
  );

  if (!product) return (
    <div className="page"><div className="container"><div className="empty-state"><h3>Product not found</h3><Link to="/shop" className="btn btn-primary">Back to Shop</Link></div></div></div>
  );

  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discount = hasDiscount ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;
  const images = product.images?.length ? product.images : [product.thumbnail || `https://picsum.photos/seed/${product.id}/600/600`];

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 32 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link> /
          <Link to="/shop" style={{ color: 'var(--text-muted)' }}>Shop</Link> /
          <Link to={`/shop?category=${product.category}`} style={{ color: 'var(--text-muted)' }}>{product.category}</Link> /
          <span style={{ color: 'var(--text)' }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          {/* Images */}
          <div>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--bg-input)', aspectRatio: '1', marginBottom: 12 }}>
              <img src={images[selectedImg]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => e.target.src = `https://picsum.photos/seed/${product.id}/600/600`} />
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)}
                    style={{ width: 64, height: 64, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: i === selectedImg ? '2px solid var(--accent)' : '2px solid var(--border)', cursor: 'pointer', padding: 0, background: 'var(--bg-input)' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = `https://picsum.photos/seed/${product.id + i}/64/64`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <span className="badge badge-accent">{product.category}</span>
              {product.brand && <span className="badge" style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>{product.brand}</span>}
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>{product.name}</h1>

            {product.rating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Stars rating={product.rating} size={16} />
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{product.rating} ({product.reviewCount} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, color: 'var(--text)' }}>
                ₹{price.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <>
                  <span style={{ fontSize: 20, color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{product.price.toLocaleString('en-IN')}</span>
                  <span style={{ background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>-{discount}% OFF</span>
                </>
              )}
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>{product.description}</p>

            {/* Stock */}
            <div style={{ marginBottom: 24 }}>
              {product.stock > 10 ? (
                <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: 14 }}>✓ In Stock</span>
              ) : product.stock > 0 ? (
                <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 14 }}>⚠ Only {product.stock} left!</span>
              ) : (
                <span style={{ color: 'var(--danger)', fontWeight: 600, fontSize: 14 }}>✗ Out of Stock</span>
              )}
            </div>

            {/* Quantity + CTA */}
            {product.stock > 0 && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text)' }}>-</button>
                  <span style={{ padding: '10px 16px', minWidth: 48, textAlign: 'center', fontWeight: 600 }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text)' }}>+</button>
                </div>
                <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => addToCart(product.id, qty)}>
                  Add to Cart — ₹{(price * qty).toLocaleString('en-IN')}
                </button>
              </div>
            )}

            {/* Delivery info */}
            <div className="card" style={{ padding: 16, marginTop: 8 }}>
              {[['🚚', 'Free delivery on orders above ₹500'], ['↩️', '30-day easy returns'], ['🔒', 'Secure payment guaranteed']].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span>{icon}</span> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
