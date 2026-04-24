import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/shop/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/products/featured'),
      api.get('/categories'),
    ]).then(([f, c]) => {
      setFeatured(f.data);
      setCategories(c.data);
    }).finally(() => setLoading(false));
  }, []);

  const categoryIcons = { Electronics: '⚡', Fashion: '👗', Furniture: '🛋️', Sports: '🏋️', Kitchen: '☕', Bags: '👜', Lifestyle: '🌿' };

  return (
    <div className="page">
      {/* Hero */}
      <section style={{ padding: '80px 0 60px', background: 'linear-gradient(135deg, var(--bg) 0%, var(--accent-light) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(var(--accent) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="badge badge-accent" style={{ marginBottom: 20, fontSize: 12 }}>New Arrivals This Season</div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: 20, letterSpacing: '-2px' }}>
            Shop the <span style={{ color: 'var(--accent)' }}>Best</span><br />Products Online
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Curated selection of premium products. Fast delivery across India. Easy returns.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn btn-primary btn-lg">Shop Now</Link>
            <Link to="/shop?category=Electronics" className="btn btn-outline btn-lg">View Electronics</Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 60, flexWrap: 'wrap' }}>
            {[['10K+', 'Products'], ['50K+', 'Happy Customers'], ['4.8★', 'Average Rating'], ['Free', 'Shipping ₹500+']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'var(--accent)' }}>{v}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h2 style={{ fontSize: '1.8rem' }}>Browse Categories</h2>
            <Link to="/shop" style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 500 }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                className="btn btn-outline"
                onClick={() => navigate(`/shop?category=${cat}`)}
                style={{ gap: 8 }}
              >
                <span>{categoryIcons[cat] || '🛍️'}</span> {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '20px 0 60px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h2 style={{ fontSize: '1.8rem' }}>Featured Products</h2>
            <Link to="/shop" style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 500 }}>See all →</Link>
          </div>
          {loading ? (
            <div className="product-grid">
              {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : (
            <div className="product-grid">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Banner */}
      <section style={{ padding: '0 0 60px' }}>
        <div className="container">
          <div style={{ background: 'var(--accent)', borderRadius: 'var(--radius-lg)', padding: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: 8 }}>Free Shipping on Orders ₹500+</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>Shop more, save more. No promo code needed.</p>
            </div>
            <Link to="/shop" className="btn" style={{ background: '#fff', color: 'var(--accent)', fontWeight: 700, padding: '14px 28px', borderRadius: 'var(--radius)' }}>
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="card">
      <div className="skeleton" style={{ aspectRatio: '1' }} />
      <div style={{ padding: 16 }}>
        <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 20, width: '50%', marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 36 }} />
      </div>
    </div>
  );
}
