import React from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, X, Zap, MapPin, 
  ChevronUp, Scan, Info, ShieldAlert
} from 'lucide-react';

const MobileAppScanner = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0', background: '#111', minHeight: '100vh', color: 'white' }}>
      {/* Phone Frame */}
      <div style={{ 
        width: '375px', 
        height: '750px', 
        background: '#000', 
        borderRadius: '40px', 
        border: '12px solid #333', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        position: 'relative'
      }}>
        {/* Camera Viewfinder */}
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          <img 
            src="https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=800" 
            alt="Road" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
          />
          
          {/* AI Bounding Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            style={{ 
              position: 'absolute', 
              top: '40%', 
              left: '20%', 
              width: '200px', 
              height: '150px', 
              border: '2px solid red', 
              boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)' 
            }}
          >
            {/* Corners */}
            <div style={{ position: 'absolute', top: -2, left: -2, width: 20, height: 20, borderTop: '4px solid red', borderLeft: '4px solid red' }}></div>
            <div style={{ position: 'absolute', top: -2, right: -2, width: 20, height: 20, borderTop: '4px solid red', borderRight: '4px solid red' }}></div>
            <div style={{ position: 'absolute', bottom: -2, left: -2, width: 20, height: 20, borderBottom: '4px solid red', borderLeft: '4px solid red' }}></div>
            <div style={{ position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderBottom: '4px solid red', borderRight: '4px solid red' }}></div>
            
            <div style={{ position: 'absolute', top: -30, left: 0, background: 'red', color: 'white', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={10} fill="white" /> POTHOLE DETECTED
            </div>
            
            <div style={{ position: 'absolute', bottom: -40, left: 0, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.6rem' }}>
              Severity: <span style={{ color: '#EF4444', fontWeight: 'bold' }}>HIGH (45x30cm)</span>
            </div>
          </motion.div>

          {/* Top Bar Overlay */}
          <div style={{ position: 'absolute', top: '40px', left: 0, right: 0, padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px', borderRadius: '50%' }}><X size={20} /></div>
             <div style={{ background: 'rgba(239, 68, 68, 0.2)', backdropFilter: 'blur(5px)', border: '1px solid rgba(239, 68, 68, 0.5)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', color: 'red' }}>
                AI SCANNING LIVE
             </div>
             <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px', borderRadius: '50%' }}><Scan size={20} /></div>
          </div>

          {/* Bottom Sheet */}
          <motion.div 
            initial={{ y: '80%' }}
            animate={{ y: '0%' }}
            transition={{ type: 'spring', damping: 20 }}
            style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              background: 'white', 
              color: 'var(--text-dark)', 
              borderRadius: '24px 24px 0 0', 
              padding: '24px', 
              boxShadow: '0 -10px 30px rgba(0,0,0,0.5)' 
            }}
          >
            <div style={{ width: '40px', height: '4px', background: '#E2E8F0', borderRadius: '2px', margin: '0 auto 20px' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
               <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>1 Pothole Detected</h3>
                  <div className="flex" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <MapPin size={14} color="var(--accent-saffron)" /> <span>NH-48, Sector 15 Corridor</span>
                  </div>
               </div>
               <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'red', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  P1 PRIORITY
               </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
               <div style={{ border: '1px solid #E2E8F0', padding: '12px', borderRadius: '12px' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Department</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>PWD Haryana</p>
               </div>
               <div style={{ border: '1px solid #E2E8F0', padding: '12px', borderRadius: '12px' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Confidence</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>98.4%</p>
               </div>
            </div>

            <button className="btn-saffron" style={{ width: '100%', padding: '16px', borderRadius: '16px', fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(255,107,0,0.3)' }} onClick={() => window.location.href = '/'}>
               Submit Report to PWD
            </button>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
               Add description (Optional)
            </p>
          </motion.div>
        </div>
      </div>

      <div style={{ marginLeft: '60px', maxWidth: '400px', alignSelf: 'center' }}>
         <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Point. Click. <span style={{ color: 'var(--accent-saffron)' }}>Resolved</span>.</h2>
         <p style={{ fontSize: '1.2rem', color: '#888', lineHeight: '1.6' }}>
           Our Computer Vision model is trained on millions of Indian road images. It can estimate pothole volume for bitumen allocation and automatically route to the specific maintenance division.
         </p>
         <div style={{ marginTop: '30px', display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1, padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
               <div style={{ color: 'var(--accent-saffron)', marginBottom: '10px' }}><Info size={24}/></div>
               <h4 style={{ color: 'white', marginBottom: '8px' }}>Auto-Sizing</h4>
               <p style={{ fontSize: '0.8rem', color: '#666' }}>Automatically measures defect dimensions from photo depth data.</p>
            </div>
            <div style={{ flex: 1, padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
               <div style={{ color: 'var(--accent-green)', marginBottom: '10px' }}><ShieldAlert size={24}/></div>
               <h4 style={{ color: 'white', marginBottom: '8px' }}>Fraud Prevention</h4>
               <p style={{ fontSize: '0.8rem', color: '#666' }}>Cross-checks GPS and metadata to prevent duplicate or fake reports.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default MobileAppScanner;
