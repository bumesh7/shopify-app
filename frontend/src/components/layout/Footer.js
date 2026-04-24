import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', marginTop: 80, padding: '48px 0 24px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--accent)', marginBottom: 12 }}>SHOPAPP</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
              Your premium shopping destination. Quality products, fast delivery, exceptional service.
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 14, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Shop</h4>
            {['Electronics', 'Fashion', 'Furniture', 'Sports', 'Kitchen'].map(c => (
              <Link key={c} to={`/shop?category=${c}`} style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 14, marginBottom: 8 }}>{c}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 14, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Account</h4>
            {[['Login', '/login'], ['Register', '/register'], ['Orders', '/orders'], ['Profile', '/profile']].map(([l, h]) => (
              <Link key={l} to={h} style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 14, marginBottom: 8 }}>{l}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 14, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Support</h4>
            {['FAQ', 'Shipping Policy', 'Returns', 'Contact Us'].map(l => (
              <div key={l} style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 8 }}>{l}</div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>© 2024 ShopApp. All rights reserved.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Built with Spring Boot & React</p>
        </div>
      </div>
    </footer>
  );
}
