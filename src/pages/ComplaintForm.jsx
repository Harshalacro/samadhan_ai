import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Phone, MapPin, Building, 
  MessageSquare, Mic, Globe, Camera,
  CheckCircle, Loader2, AlertCircle, Sparkles,
  Map as MapIcon, ChevronRight, ChevronLeft, ShieldCheck,
  Lock, Check
} from 'lucide-react';

import { useComplaints } from '../context/ComplaintContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ComplaintForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addComplaint, simulateAIAnalysis, sendOTP, verifyOTP, user } = useComplaints();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiDetecting, setAiDetecting] = useState(false);
  const [complaintText, setComplaintText] = useState('');
  const [detectedLang, setDetectedLang] = useState(null);
  
  // Auth State
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(!!user);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    state: 'Haryana',
    district: 'Gurugram',
    location: ''
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const fileInputRef = useRef(null);


  const steps = [
    { id: 1, label: t('form.identity'), icon: <User size={18}/> },
    { id: 2, label: t('form.details'), icon: <MessageSquare size={18}/> },
    { id: 3, label: t('form.verification'), icon: <Camera size={18}/> },
  ];

  const [analysisResult, setAnalysisResult] = useState(null);

  // Get Geolocation
  useEffect(() => {
    if (step === 3 && !formData.location) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({ 
            ...prev, 
            location: `${position.coords.latitude}, ${position.coords.longitude}` 
          }));
        },
        (error) => console.error("Location error:", error)
      );
    }
  }, [step]);

  const handleGetOTP = async () => {
    if (!formData.mobile) return alert("Please enter mobile number");
    setLoading(true);
    try {
      await sendOTP(formData.mobile);
      setOtpSent(true);
    } catch (error) {
      alert("Failed to send OTP: " + (error.message || "Unknown error"));
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    const success = await verifyOTP(formData.mobile, otp);
    if (success) {
      setIsVerified(true);
      setStep(2);
    } else {
      alert("Invalid OTP. Try 1234");
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  const startVoiceRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please use Chrome or Edge.");
      return;
    }
    
    if (voiceRecording) return;
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; 
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setVoiceRecording(true);
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setComplaintText(prev => prev + (prev ? ' ' : '') + transcript);
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setVoiceRecording(false);
    };
    
    recognition.onend = () => {
      setVoiceRecording(false);
    };
    
    recognition.start();
  };

  const handleFinish = async () => {
    setLoading(true);
    
    const data = new FormData();
    data.append('citizenName', formData.name);
    data.append('mobile', formData.mobile);
    data.append('email', formData.email);
    data.append('description', complaintText);
    data.append('location', formData.location || `${formData.district}, ${formData.state}`);
    if (selectedFile) {
      data.append('image', selectedFile);
    }
    
    try {
      const res = await addComplaint(data);
      setSubmittedId(res.id);
      setLoading(false);
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Failed to submit complaint. Check console.");
    }
  };

  const nextStep = async () => {
    if (step === 3) {
      setLoading(true);
      try {
        const data = new FormData();
        data.append('citizenName', formData.name);
        data.append('mobile', formData.mobile);
        data.append('email', formData.email);
        data.append('description', complaintText);
        data.append('location', formData.location || `${formData.district}, ${formData.state}`);
        if (selectedFile) data.append('image', selectedFile);
        
        const res = await addComplaint(data);
        setSubmittedId(res.id);
        setShowSuccess(true);
      } catch (err) {
        console.error(err);
        alert("Failed to submit. Check console.");
      }
      setLoading(false);
      return;
    }
    
    if (step === 1 && !isVerified) {
      alert("Please verify your mobile number first.");
      return;
    }

    if (step === 2) {
       if (!complaintText) return alert("Please describe the issue.");
       setLoading(true);
       const analysis = await simulateAIAnalysis(complaintText);
       setAnalysisResult(analysis);
       setLoading(false);
       setStep(step + 1);
       return;
    }

    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '60px 0' }}>
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              style={{ background: 'white', padding: '40px', borderRadius: '24px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}
            >
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Check size={40} />
              </div>
              <h2 style={{ marginBottom: '12px' }}>Complaint Submitted!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Aapki shikayat darj kar li gayi hai. Our AI system has routed it to the relevant department.</p>
              
              <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px dashed #CBD5E0', marginBottom: '32px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>TRACKING ID</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '2px' }}>{submittedId}</p>
              </div>

              <div className="flex" style={{ flexDirection: 'column', gap: '12px' }}>
                <button className="btn-saffron" style={{ width: '100%', padding: '16px' }} onClick={() => navigate('/track')}>Track Live Progress</button>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }} onClick={() => navigate('/')}>Back to Home</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '500' }}>{t('form.fullName')}</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '500' }}>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }} 
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '500' }}>{t('form.mobile')}</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }}>+91</span>
                      <input 
                        type="tel" 
                        placeholder="Mobile Number" 
                        disabled={isVerified}
                        value={formData.mobile}
                        onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                        style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '8px', border: '1px solid #E2E8F0' }} 
                      />
                    </div>
                  </div>
                  {!isVerified && (
                    <button 
                      className="btn-primary" 
                      onClick={handleGetOTP}
                      disabled={loading}
                      style={{ alignSelf: 'end', height: '45px', padding: '0' }}
                    >
                      {loading ? <Loader2 className="animate-spin" /> : otpSent ? 'Resend' : 'Get OTP'}
                    </button>
                  )}
                  {isVerified && (
                    <div style={{ alignSelf: 'end', height: '45px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-green)', fontWeight: 'bold' }}>
                      <Check size={20} /> Verified
                    </div>
                  )}
                </div>

                {otpSent && !isVerified && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '500' }}>Enter 4-Digit OTP</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '12px' }}>
                      <div style={{ position: 'relative' }}>
                        <Lock size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                        <input 
                          type="text" 
                          maxLength={4}
                          placeholder="XXXX" 
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid var(--accent-saffron)', letterSpacing: '4px', fontWeight: 'bold' }} 
                        />
                      </div>
                      <button className="btn-saffron" onClick={handleVerifyOTP} disabled={loading}>
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify'}
                      </button>
                    </div>
                    <p style={{ fontSize: '0.75rem', marginTop: '8px', color: 'var(--text-muted)' }}>Hint: Use 1234 for testing.</p>
                  </motion.div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '500' }}>{t('form.state')}</label>
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
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '500' }}>{t('form.district')}</label>
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
                      onClick={startVoiceRecording}
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
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '12px', fontWeight: '500' }}>Photo Upload (Mandatory)</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    hidden 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    style={{ 
                        border: '2px dashed #CBD5E0', 
                        borderRadius: '12px', 
                        padding: '40px', 
                        textAlign: 'center', 
                        background: '#F8FAFC',
                        cursor: 'pointer',
                        borderColor: selectedFile ? 'var(--accent-green)' : '#CBD5E0'
                    }}
                  >
                    {previewUrl ? (
                        <div style={{ position: 'relative', height: '120px' }}>
                            <img src={previewUrl} style={{ height: '100%', borderRadius: '8px' }} />
                            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-green)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>Selected</div>
                        </div>
                    ) : (
                        <>
                            <Camera size={40} color="var(--accent-saffron)" style={{ margin: '0 auto 12px' }} />
                            <p style={{ fontWeight: '600' }}>Click to select photo</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Required for department verification</p>
                        </>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '12px', fontWeight: '500' }}>Real-time Location</label>
                  <div style={{ background: '#F1F5F9', height: '150px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '1px solid #E2E8F0' }}>
                    <MapIcon size={40} color="#94A3B8" />
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', background: 'white', padding: '8px 12px', borderRadius: '8px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} color="var(--accent-saffron)" />
                      <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                        {formData.location || "Detecting GPS location..."}
                      </span>
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
            onClick={nextStep}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : step === 3 ? 'Submit Complaint' : t('form.continue')}
            {step < 3 && !loading && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;
