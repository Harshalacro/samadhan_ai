import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import ComplaintForm from './pages/ComplaintForm';
import OfficerDashboard from './pages/OfficerDashboard';
import ComplaintTracking from './pages/ComplaintTracking';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import ChatBot from './components/ChatBot';
import MobileAppScanner from './pages/MobileAppScanner';
import LoginPage from './pages/LoginPage';
import PotholeDetection from './pages/PotholeDetection';
import WasteManagement from './pages/WasteManagement';
import FloatingWhatsApp from './components/FloatingWhatsApp';


import { ComplaintProvider, useComplaints } from './context/ComplaintContext';

const ProtectedRoute = ({ children }) => {
  const { officer } = useComplaints();
  if (!officer) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

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
            <Route path="/officer" element={<ProtectedRoute><OfficerDashboard /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
            <Route path="/scanner" element={<MobileAppScanner />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/pothole" element={<PotholeDetection />} />
            <Route path="/waste" element={<WasteManagement />} />

          </Routes>
        </main>
        
        {/* Quick Access Floating Buttons (Optional but helpful for high-fidelity demos) */}
        <div style={{ position: 'fixed', bottom: '90px', right: '24px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 100 }}>
          <button 
            onClick={() => window.location.href = '/scanner'}
            style={{ padding: '12px', borderRadius: '50%', background: 'var(--accent-saffron)', border: 'none', color: 'white', cursor: 'pointer', boxShadow: 'var(--shadow-lg)' }}
          >
            AI
          </button>
        </div>
        
        {/* Global ChatBot Widget */}
        <ChatBot />
        <FloatingWhatsApp />
      </div>
    </Router>
  </ComplaintProvider>
  );
}

export default App;
