import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Search, ShieldCheck, MapPin, 
  Mic, Camera, MessageCircle, BarChart3, 
  Zap, Globe, ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Citizens', value: '1.4B+' },
    { label: 'AI Accuracy', value: '95%' },
    { label: 'Routing Speed', value: '<60s' },
    { label: 'Languages', value: '22+' },
  ];

  const features = [
    { title: 'Photo Reporting', icon: <Camera />, desc: 'AI analyzes potholes & infrastructure damage instantly.' },
    { title: 'Voice Complaints', icon: <Mic />, desc: 'File grievances in your native dialect via voice.' },
    { title: 'WhatsApp Bot', icon: <MessageCircle />, desc: 'Report issues directly from your favorite chat app.' },
    { title: 'GPS Mapping', icon: <MapPin />, desc: 'Precise location auto-tagging for faster resolution.' },
    { title: 'Priority Routing', icon: <Zap />, desc: 'AI classifies urgency from P0 to P3 automatically.' },
    { title: 'Officer Dashboard', icon: <BarChart3 />, desc: 'Real-time analytics for government departments.' },
  ];

  const workflow = [
    { step: '1', title: 'Report', desc: 'File via Web, App, or WhatsApp' },
    { step: '2', title: 'Classify', desc: 'AI routes to the correct department' },
    { step: '3', title: 'Resolve', desc: 'Officers fix the issue on the ground' },
    { step: '4', title: 'Verify', desc: 'Citizen confirms and rates resolution' },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0D1B3E 0%, #1A2B5A 100%)',
        color: 'white',
        padding: '100px 0 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Abstract background elements */}
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '300px', height: '300px', background: 'rgba(255,107,0,0.1)', borderRadius: '50%', filter: 'blur(80px)' }}></div>
        <div style={{ position: 'absolute', bottom: '0', right: '0', width: '400px', height: '400px', background: 'rgba(15,157,88,0.1)', borderRadius: '50%', filter: 'blur(100px)' }}></div>

        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px' }}>
              Report Any Problem, <br/>
              <span style={{ color: 'var(--accent-saffron)' }}>Anywhere in India</span>
            </h1>
            <p style={{ fontSize: '1.5rem', opacity: 0.9, marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px' }}>
              AI-powered grievance system in 22+ Indian languages. <br/>
              "Aapki Awaaz, Hamare Kadam"
            </p>
            
            <div className="flex" style={{ justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <button className="btn-saffron" style={{ fontSize: '1.1rem', padding: '16px 40px' }} onClick={() => navigate('/report')}>
                File a Complaint
              </button>
              <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 40px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => navigate('/track')}>
                Track Status
              </button>
              <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 40px', background: 'white', color: 'var(--primary)' }} onClick={() => navigate('/login')}>
                Officer Login
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginTop: '80px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px' }}>
            {stats.map((stat, i) => (
              <div key={i}>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-saffron)' }}>{stat.value}</h2>
                <p style={{ opacity: 0.7 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '16px' }}>Smart Solutions for a New India</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Cutting-edge AI technology bridge the gap between citizens and administration.</p>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {features.map((f, i) => (
              <motion.div 
                key={i} 
                className="glass-card" 
                style={{ padding: '32px', textAlign: 'center', background: 'white' }}
                whileHover={{ y: -10, boxShadow: 'var(--shadow-lg)' }}
              >
                <div style={{ color: 'var(--accent-saffron)', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                  {React.cloneElement(f.icon, { size: 40 })}
                </div>
                <h3 style={{ marginBottom: '12px' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 0', background: '#eef2f7' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '60px' }}>How It Works</h2>
          <div className="flex" style={{ justifyContent: 'space-between', position: 'relative' }}>
            {/* Connecting Line */}
            <div style={{ position: 'absolute', top: '40px', left: '10%', right: '10%', height: '2px', background: 'rgba(13,27,62,0.1)', zIndex: 0 }}></div>
            
            {workflow.map((w, i) => (
              <div key={i} style={{ textAlign: 'center', flex: '1', zIndex: 1 }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  background: 'var(--primary)', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  margin: '0 auto 20px',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  {w.step}
                </div>
                <h4>{w.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <div className="glass-card" style={{ padding: '60px', background: 'var(--primary)', color: 'white' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Ready to make a difference?</h2>
            <button className="btn-saffron" style={{ padding: '16px 48px', fontSize: '1.2rem' }} onClick={() => navigate('/report')}>
              File a Complaint Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
