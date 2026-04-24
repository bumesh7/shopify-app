import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, loading } = useCart();
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discount = hasDiscount ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

  return (
    <div className="card fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
      <Link to={`/product/${product.id}`} style={{ position: 'relative', overflow: 'hidden', display: 'block', aspectRatio: '1', background: 'var(--bg-input)' }}>
        <img
          src={product.thumbnail || `https://picsum.photos/seed/${product.id}/400/400`}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          onError={e => { e.target.src = `https://picsum.photos/seed/${product.id}/400/400`; }}
        />
        {hasDiscount && (
          <span style={{ position: 'absolute', top: 10, left: 10, background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
            -{discount}%
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span style={{ position: 'absolute', top: 10, right: 10, background: 'var(--danger)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Out of Stock</span>
          </div>
        )}
      </Link>

      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
          {product.category}
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, marginBottom: 6, lineHeight: 1.3, color: 'var(--text)' }} className="truncate">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            <Stars rating={product.rating} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>({product.reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 'auto' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>
            ₹{(hasDiscount ? product.discountPrice : product.price).toLocaleString('en-IN')}
          </span>
          {hasDiscount && (
            <span style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <button
          className="btn btn-primary w-full"
          onClick={() => addToCart(product.id)}
          disabled={loading || product.stock === 0}
          style={{ fontSize: 13 }}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export function Stars({ rating, size = 12 }) {
  return (
    <div style={{ display: 'flex', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill={s <= Math.round(rating) ? 'var(--accent)' : 'var(--border)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}
