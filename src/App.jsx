import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import ComplaintForm from './pages/ComplaintForm';
import OfficerDashboard from './pages/OfficerDashboard';
import ComplaintTracking from './pages/ComplaintTracking';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import WhatsAppBot from './pages/WhatsAppBot';
import MobileAppScanner from './pages/MobileAppScanner';
import LoginPage from './pages/LoginPage';

import { ComplaintProvider } from './context/ComplaintContext';

function App() {
  return (
    <ComplaintProvider>
      <Router>
        <div className="app-container">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/report" element={<ComplaintForm />} />
            <Route path="/track" element={<ComplaintTracking />} />
            <Route path="/officer" element={<OfficerDashboard />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/whatsapp" element={<WhatsAppBot />} />
            <Route path="/scanner" element={<MobileAppScanner />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        
        {/* Quick Access Floating Buttons (Optional but helpful for high-fidelity demos) */}
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 100 }}>
          <button 
            onClick={() => window.location.href = '/whatsapp'}
            style={{ padding: '12px', borderRadius: '50%', background: '#25D366', border: 'none', color: 'white', cursor: 'pointer', boxShadow: 'var(--shadow-lg)' }}
          >
            WA
          </button>
          <button 
            onClick={() => window.location.href = '/scanner'}
            style={{ padding: '12px', borderRadius: '50%', background: 'var(--accent-saffron)', border: 'none', color: 'white', cursor: 'pointer', boxShadow: 'var(--shadow-lg)' }}
          >
            AI
          </button>
        </div>
      </div>
    </Router>
  </ComplaintProvider>
  );
}

export default App;
