import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Phone, MapPin, Building, 
  MessageSquare, Mic, Globe, Camera,
  CheckCircle, Loader2, AlertCircle, Sparkles,
  Map as MapIcon, ChevronRight, ChevronLeft, ShieldCheck
} from 'lucide-react';

import { useComplaints } from '../context/ComplaintContext';
import { useNavigate } from 'react-router-dom';

const ComplaintForm = () => {
  const navigate = useNavigate();
  const { addComplaint, simulateAIAnalysis } = useComplaints();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiDetecting, setAiDetecting] = useState(false);
  const [complaintText, setComplaintText] = useState('');
  const [detectedLang, setDetectedLang] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    state: '',
    district: '',
    category: 'Roads'
  });
  const [uploadedMedia, setUploadedMedia] = useState(null);
  const [voiceRecording, setVoiceRecording] = useState(false);

  const steps = [
    { id: 1, label: 'Identity', icon: <User size={18}/> },
    { id: 2, label: 'Details', icon: <MessageSquare size={18}/> },
    { id: 3, label: 'Verification', icon: <Camera size={18}/> },
  ];

  const [analysisResult, setAnalysisResult] = useState(null);

  // Simulation of AI Language Detection
  useEffect(() => {
    if (complaintText.length > 5 && !detectedLang) {
      setAiDetecting(true);
      setTimeout(() => {
        setDetectedLang('Hindi 🇮🇳');
        setAiDetecting(false);
      }, 1500);
    }
  }, [complaintText]);

  const handleFinish = () => {
    setLoading(true);
    const newId = `SAM-2024-${formData.state.substring(0, 2).toUpperCase() || 'IN'}-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalAnalysis = simulateAIAnalysis(complaintText, !!uploadedMedia);

    const complaintRecord = {
      id: newId,
      citizen: formData.name || 'Anonymous User',
      category: finalAnalysis.category,
      location: `${formData.district}, ${formData.state}`,
      priority: finalAnalysis.priority,
      severity: finalAnalysis.severity,
      aiConfidence: finalAnalysis.confidence,
      status: 'Submitted',
      time: 'Just now',
      desc: complaintText,
      dept: finalAnalysis.dept,
      sla: finalAnalysis.priority.includes('P0') ? 'Within 12 hours' : 'Within 24 hours',
      filedVia: 'Web'
    };
    
    setTimeout(() => {
      addComplaint(complaintRecord);
      setLoading(false);
      navigate('/track');
    }, 1500);
  };

  const nextStep = () => {
    if (step === 3) {
      handleFinish();
      return;
    }
    
    if (step === 2) {
       // Simulate AI processing transition
       setLoading(true);
       setTimeout(() => {
          setAnalysisResult(simulateAIAnalysis(complaintText, !!uploadedMedia));
          setLoading(false);
          setStep(step + 1);
       }, 1200);
       return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(step + 1);
    }, 800);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '60px 0' }}>
      {/* Progress Bar */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          {steps.map((s) => (
            <div key={s.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: step >= s.id ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: step >= s.id ? '600' : '400'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step === s.id ? 'var(--accent-saffron)' : step > s.id ? 'var(--accent-green)' : 'rgba(0,0,0,0.05)',
                color: step >= s.id ? 'white' : 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {step > s.id ? <CheckCircle size={16} /> : s.id}
              </div>
              <span style={{ fontSize: '0.9rem' }}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{ height: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px', position: 'relative' }}>
          <motion.div 
            style={{ height: '100%', background: 'var(--accent-saffron)', borderRadius: '2px' }}
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="glass-card" style={{ padding: '40px', background: 'white' }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 style={{ marginBottom: '24px' }}>Personal Information</h2>
              <div className="grid">
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '500' }}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }} 
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '500' }}>Mobile Number</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }}>+91</span>
                      <input 
                        type="tel" 
                        placeholder="Mobile Number" 
                        value={formData.mobile}
                        onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                        style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '8px', border: '1px solid #E2E8F0' }} 
                      />
                    </div>
                  </div>
                  <button className="btn-primary" style={{ alignSelf: 'end', height: '45px', padding: '0' }} type="button">Get OTP</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '500' }}>State</label>
                    <select 
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                    >
                      <option value="">Select State</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '500' }}>District</label>
                    <select 
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                    >
                      <option value="">Select District</option>
                      <option value="Gurugram">Gurugram</option>
                      <option value="Patna">Patna</option>
                      <option value="Noida">Noida</option>
                    </select>
                  </div>
                </div>
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px dashed #CBD5E0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="flex">
                      <ShieldCheck color="var(--primary)" />
                      <div>
                        <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Aadhaar eKYC (Optional)</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto-verify identity for faster resolution</p>
                      </div>
                    </div>
                    <input type="checkbox" style={{ width: '20px', height: '20px' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 style={{ marginBottom: '24px' }}>Complaint Details</h2>
              <div className="grid">
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Describe Your Problem</label>
                    <div className="flex" style={{ gap: '8px' }}>
                      {aiDetecting && <Loader2 size={14} className="animate-spin" />}
                      <span className="badge" style={{ 
                        background: 'rgba(13,27,62,0.05)', 
                        color: 'var(--primary)',
                        display: detectedLang ? 'flex' : 'none',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Sparkles size={12} /> Detected: {detectedLang}
                      </span>
                    </div>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <textarea 
                      value={complaintText}
                      onChange={(e) => setComplaintText(e.target.value)}
                      placeholder="e.g. There is a large pothole near the main market..." 
                      style={{ width: '100%', height: '150px', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', resize: 'none' }} 
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        setVoiceRecording(!voiceRecording);
                        if (!voiceRecording) {
                          setTimeout(() => {
                            setComplaintText("कचरा संग्रहण की समस्या है, बहुत बदबू आ रही है।");
                            setVoiceRecording(false);
                          }, 3000);
                        }
                      }}
                      style={{ 
                        position: 'absolute', 
                        bottom: '12px', 
                        right: '12px', 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        background: voiceRecording ? 'red' : 'var(--accent-saffron)', 
                        border: 'none', 
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: voiceRecording ? '0 0 15px rgba(255,0,0,0.5)' : 'none'
                      }}>
                      {voiceRecording ? <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }}><Mic size={20} /></motion.div> : <Mic size={20} />}
                    </button>
                    {voiceRecording && (
                        <div style={{ position: 'absolute', bottom: '60px', right: '12px', background: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', color: 'red', boxShadow: 'var(--shadow-md)' }}>
                            RECORDING...
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 style={{ marginBottom: '24px' }}>Evidence & Location</h2>
              <div className="grid">
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '12px', fontWeight: '500' }}>Upload Photos</label>
                  <div 
                    onClick={() => {
                        setLoading(true);
                        setTimeout(() => {
                           setUploadedMedia("https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=400");
                           setLoading(false);
                        }, 1000);
                    }}
                    style={{ 
                        border: '2px dashed #CBD5E0', 
                        borderRadius: '12px', 
                        padding: '40px', 
                        textAlign: 'center', 
                        background: '#F8FAFC',
                        cursor: 'pointer',
                        transition: '0.2s',
                        borderColor: uploadedMedia ? 'var(--accent-green)' : '#CBD5E0'
                    }}
                  >
                    {uploadedMedia ? (
                        <div style={{ color: 'var(--accent-green)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <CheckCircle size={40} />
                            <p style={{ marginTop: '8px', fontWeight: 'bold' }}>Photo Analyzed by AI</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ color: 'var(--accent-saffron)', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                            <Camera size={40} />
                            </div>
                            <p style={{ fontWeight: '600' }}>Click to upload pothole photo</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI will analyze dimensions instantly</p>
                        </>
                    )}
                  </div>
                  
                  {/* Photo Preview with AI Bounding Box */}
                  {uploadedMedia && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                      <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                        <img src={uploadedMedia} alt="Pothole" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ 
                          position: 'absolute', 
                          top: '30px', 
                          left: '40px', 
                          right: '60px', 
                          bottom: '50px', 
                          border: '2px solid #EF4444',
                          background: 'rgba(239, 68, 68, 0.1)',
                          pointerEvents: 'none'
                        }}>
                          <span style={{ background: '#EF4444', color: 'white', fontSize: '10px', padding: '2px 8px', position: 'absolute', top: '-10px', left: '-2px', fontWeight: 'bold' }}>
                            Pothole Detected (High Severity)
                          </span>
                        </div>
                        <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>
                           D: 45cm | W: 32cm
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '12px', fontWeight: '500' }}>Location Detection</label>
                  <div style={{ background: '#E2E8F0', height: '150px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    <MapIcon size={40} color="var(--text-muted)" />
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', background: 'white', padding: '8px 12px', borderRadius: '8px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} color="var(--accent-saffron)" />
                      <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>NH-48, Near Toll Plaza, Gurugram</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(13,27,62,0.03)', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', gridColumn: '1 / -1' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
                     <div className="flex" style={{ gap: '8px' }}>
                       <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Sparkles size={16} />
                       </div>
                       <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>AI Auto-Classification (M-BERT)</strong>
                     </div>
                     <span className="badge badge-done" style={{ fontSize: '0.8rem' }}>Confidence: {analysisResult?.confidence || 92}%</span>
                   </div>
                   
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                     <div>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Extracted Category</p>
                       <p style={{ fontSize: '1rem', fontWeight: '600' }}>{analysisResult?.category || 'General'}</p>
                     </div>
                     <div>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Routed Department</p>
                       <p style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--accent-saffron)' }}>{analysisResult?.dept || 'General Admin'}</p>
                     </div>
                     <div>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Priority Assigned</p>
                       <p style={{ fontSize: '1rem', fontWeight: '600', color: analysisResult?.priority?.includes('P0') ? '#EF4444' : 'var(--text-dark)' }}>{analysisResult?.priority || 'P2 Medium'}</p>
                     </div>
                     <div>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Sentiment / Severity</p>
                       <p style={{ fontSize: '1rem', fontWeight: '600' }}>{analysisResult?.severity || 'Medium'}</p>
                     </div>
                   </div>
                   
                   {detectedLang && detectedLang !== 'English' && (
                     <div style={{ marginTop: '20px', padding: '12px', background: 'white', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Translated from {detectedLang}: </span>
                        <span>"{complaintText.length > 50 ? complaintText.substring(0, 50) + '...' : complaintText}"</span>
                     </div>
                   )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', borderTop: '1px solid #E2E8F0', paddingTop: '24px' }}>
          <button 
            className="btn-primary" 
            style={{ 
              background: 'transparent', 
              color: 'var(--text-dark)', 
              border: '1px solid #E2E8F0',
              visibility: step === 1 ? 'hidden' : 'visible' 
            }} 
            onClick={prevStep}
          >
            Back
          </button>
          
          <button 
            className="btn-saffron" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={step === 3 ? () => window.location.href = '/track' : nextStep}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : step === 3 ? 'Submit Complaint' : 'Continue'}
            {step < 3 && !loading && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;
