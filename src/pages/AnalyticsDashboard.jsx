import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  FileText, TrendingUp, Clock, CheckCircle, 
  AlertTriangle, ArrowUp, ArrowDown, MapPin, 
  Download, Calendar, Share2, Star
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const deptData = [
    { name: 'Roads', count: 450 },
    { name: 'Water', count: 320 },
    { name: 'Electricity', count: 280 },
    { name: 'Sanitation', count: 190 },
    { name: 'Services', count: 150 },
  ];

  const trendData = [
    { day: '1', complaints: 40, resolved: 35 },
    { day: '5', complaints: 65, resolved: 40 },
    { day: '10', complaints: 80, resolved: 55 },
    { day: '15', complaints: 55, resolved: 60 },
    { day: '20', complaints: 95, resolved: 70 },
    { day: '25', complaints: 70, resolved: 75 },
    { day: '30', complaints: 45, resolved: 50 },
  ];

  const priorityData = [
    { name: 'P0', value: 3, color: '#EF4444' },
    { name: 'P1', value: 22, color: '#F97316' },
    { name: 'P2', value: 45, color: '#F59E0B' },
    { name: 'P3', value: 30, color: '#22C55E' },
  ];

  const leaderboard = [
    { name: 'Amit Verma', dept: 'PWD', rate: '98%', time: '12h', stars: 4.8 },
    { name: 'Sanjay Gupta', dept: 'Jal Board', rate: '92%', time: '16h', stars: 4.5 },
    { name: 'Meera Das', dept: 'MCG', rate: '85%', time: '19h', stars: 4.2 },
    { name: 'Pritam Singh', dept: 'Electricity', rate: '78%', time: '24h', stars: 3.9 },
  ];

  return (
    <div style={{ background: '#F4F6FB', minHeight: '100vh', padding: '40px' }}>
      <div className="container" style={{ maxWidth: '1400px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '2rem' }}>Jaipur District — Live Grievance Analytics</h1>
            <p style={{ color: 'var(--text-muted)' }}>Real-time oversight for the District Collector</p>
          </div>
          <div className="flex">
             <div className="flex" style={{ background: 'white', padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
               <Calendar size={18} /> <span>Apr 01 - Apr 27, 2024</span>
             </div>
             <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Download size={18} /> Export PDF
             </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '32px' }}>
          {[
            { label: 'Total Filed', value: '3,847', trend: '+12%', icon: <FileText color="#3182CE"/> },
            { label: 'Resolved', value: '3,102', trend: '+15%', icon: <CheckCircle color="#38A169"/> },
            { label: 'Resolution Rate', value: '80.6%', trend: '+2.4%', icon: <TrendingUp color="#805AD5"/> },
            { label: 'Avg Resolution Time', value: '18.3 hrs', trend: '-1.2h', icon: <Clock color="#E53E3E"/> },
          ].map((m, i) => (
            <div key={i} className="glass-card" style={{ padding: '24px', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{m.icon}</div>
                 <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: m.trend.startsWith('+') ? 'var(--accent-green)' : 'red' }}>{m.trend}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>{m.label}</p>
              <h2 style={{ fontSize: '1.75rem' }}>{m.value}</h2>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', marginBottom: '32px' }}>
          <div className="glass-card" style={{ background: 'white', padding: '24px' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '1.1rem' }}>Complaints by Department</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#F8FAFC'}} />
                  <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-card" style={{ background: 'white', padding: '24px' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '1.1rem' }}>30-Day Trend</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" hide />
                  <YAxis fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="complaints" stroke="var(--accent-saffron)" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="resolved" stroke="var(--accent-green)" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '32px', marginBottom: '32px' }}>
           <div className="glass-card" style={{ background: 'white', padding: '24px', display: 'flex', flexDirection: 'column' }}>
             <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Priority Distribution</h3>
             <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PieChart width={200} height={200}>
                  <Pie data={priorityData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {priorityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
                {priorityData.map(p => (
                  <div key={p.name} className="flex" style={{ gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: p.color }}></div>
                    <span style={{ fontSize: '0.8rem' }}>{p.name}: {p.value}%</span>
                  </div>
                ))}
             </div>
           </div>

           <div className="glass-card" style={{ background: 'white', padding: '24px', gridColumn: 'span 2' }}>
             <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>AI Predictive Hotspots</h3>
             <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ padding: '20px', background: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: '12px' }}>
                   <div className="flex" style={{ marginBottom: '12px', color: '#B45309' }}>
                     <AlertTriangle size={20} /> <span style={{ fontWeight: 'bold' }}>Pre-Monsoon Alert</span>
                   </div>
                   <p style={{ fontSize: '0.85rem', color: '#92400E', marginBottom: '12px' }}>
                     NH-11 Km 34-67 likely to develop pothole clusters in July based on 3-year historical pattern.
                   </p>
                   <button style={{ padding: '8px 12px', background: '#F59E0B', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.8rem' }}>Allocate Repair Fund</button>
                </div>
                <div style={{ padding: '20px', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '12px' }}>
                   <div className="flex" style={{ marginBottom: '12px', color: '#B91C1C' }}>
                     <AlertTriangle size={20} /> <span style={{ fontWeight: 'bold' }}>Cluster Escalation</span>
                   </div>
                   <p style={{ fontSize: '0.85rem', color: '#991B1B', marginBottom: '12px' }}>
                     Sector 14 Drainage: 8 complaints in 500m radius within last 48 hours. Auto-escalated to P1.
                   </p>
                   <button style={{ padding: '8px 12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.8rem' }}>Notify MCG Commisioner</button>
                </div>
             </div>
           </div>
        </div>

        {/* Leaderboard Table */}
        <div className="glass-card" style={{ background: 'white', padding: '24px' }}>
           <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Officer Performance Leaderboard</h3>
           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', background: '#F8FAFC', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '16px' }}>Officer</th>
                  <th style={{ padding: '16px' }}>Department</th>
                  <th style={{ padding: '16px' }}>Resolution Rate</th>
                  <th style={{ padding: '16px' }}>Avg Time</th>
                  <th style={{ padding: '16px' }}>Citizen Rating</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((o, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '16px', fontWeight: '600' }}>{o.name}</td>
                    <td style={{ padding: '16px' }}>{o.dept}</td>
                    <td style={{ padding: '16px' }}>
                       <div className="flex" style={{ gap: '8px' }}>
                         <div style={{ flex: 1, background: '#E2E8F0', height: '6px', borderRadius: '3px', minWidth: '100px' }}>
                           <div style={{ height: '100%', background: 'var(--accent-green)', width: o.rate, borderRadius: '3px' }}></div>
                         </div>
                         <span style={{ fontSize: '0.85rem' }}>{o.rate}</span>
                       </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.85rem' }}>{o.time}</td>
                    <td style={{ padding: '16px' }}>
                       <div className="flex" style={{ color: '#F59E0B' }}>
                         <Star size={14} fill="#F59E0B" /> <span style={{ fontWeight: 'bold' }}>{o.stars}</span>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
