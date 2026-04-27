import React from 'react';
import { motion } from 'framer-motion';
import { 
  Send, MoreVertical, Phone, Video, 
  MapPin, Camera, Mic, CheckCheck,
  MessageCircle, CheckCircle, Lock, ArrowRight
} from 'lucide-react';

const WhatsAppBot = () => {
  const messages = [
    { type: 'bot', text: 'नमस्ते! SAMADHAN AI में आपका स्वागत है। आप अपनी समस्या यहाँ दर्ज कर सकते हैं या फ़ोटो भेज सकते हैं।', time: '14:30' },
    { type: 'user', text: 'mere mohalle mein kachra bahut dino se nahi utha, bahut badbu aa rahi hai', time: '14:31' },
    { type: 'bot', text: '🤖 AI ने detect किया: कचरा संग्रहण की शिकायत (Sanitation Dept.) | Priority: P2 Medium', time: '14:31', ai: true },
    { type: 'bot', text: '📍 अपनी location share करें ताकि हम नगर निगम को सूचित कर सकें।', time: '14:31' },
    { type: 'user', location: 'DLF Phase 3, Cyber City', time: '14:32' },
    { type: 'bot', text: '✅ शिकायत दर्ज हो गई! ID: SAM-2024-MH-007341\n\nउम्मीद है कि इसे 48 घंटों में हल कर दिया जाएगा। हम आपको यहाँ अपडेट भेजते रहेंगे।', time: '14:32' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0', background: '#e5ddd5', minHeight: '100vh' }}>
      {/* Phone Frame */}
      <div style={{ 
        width: '375px', 
        height: '750px', 
        background: '#fff', 
        borderRadius: '40px', 
        border: '12px solid #333', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        position: 'relative'
      }}>
        {/* Notch */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '150px', height: '25px', background: '#333', borderRadius: '0 0 20px 20px', zIndex: 10 }}></div>

        {/* WhatsApp Header */}
        <div style={{ background: '#075E54', color: 'white', padding: '35px 16px 10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#075E54' }}>
             <strong>S</strong>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>SAMADHAN AI Bot 🇮🇳</p>
            <p style={{ fontSize: '0.7rem', opacity: 0.8 }}>Online</p>
          </div>
          <div className="flex" style={{ gap: '15px' }}>
             <Video size={18} />
             <Phone size={18} />
             <MoreVertical size={18} />
          </div>
        </div>

        {/* Chat Background */}
        <div style={{ 
          flex: 1, 
          background: 'url(https://i.pinimg.com/originals/97/c0/07/97c0075474abc67fbf66732fa05d1bb9.jpg)', 
          backgroundSize: 'cover', 
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.5 }}
              style={{ 
                maxWidth: '85%', 
                padding: '8px 12px', 
                borderRadius: '10px', 
                fontSize: '0.85rem',
                position: 'relative',
                alignSelf: m.type === 'bot' ? 'flex-start' : 'flex-end',
                background: m.type === 'bot' ? 'white' : '#DCF8C6',
                boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                border: m.ai ? '1px solid #128C7E' : 'none',
                whiteSpace: 'pre-wrap'
              }}
            >
              {m.location ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <div style={{ background: '#eee', height: '100px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin color="#075E54" />
                   </div>
                   <strong>Location Shared</strong>
                   <span>{m.location}</span>
                </div>
              ) : m.text}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px', fontSize: '0.65rem', marginTop: '4px', color: '#999' }}>
                {m.time} {m.type === 'user' && <CheckCheck size={12} color="#34B7F1" />}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <div style={{ padding: '10px', background: '#f0f0f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, background: 'white', borderRadius: '25px', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <span style={{ fontSize: '1.2rem' }}>😊</span>
             <input type="text" placeholder="Type a message" style={{ border: 'none', flex: 1, outline: 'none', fontSize: '0.9rem' }} />
             <div className="flex" style={{ gap: '12px', color: '#777' }}>
                <Camera size={20} />
                <Mic size={20} />
             </div>
          </div>
          <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#128C7E', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Send size={20} />
          </div>
        </div>

        {/* Quick Reply Tooltip (Overlay) */}
        <div style={{ position: 'absolute', bottom: '100px', left: '16px', right: '16px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {['Status Check', 'New Complaint', 'Talk to Officer', 'English'].map(q => (
              <div key={q} style={{ background: 'white', padding: '6px 12px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 'bold', color: '#128C7E', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', whiteSpace: 'nowrap' }}>
                {q}
              </div>
            ))}
        </div>
      </div>

      <div style={{ marginLeft: '60px', maxWidth: '400px', alignSelf: 'center' }}>
         <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>AI integration <span style={{ color: '#25D366' }}>everywhere</span>.</h2>
         <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: '1.6' }}>
           Our WhatsApp bot handles 80% of routine complaints without human intervention. Natural Language Processing detects keywords in regional dialects and routes them to the correct department instantly.
         </p>
         <div style={{ marginTop: '30px', padding: '32px', background: 'white', borderRadius: '24px', boxShadow: 'var(--shadow-lg)', border: '1px solid rgba(7, 94, 84, 0.1)' }}>
            <h3 style={{ marginBottom: '20px', color: '#075E54', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageCircle size={24} /> Link Your WhatsApp
            </h3>
            <div style={{ display: 'grid', gap: '20px' }}>
               {[
                 { step: '1', text: 'Click the button below to open chat', icon: <Send size={16} /> },
                 { step: '2', text: 'Send "Hi" to our verified SAMADHAN AI bot', icon: <CheckCircle size={16} /> },
                 { step: '3', text: 'Authenticate using your registered mobile OTP', icon: <Lock size={16} /> }
               ].map((s, i) => (
                 <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#075E54', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', flexShrink: 0 }}>
                       {s.step}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#444' }}>{s.text}</p>
                 </div>
               ))}
            </div>
            
            <button 
              style={{ 
                marginTop: '32px', 
                width: '100%', 
                padding: '16px', 
                borderRadius: '12px', 
                background: '#25D366', 
                color: 'white', 
                border: 'none', 
                fontWeight: 'bold', 
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)'
              }}
              onClick={() => window.open('https://wa.me/919999999999?text=Hi%20SAMADHAN%20AI', '_blank')}
            >
               Connect to WhatsApp <ArrowRight size={18} />
            </button>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.75rem', color: '#888' }}>
                * Standard data charges may apply as per your carrier.
            </p>
         </div>
      </div>
    </div>
  );
};

export default WhatsAppBot;
