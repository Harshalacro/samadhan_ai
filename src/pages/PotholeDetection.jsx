import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Camera, MapPin, Sparkles, CheckCircle, Loader2, ChevronRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PotholeDetection = () => {
  const navigate = useNavigate();
  const { addComplaint, user } = useComplaints();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`),
      (err) => console.error(err)
    );
  }, []);

  const handleCapture = async (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setAnalyzing(true);
      
      try {
        const formData = new FormData();
        formData.append('image', f);
        formData.append('task', 'pothole');
        
        const res = await axios.post(`${API_URL}/vision/analyze`, formData);
        setResult(res.data);
      } catch (err) {
        console.error(err);
        alert("AI analysis failed. Please try again.");
      } finally {
        setAnalyzing(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!file || !user) return alert("Please capture photo and login first.");
    setLoading(true);
    const formData = new FormData();
    formData.append('citizenName', user.name);
    formData.append('mobile', user.mobile);
    formData.append('description', `Pothole detected with severity ${result.severity}. Dimensions: ${result.depth} depth, ${result.width} width.`);
    formData.append('location', location || 'Unknown');
    formData.append('image', file);
    
    await addComplaint(formData);
    setLoading(false);
    navigate('/track');
  };

  return (
    <div className="container" style={{ maxWidth: '600px', padding: '60px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ marginBottom: '12px' }}>AI Pothole Detector</h1>
        <p style={{ color: 'var(--text-muted)' }}>Snap a photo, AI calculates dimensions and alerts PWD instantly.</p>
      </div>

      <div className="glass-card" style={{ padding: '32px', background: 'white' }}>
        <input type="file" accept="image/*" capture="environment" hidden ref={fileInputRef} onChange={handleCapture} />
        
        {!preview ? (
          <div 
            onClick={() => fileInputRef.current.click()}
            style={{ 
              height: '300px', 
              border: '2px dashed #E2E8F0', 
              borderRadius: '20px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              background: '#F8FAFC'
            }}
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-saffron)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Camera size={40} />
            </div>
            <p style={{ fontWeight: 'bold' }}>Tap to Open Camera</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Position pothole in center of frame</p>
          </div>
        ) : (
          <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <img src={preview} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
            
            {analyzing && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Loader2 size={40} className="animate-spin" />
                <p style={{ marginTop: '12px', fontWeight: 'bold' }}>AI Analyzing Dimensions...</p>
              </div>
            )}

            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', background: 'rgba(255,255,255,0.95)', padding: '20px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div className="flex" style={{ gap: '8px' }}>
                    <Sparkles size={18} color="var(--primary)" />
                    <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>AI Detection Result</span>
                  </div>
                  <span className="badge badge-critical">{result.priority}</span>
                </div>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.9rem' }}>
                  <div style={{ background: 'rgba(0,0,0,0.05)', padding: '8px', borderRadius: '6px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Estimated Depth</p>
                    <p style={{ fontWeight: 'bold' }}>{result.depth}</p>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.05)', padding: '8px', borderRadius: '6px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Estimated Width</p>
                    <p style={{ fontWeight: 'bold' }}>{result.width}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        <div style={{ marginTop: '24px' }}>
          <div className="flex" style={{ marginBottom: '24px', background: '#F1F5F9', padding: '12px', borderRadius: '12px' }}>
            <MapPin size={18} color="var(--accent-saffron)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>
              {location ? `GPS: ${location}` : "Detecting live location..."}
            </span>
          </div>

          <button 
            className="btn-saffron" 
            style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem' }}
            disabled={!result || loading}
            onClick={handleSubmit}
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Report to PWD <ChevronRight size={18} /></>}
          </button>
          
          {preview && !loading && (
             <button 
               onClick={() => {setPreview(null); setResult(null);}} 
               style={{ width: '100%', marginTop: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer' }}
             >
               Retake Photo
             </button>
          )}
        </div>
      </div>

      <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(255,107,0,0.05)', borderRadius: '12px', border: '1px solid rgba(255,107,0,0.1)', display: 'flex', gap: '16px' }}>
        <AlertTriangle color="var(--accent-saffron)" />
        <p style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>
          <strong>Safety Note:</strong> Please do not stand in middle of active traffic while taking photos. Use AI zoom if needed.
        </p>
      </div>
    </div>
  );
};

export default PotholeDetection;
