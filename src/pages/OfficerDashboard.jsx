import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, LayoutDashboard, MessageSquare, Map as MapIcon, 
  Settings, Bell, Search, Filter, ChevronRight, MapPin, 
  Clock, ArrowUpRight, ArrowDownRight, User, Phone, CheckCircle2,
  AlertCircle, Sparkles
} from 'lucide-react';

import { useComplaints } from '../context/ComplaintContext';

const OfficerDashboard = () => {
  const { complaints, updateComplaintStatus } = useComplaints();
  const [selectedId, setSelectedId] = useState(complaints[0]?.id || '');
  const [filter, setFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('Dashboard');

  const stats = [
    { label: "Today's Complaints", value: complaints.length.toString(), trend: '+12%', up: true },
    { label: "Resolved", value: '23', trend: '+5%', up: true },
    { label: "Pending", value: complaints.filter(c => c.status !== 'Resolved').length.toString(), trend: '-2%', up: false },
    { label: "Critical P0", value: complaints.filter(c => c.priority?.includes('P0')).length.toString(), trend: 'High', up: true, critical: true },
  ];

  const selected = complaints.find(c => c.id === selectedId) || complaints[0];

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  if (complaints.length === 0) {
    return (
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)', background: '#F8FAFC', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <LayoutDashboard size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
        <h2>No complaints received yet</h2>
        <p style={{ color: 'var(--text-muted)' }}>Real-time data will appear here once citizens start reporting.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)', background: '#F8FAFC' }}>
      {/* Sidebar - Small variant for layout */}
      <div style={{ width: '240px', background: 'white', borderRight: '1px solid #E2E8F0', padding: '24px 0' }}>
        <div style={{ padding: '0 24px', marginBottom: '32px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Main Menu</p>
        </div>
        {[
          { icon: <LayoutDashboard size={20}/>, label: 'Dashboard', active: true },
          { icon: <MessageSquare size={20}/>, label: 'Complaints', active: false },
          { icon: <MapIcon size={20}/>, label: 'Map View', active: false },
          { icon: <BarChart3 size={20}/>, label: 'Analytics', active: false },
          { icon: <Settings size={20}/>, label: 'Settings', active: false },
        ].map((item, i) => (
          <div key={i} 
            onClick={() => setActiveTab(item.label)}
            style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '12px 24px', 
            cursor: 'pointer',
            background: activeTab === item.label ? 'rgba(13,27,62,0.05)' : 'transparent',
            borderRight: activeTab === item.label ? '3px solid var(--primary)' : 'none',
            color: activeTab === item.label ? 'var(--primary)' : 'var(--text-muted)'
          }}>
            {item.icon}
            <span style={{ fontWeight: activeTab === item.label ? '600' : '400' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem' }}>Welcome back, Officer</h1>
            <p style={{ color: 'var(--text-muted)' }}>Admin Dashboard — SAMADHAN AI Engine</p>
          </div>
          <div className="flex">
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Search ID, Name..." style={{ padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid #E2E8F0', width: '250px' }} />
            </div>
            <div style={{ position: 'relative' }}>
               <Bell size={20} />
               <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{complaints.length}</span>
            </div>
          </div>
        </div>

        {/* Conditional Rendering based on Tab */}
        {activeTab === 'Map View' ? (
          <div className="glass-card" style={{ background: 'white', height: '600px', overflow: 'hidden', padding: '0' }}>
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight="0" 
              marginWidth="0" 
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(selected?.location?.split(',')[1] || 77.4143) - 0.05},${parseFloat(selected?.location?.split(',')[0] || 23.1968) - 0.05},${parseFloat(selected?.location?.split(',')[1] || 77.4143) + 0.05},${parseFloat(selected?.location?.split(',')[0] || 23.1968) + 0.05}&layer=mapnik&marker=${selected?.location?.split(',')[0] || '23.1968'},${selected?.location?.split(',')[1] || '77.4143'}`}
            ></iframe>
            <div style={{ padding: '16px', background: 'white', borderTop: '1px solid #E2E8F0' }}>
               <p style={{ fontWeight: 'bold' }}>Live Grievance Heatmap</p>
               <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Showing {complaints.length} active reports across the district.</p>
            </div>
          </div>
        ) : activeTab === 'Dashboard' ? (
          <>
            {/* Stats Row */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '32px' }}>
              {stats.map((s, i) => (
                <div key={i} className="glass-card" style={{ padding: '20px', background: 'white' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{s.label}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                    <h2 style={{ fontSize: '1.75rem' }}>{s.value}</h2>
                    <div style={{ color: s.up ? 'var(--accent-green)' : 'red', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {s.up ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {s.trend}
                    </div>
                  </div>
                  {s.critical && <div style={{ height: '4px', width: '100%', background: 'red', borderRadius: '2px', marginTop: '12px', opacity: 0.2 }}></div>}
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
          {/* Complaints Table */}
          <div className="glass-card" style={{ background: 'white', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
              <div className="flex" style={{ gap: '24px' }}>
                {['All', 'Critical', 'Assigned', 'In Progress', 'Resolved'].map(t => (
                  <span key={t} onClick={() => setFilter(t)} style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: filter === t ? '600' : '400',
                    color: filter === t ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    position: 'relative',
                    paddingBottom: '4px'
                  }}>
                    {t}
                    {filter === t && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--primary)' }}></div>}
                   </span>
                ))}
              </div>
              <Filter size={18} color="var(--text-muted)" />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: '#F8FAFC', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <tr>
                  <th style={{ padding: '16px' }}>Complaint ID</th>
                  <th style={{ padding: '16px' }}>Citizen</th>
                  <th style={{ padding: '16px' }}>Location</th>
                  <th style={{ padding: '16px' }}>Priority</th>
                  <th style={{ padding: '16px' }}>Status</th>
                  <th style={{ padding: '16px' }}>AI Match</th>
                  <th style={{ padding: '16px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F1F5F9', background: selectedId === c.id ? 'rgba(13,27,62,0.02)' : 'transparent', cursor: 'pointer' }} onClick={() => setSelectedId(c.id)}>
                    <td style={{ padding: '16px', fontWeight: '500', fontSize: '0.75rem' }}>{c.id.substring(0, 13)}...</td>
                    <td style={{ padding: '16px' }}>
                       <div className="flex" style={{ gap: '8px' }}>
                         <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                           {c.citizenName?.charAt(0)}
                         </div>
                         <span style={{ fontSize: '0.85rem' }}>{c.citizenName}</span>
                       </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.85rem' }}>{c.location}</td>
                    <td style={{ padding: '16px' }}>
                      <span className={`badge badge-${c.priority?.split(' ')[1]?.toLowerCase() || 'medium'}`} style={{ fontWeight: 'bold' }}>
                        {c.priority || 'Medium'}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.status}</span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span className="badge" style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--accent-green)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={12} /> {c.aiConfidence || '95'}%
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                       <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', background: 'white', fontSize: '0.75rem' }}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Side Panel: Selected Detail */}
          <div className="glass-card" style={{ background: 'white', padding: '24px' }}>
             <h3 style={{ marginBottom: '20px' }}>Complaint Detail</h3>
             {selected && (
               <>
                 <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                      <span className={`badge badge-${selected.priority?.split(' ')[1]?.toLowerCase() || 'medium'}`}>{selected.priority}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}><Clock size={12} /> {formatDate(selected.createdAt)}</span>
                    </div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>{selected.category} Issue</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', maxHeight: '100px', overflowY: 'auto' }}>
                      "{selected.description}"
                    </p>
                    {selected.imageUrl && (
                      <div style={{ position: 'relative', height: '120px', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
                        <img src={selected.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="evidence" />
                      </div>
                    )}
                 </div>

                 <div style={{ marginBottom: '24px' }}>
                   <div className="flex" style={{ marginBottom: '12px' }}>
                     <User size={16} /> <div><p style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{selected.citizenName}</p><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reported via Web/WhatsApp</p></div>
                   </div>
                   <div className="flex" style={{ marginBottom: '12px' }}>
                     <MapPin size={16} /> <span style={{ fontSize: '0.85rem' }}>{selected.location}</span>
                   </div>
                   <div className="flex">
                     <Phone size={16} /> <span style={{ fontSize: '0.85rem' }}>+91-{selected.mobile}</span>
                   </div>
                 </div>

                  <div className="grid" style={{ gap: '12px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Resolution Notes</label>
                    <textarea placeholder="Update progress..." style={{ width: '100%', height: '80px', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.85rem' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button className="btn-primary" style={{ background: '#E2E8F0', color: 'var(--text-dark)', fontSize: '0.85rem' }}>Assign Field</button>
                      <button className="btn-saffron" style={{ fontSize: '0.85rem' }} onClick={() => updateComplaintStatus(selected.id, 'Resolved')}>Resolve Now</button>
                    </div>
                    <button 
                      style={{ width: '100%', padding: '12px', background: 'white', border: '1px dashed #EF4444', color: '#EF4444', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      onClick={() => alert('Feedback sent to AI model to correct routing logic.')}
                    >
                      <AlertCircle size={16} /> Re-route (Flag AI Misclassification)
                    </button>
                 </div>
               </>
             )}
          </div>
            </div>
          </>
        ) : (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', background: 'white' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>{activeTab} module is currently being optimized.</h3>
            <p>Please use the Dashboard or Map View for now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerDashboard;
