import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/shop/ProductCard';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '0');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (query) {
        res = await api.get(`/products/search?q=${encodeURIComponent(query)}&page=${page}&size=12`);
      } else {
        res = await api.get(`/products?page=${page}&size=12${category ? `&category=${category}` : ''}&sort=${sort}`);
      }
      setProducts(res.data.content);
      setPagination({ page: res.data.number, totalPages: res.data.totalPages, totalElements: res.data.totalElements });
    } catch {}
    setLoading(false);
  }, [category, sort, query, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { api.get('/categories').then(r => setCategories(r.data)).catch(() => {}); }, []);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 32 }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '2rem', marginBottom: 6 }}>
            {query ? `Results for "${query}"` : category ? category : 'All Products'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {pagination.totalElements} products found
          </p>
        </div>

        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
          {/* Sidebar */}
          <aside style={{ width: 220, flexShrink: 0, position: 'sticky', top: 84 }}>
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 }}>Categories</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <button
                  onClick={() => setParam('category', '')}
                  style={{ textAlign: 'left', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: 'none', background: !category ? 'var(--accent-light)' : 'transparent', color: !category ? 'var(--accent)' : 'var(--text)', cursor: 'pointer', fontSize: 14, fontWeight: !category ? 600 : 400 }}
                >
                  All Categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setParam('category', cat)}
                    style={{ textAlign: 'left', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: 'none', background: category === cat ? 'var(--accent-light)' : 'transparent', color: category === cat ? 'var(--accent)' : 'var(--text)', cursor: 'pointer', fontSize: 14, fontWeight: category === cat ? 600 : 400 }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main */}
          <div style={{ flex: 1 }}>
            {/* Sort bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[['newest', 'Newest'], ['price_asc', 'Price ↑'], ['price_desc', 'Price ↓'], ['rating', 'Rating']].map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => setParam('sort', v)}
                    className={sort === v ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {(category || query) && (
                <button className="btn btn-ghost btn-sm" onClick={() => setSearchParams({})}>
                  Clear filters ✕
                </button>
              )}
            </div>

            {/* Products */}
            {loading ? (
              <div className="product-grid">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="card">
                    <div className="skeleton" style={{ aspectRatio: '1' }} />
                    <div style={{ padding: 16 }}>
                      <div className="skeleton" style={{ height: 12, marginBottom: 8 }} />
                      <div className="skeleton" style={{ height: 16, marginBottom: 12, width: '70%' }} />
                      <div className="skeleton" style={{ height: 20, marginBottom: 16, width: '40%' }} />
                      <div className="skeleton" style={{ height: 36 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="product-grid">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                <button className="btn btn-outline btn-sm" disabled={page === 0}
                  onClick={() => setParam('page', page - 1)}>← Prev</button>
                {[...Array(Math.min(pagination.totalPages, 7))].map((_, i) => (
                  <button key={i} className={`btn btn-sm ${page === i ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setParam('page', i)}>{i + 1}</button>
                ))}
                <button className="btn btn-outline btn-sm" disabled={page >= pagination.totalPages - 1}
                  onClick={() => setParam('page', page + 1)}>Next →</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
