import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Globe, Bell, User } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/report', label: 'File Complaint' },
    { path: '/track', label: 'Track Status' },
    { path: '/officer', label: 'Officer Portal' },
    { path: '/analytics', label: 'Analytics' },
  ];

  return (
    <nav style={{
      background: 'var(--primary)',
      color: 'white',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: 'var(--shadow-md)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'white' }}>
          <div style={{
            background: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-saffron)'
          }}>
            <Shield size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', lineHeight: '1' }}>SAMADHAN AI</h1>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px' }}>समाधान AI</p>
          </div>
        </Link>

        <div className="flex" style={{ gap: '32px' }}>
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              style={{
                textDecoration: 'none',
                color: location.pathname === link.path ? 'var(--accent-saffron)' : 'white',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex" style={{ gap: '16px', alignItems: 'center' }}>
          <button className="btn-primary" style={{ fontSize: '0.9rem', padding: '8px 16px', background: 'white', color: 'var(--primary)', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={() => navigate('/login')}>
            Officer Login
          </button>
          <div className="flex" style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer' }}>
            <Globe size={16} />
            <span style={{ fontSize: '0.8rem' }}>🇮🇳 EN</span>
          </div>
          <Bell size={20} style={{ cursor: 'pointer' }} />
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2D3748', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => window.location.href = '/login'}>
            <User size={20} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
