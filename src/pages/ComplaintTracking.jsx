import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, MapPin, Calendar, Clock, 
  MessageSquare, CheckCircle2, ChevronRight,
  ShieldAlert, Phone, Star, AlertTriangle, User
} from 'lucide-react';

import { useComplaints } from '../context/ComplaintContext';

const ComplaintTracking = () => {
  const { complaints } = useComplaints();
  const [searchId, setSearchId] = useState('SAM-2024-HR-004782');
  const [activeComplaint, setActiveComplaint] = useState(complaints[0]);

  const handleSearch = () => {
    const found = complaints.find(c => c.id.toUpperCase() === searchId.toUpperCase());
    if (found) {
      setActiveComplaint(found);
    } else {
      alert("Complaint ID not found. Try SAM-2024-HR-004782");
    }
  };

  const currentStatusIndex = (status) => {
    const statusMap = { 'Submitted': 0, 'Classified': 1, 'Assigned': 2, 'In Progress': 3, 'Resolved': 4, 'Closed': 5 };
    return statusMap[status] || 0;
  };

  const steps = [
    { label: 'Submitted', date: '27 Apr, 10:30', status: 'done' },
    { label: 'Classified', date: '27 Apr, 10:31', status: 'done' },
    { label: 'Assigned', date: '27 Apr, 11:45', status: 'done' },
    { label: 'In Progress', date: 'Active', status: 'current' },
    { label: 'Resolved', date: '-', status: 'pending' },
    { label: 'Closed', date: '-', status: 'pending' },
  ];

  const getStepStatus = (index) => {
    if (!activeComplaint) return 'pending';
    const currentIndex = currentStatusIndex(activeComplaint.status);
    if (index < currentIndex) return 'done';
    if (index === currentIndex) return 'current';
    return 'pending';
  };

  if (!activeComplaint) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Loading or No Complaints...</div>;
  }

  return (
    <div className="container" style={{ maxWidth: '900px', padding: '60px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ marginBottom: '24px' }}>Track Your Complaint</h1>
        <div style={{ display: 'flex', gap: '12px', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Enter Complaint ID (e.g. SAM-2024-HR-004782)" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }} 
            />
          </div>
          <button className="btn-primary" style={{ padding: '0 32px' }} onClick={handleSearch}>Track</button>
        </div>
      </div>

      <div className="glass-card" style={{ background: 'white', padding: '40px' }}>
        {/* Header Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid #E2E8F0' }}>
          <div>
            <div className="flex" style={{ marginBottom: '8px' }}>
              <span className={`badge badge-${activeComplaint?.priority?.toLowerCase() || 'p2'}`}>{activeComplaint?.priority || 'Medium'} HIGH</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID: {activeComplaint?.id}</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{activeComplaint?.category}</h2>
            <div className="flex" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <MapPin size={16} /> <span>{activeComplaint?.location}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ background: activeComplaint?.status === 'Submitted' ? 'rgba(0,0,0,0.05)' : 'rgba(34, 197, 94, 0.1)', color: activeComplaint?.status === 'Submitted' ? 'var(--text-muted)' : 'var(--accent-green)', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>
              {activeComplaint?.status?.toUpperCase()}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Filed {activeComplaint?.time} via {activeComplaint?.filedVia}</p>
          </div>
        </div>

        {/* Timeline Stepper */}
        <div style={{ position: 'relative', marginBottom: '60px' }}>
          <div style={{ position: 'absolute', top: '15px', left: '0', right: '0', height: '2px', background: '#F1F5F9', zIndex: 0 }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            {steps.map((s, i) => {
              const status = getStepStatus(i);
              return (
              <div key={i} style={{ textAlign: 'center', width: '80px' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: status === 'done' ? 'var(--accent-green)' : status === 'current' ? 'var(--accent-saffron)' : '#F1F5F9',
                  color: status === 'pending' ? 'var(--text-muted)' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  boxShadow: status === 'current' ? '0 0 0 4px rgba(255,107,0,0.2)' : 'none'
                }}>
                  {status === 'done' ? <CheckCircle2 size={18} /> : i + 1}
                </div>
                <p style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{s.label}</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{status === 'done' ? s.date : status === 'current' ? 'Active' : '-'}</p>
              </div>
            )})}
          </div>
        </div>

        {/* Officer & SLA Info */}
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div style={{ padding: '24px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>OFFICER ASSIGNED</h4>
            <div className="flex">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={24} />
              </div>
              <div>
                <p style={{ fontWeight: 'bold' }}>Sh. Amit Verma</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Field Inspector — PWD Div 3</p>
              </div>
            </div>
            <button style={{ marginTop: '16px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <Phone size={14} /> Contact Officer
            </button>
          </div>

          <div style={{ padding: '24px', background: '#FFF7ED', borderRadius: '16px', border: '1px solid #FFEDD5' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--accent-saffron)' }}>EXPECTED RESOLUTION</h4>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '8px' }}>Within 24 hours</p>
            <div className="flex" style={{ color: 'var(--accent-saffron)', fontSize: '0.85rem' }}>
              <Clock size={16} /> <span>P1 SLA: 21:34:12 remaining</span>
            </div>
            <div style={{ height: '4px', width: '100%', background: '#FFEDD5', borderRadius: '2px', marginTop: '16px' }}>
              <div style={{ height: '100%', background: 'var(--accent-saffron)', width: '70%', borderRadius: '2px' }}></div>
            </div>
          </div>
        </div>

        {/* WhatsApp Toggle */}
        <div style={{ marginTop: '32px', padding: '16px 24px', background: 'rgba(37, 211, 102, 0.05)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="flex">
            <MessageSquare size={20} color="#25D366" />
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Get updates on WhatsApp</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Receive real-time progress on +91-XXXXXXXXXX</p>
            </div>
          </div>
          <div style={{ width: '44px', height: '24px', background: '#25D366', borderRadius: '12px', position: 'relative' }}>
             <div style={{ position: 'absolute', right: '2px', top: '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%' }}></div>
          </div>
        </div>

        {/* Escalation Context */}
        <div style={{ marginTop: '40px', borderTop: '1px solid #F1F5F9', paddingTop: '32px', display: 'flex', gap: '24px', justifyContent: 'center' }}>
           <button style={{ color: '#EF4444', background: 'transparent', border: 'none', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
             <ShieldAlert size={16} /> Escalated to District Collector?
           </button>
           <button style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
             <AlertTriangle size={16} /> File RTI Request
           </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintTracking;
