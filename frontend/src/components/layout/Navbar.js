import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'var(--nav-bg)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 64, gap: 16 }}>
        {/* Logo */}
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--accent)', letterSpacing: '-0.5px', flexShrink: 0 }}>
          SHOPAPP
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 420, display: 'flex' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              style={{ paddingLeft: 40, height: 38, fontSize: 13 }}
            />
            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
        </form>

        {/* Nav links - desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
          <NavLink to="/shop">Shop</NavLink>
          {user && <NavLink to="/orders">Orders</NavLink>}
          {user?.role === 'ADMIN' && <NavLink to="/admin">Admin</NavLink>}

          {/* Theme toggle */}
          <button className="btn btn-ghost btn-icon" onClick={toggleTheme} title="Toggle theme" style={{ marginLeft: 4 }}>
            {theme === 'light' ? (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            ) : (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            )}
          </button>

          {/* Cart */}
          <Link to="/cart" className="btn btn-ghost btn-icon" style={{ position: 'relative', marginLeft: 4 }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cart.itemCount > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--accent)', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cart.itemCount > 99 ? '99+' : cart.itemCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ gap: 6 }}
              >
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                  {user.firstName?.[0]?.toUpperCase()}
                </div>
                {user.firstName}
              </button>
              {menuOpen && (
                <div style={{ position: 'absolute', right: 0, top: '110%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 6, minWidth: 160, boxShadow: 'var(--shadow-lg)', zIndex: 100 }}>
                  <Link to="/profile" style={{ display: 'block', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: 14, color: 'var(--text)' }}
                    onMouseEnter={e => e.target.style.background = 'var(--bg-input)'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}>
                    Profile
                  </Link>
                  <Link to="/orders" style={{ display: 'block', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: 14, color: 'var(--text)' }}
                    onMouseEnter={e => e.target.style.background = 'var(--bg-input)'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}>
                    My Orders
                  </Link>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                  <button onClick={logout} style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)', fontSize: 14, color: 'var(--danger)' }}
                    onMouseEnter={e => e.target.style.background = 'var(--danger-light)'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to || location.pathname.startsWith(to + '/');
  return (
    <Link to={to} style={{
      padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: 14, fontWeight: 500,
      color: active ? 'var(--accent)' : 'var(--text-secondary)',
      background: active ? 'var(--accent-light)' : 'transparent',
      transition: 'all 0.2s',
    }}>
      {children}
    </Link>
  );
}
