import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Briefcase, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [type, setType] = useState('citizen');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (type === 'officer') {
      navigate('/officer');
    } else {
      navigate('/report');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F6FB', padding: '20px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card" 
        style={{ width: '100%', maxWidth: '450px', background: 'white', padding: '40px', textAlign: 'center' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={32} />
          </div>
        </div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Login to SAMADHAN AI</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Aapki Awaaz, Hamare Kadam</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px', background: '#F1F5F9', padding: '4px', borderRadius: '12px' }}>
          <button 
            onClick={() => setType('citizen')}
            style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              border: 'none', 
              background: type === 'citizen' ? 'white' : 'transparent',
              color: type === 'citizen' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: '600',
              boxShadow: type === 'citizen' ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <User size={18} /> Citizen
          </button>
          <button 
            onClick={() => setType('officer')}
            style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              border: 'none', 
              background: type === 'officer' ? 'white' : 'transparent',
              color: type === 'officer' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: '600',
              boxShadow: type === 'officer' ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Briefcase size={18} /> Officer
          </button>
        </div>

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
              {type === 'citizen' ? 'Mobile Number' : 'Officer ID / Email'}
            </label>
            <input 
              type="text" 
              placeholder={type === 'citizen' ? 'Enter 10-digit mobile' : 'Enter Employee ID'} 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }} 
              required
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>OTP / Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                placeholder="••••••" 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }} 
                required
              />
              <Lock size={18} style={{ position: 'absolute', right: '12px', top: '12px', color: '#CBD5E0' }} />
            </div>
            {type === 'citizen' && <p style={{ fontSize: '0.75rem', color: 'var(--accent-saffron)', marginTop: '8px', textAlign: 'right', cursor: 'pointer', fontWeight: '600' }}>Resend OTP</p>}
          </div>

          <button className="btn-saffron" style={{ width: '100%', padding: '14px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            Login Now <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #F1F5F9' }}>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
             <ShieldCheck size={16} color="var(--accent-green)" /> Secured by Govt. of India (DigiLocker)
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
