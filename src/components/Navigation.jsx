import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Globe, Bell, User, ChevronDown, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useComplaints } from '../context/ComplaintContext';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { officer, logout } = useComplaints();
  const [lang, setLang] = useState('EN');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  
  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/report', label: t('nav.file_complaint') },
    { path: '/track', label: t('nav.track_status') },
  ];

  if (officer) {
    navLinks.push({ path: '/officer', label: t('nav.officer_portal') });
    navLinks.push({ path: '/analytics', label: t('nav.analytics') });
  }

  const handleLangChange = (lngCode, lngName) => {
    i18n.changeLanguage(lngCode);
    setLang(lngName);
    setShowLangDropdown(false);
  };

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
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px' }}>समाधान | समस्या निवारण</p>
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
          {!officer ? (
            <button className="btn-primary" style={{ fontSize: '0.9rem', padding: '8px 16px', background: 'white', color: 'var(--primary)', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={() => navigate('/login')}>
              {t('nav.login')}
            </button>
          ) : (
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '5px', cursor: 'pointer' }} onClick={() => { logout(); navigate('/'); }}>
              <LogOut size={16} /> Logout
            </button>
          )}
          
          <div style={{ position: 'relative' }}>
            <div className="flex" style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', gap: '6px' }} onClick={() => setShowLangDropdown(!showLangDropdown)}>
              <Globe size={16} />
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>{i18n.language.substring(0,2)}</span>
              <ChevronDown size={14} />
            </div>
            {showLangDropdown && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'white', borderRadius: '8px', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', color: 'var(--text-dark)', minWidth: '120px' }}>
                <div style={{ padding: '10px 16px', cursor: 'pointer', fontSize: '0.9rem', borderBottom: '1px solid #f1f5f9' }} onClick={() => handleLangChange('en', 'EN')}>English</div>
                <div style={{ padding: '10px 16px', cursor: 'pointer', fontSize: '0.9rem', borderBottom: '1px solid #f1f5f9' }} onClick={() => handleLangChange('hi', 'HI')}>हिंदी</div>
                <div style={{ padding: '10px 16px', cursor: 'pointer', fontSize: '0.9rem', borderBottom: '1px solid #f1f5f9' }} onClick={() => handleLangChange('mr', 'MR')}>मराठी</div>
                <div style={{ padding: '10px 16px', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => handleLangChange('kn', 'KN')}>ಕನ್ನಡ</div>
              </div>
            )}
          </div>

          <Bell size={20} style={{ cursor: 'pointer' }} />
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2D3748', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => navigate('/login')}>
            <User size={20} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

