import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trash2, MapPin, Camera, Sparkles, CheckCircle, Loader2, ChevronRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';

const WasteManagement = () => {
  const navigate = useNavigate();
  const { addComplaint, user } = useComplaints();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState(null);
  const [issueType, setIssueType] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`),
      (err) => console.error(err)
    );
  }, []);

  const issueTypes = [
    { id: 'overflow', label: 'Dustbin Overflow', icon: <Trash2 size={24}/> },
    { id: 'illegal', label: 'Illegal Dumping', icon: <AlertCircle size={24}/> },
    { id: 'dead_animal', label: 'Dead Animal', icon: <AlertCircle size={24}/> },
    { id: 'sewage', label: 'Open Sewage', icon: <AlertCircle size={24}/> },
  ];

  const handleCapture = async (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setAnalyzing(true);
      
      try {
        const formData = new FormData();
        formData.append('image', f);
        formData.append('task', 'waste');
        
        const res = await axios.post('http://localhost:5000/api/vision/analyze', formData);
        setResult(res.data);
      } catch (err) {
        console.error(err);
        alert("AI analysis failed.");
      } finally {
        setAnalyzing(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!user) return alert("Please login to report.");
    setLoading(true);
    const formData = new FormData();
    formData.append('citizenName', user.name);
    formData.append('mobile', user.mobile);
    formData.append('description', `Waste Management Issue: ${issueType?.label}. Recorded at live location.`);
    formData.append('location', location || 'Current Location');
    if (file) formData.append('image', file);
    
    await addComplaint(formData);
    setLoading(false);
    navigate('/track');
  };

  return (
    <div className="container" style={{ maxWidth: '600px', padding: '60px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ marginBottom: '12px' }}>Swachh Bharat Module</h1>
        <p style={{ color: 'var(--text-muted)' }}>AI-driven waste reporting for a cleaner locality.</p>
      </div>

      <div className="glass-card" style={{ padding: '32px', background: 'white' }}>
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 style={{ marginBottom: '24px' }}>Select Issue Type</h3>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {issueTypes.map(type => (
                <div 
                  key={type.id}
                  onClick={() => setIssueType(type)}
                  style={{ 
                    padding: '24px', 
                    borderRadius: '16px', 
                    border: '2px solid',
                    borderColor: issueType?.id === type.id ? 'var(--accent-green)' : '#F1F5F9',
                    background: issueType?.id === type.id ? 'rgba(15,157,88,0.05)' : 'white',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: '0.2s'
                  }}
                >
                  <div style={{ color: issueType?.id === type.id ? 'var(--accent-green)' : 'var(--text-muted)', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                    {type.icon}
                  </div>
                  <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{type.label}</p>
                </div>
              ))}
            </div>
            <button 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '32px', padding: '16px' }}
              disabled={!issueType}
              onClick={() => setStep(2)}
            >
              Continue to Capture <ChevronRight size={18} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 style={{ marginBottom: '24px' }}>Evidence & Location</h3>
            
            {!preview ? (
               <div 
                 onClick={() => document.getElementById('waste-img').click()}
                 style={{ height: '250px', border: '2px dashed #E2E8F0', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', cursor: 'pointer' }}
               >
                 <Camera size={40} color="var(--text-muted)" />
                 <p style={{ marginTop: '12px', fontWeight: 'bold' }}>Capture Photo</p>
                 <input id="waste-img" type="file" accept="image/*" capture="environment" hidden onChange={handleCapture} />
               </div>
            ) : (
               <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '250px' }}>
                 <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 
                 {analyzing && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Loader2 size={32} className="animate-spin" />
                        <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>Analyzing Waste...</p>
                    </div>
                 )}

                 {result && !analyzing && (
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', background: 'rgba(255,255,255,0.95)', padding: '12px', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 'bold' }}>AI Vision Result</span>
                            <span className="badge badge-done" style={{ fontSize: '0.65rem' }}>{result.priority}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem' }}>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Volume</p>
                                <p style={{ fontWeight: 'bold' }}>{result.volume}</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Type</p>
                                <p style={{ fontWeight: 'bold' }}>{result.type}</p>
                            </div>
                        </div>
                    </div>
                 )}

                 {!result && !analyzing && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: 'white', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-md)' }}>
                        <Sparkles size={16} color="var(--accent-green)" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Ready for Analysis</span>
                        </div>
                    </div>
                 )}
               </div>
            )}

            <div style={{ marginTop: '24px', background: '#F8FAFC', padding: '16px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <MapPin size={20} color="var(--accent-green)" />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Auto-Tagging Location</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{location || "Fetching GPS..."}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', marginTop: '32px' }}>
               <button className="btn-primary" style={{ background: 'none', border: '1px solid #E2E8F0', color: 'var(--text-dark)' }} onClick={() => setStep(1)}>Back</button>
               <button className="btn-saffron" style={{ padding: '16px' }} onClick={handleSubmit} disabled={loading}>
                 {loading ? <Loader2 className="animate-spin" /> : "Report to Municipality"}
               </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WasteManagement;
