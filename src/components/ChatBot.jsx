import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('SAMADHAN AI DEBUG: Using API_URL ->', API_URL);

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I am SAMADHAN Assistant. How can I help you today? You can report an issue, track a complaint, or ask me a question.", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const messagesEndRef = useRef(null);

  // Chat State Management
  const [chatState, setChatState] = useState({
    action: null,
    pendingAiData: null // Store ai intent data if waiting for location
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInput('');
    setIsLoading(true);

    try {
      if (chatState.action === "ASK_MOBILE") {
        await handleMobileTracking(userMessage);
      } else if (chatState.action === "ASK_LOCATION") {
        await handleLocationSearch(userMessage);
      } else {
        const res = await axios.post(`${API_URL}/chat`, { message: userMessage });
        const { reply, intent, action, aiData } = res.data;

        setMessages(prev => [...prev, { text: reply, isBot: true }]);
        
        if (action) {
          setChatState({ action, pendingAiData: aiData });
        } else {
          setChatState({ action: null, pendingAiData: null });
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { text: "⚠️ Sorry, I couldn't connect to the server.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMobileTracking = async (mobile) => {
    try {
      const res = await axios.get(`${API_URL}/complaints/mobile/${mobile}`);
      if (res.data) {
        const c = res.data;
        const reply = `📋 **Your Latest Complaint**\n\nID: ${c.id}\nStatus: **${c.status}**\nCategory: ${c.category}\n\nIs there anything else I can help with?`;
        setMessages(prev => [...prev, { text: reply, isBot: true }]);
      } else {
        setMessages(prev => [...prev, { text: `🧐 No records found for mobile number ${mobile}. Want to report a new problem?`, isBot: true }]);
      }
      setChatState({ action: null, pendingAiData: null });
    } catch (error) {
       setMessages(prev => [...prev, { text: "Error fetching data.", isBot: true }]);
    }
  };

  const handleLocationSearch = async (location) => {
    try {
      const res = await axios.get(`${API_URL}/complaints/location/${location}`);
      const complaints = res.data;

      if (complaints && complaints.length > 0) {
        setMessages(prev => [...prev, { 
          text: `I found ${complaints.length} active issue(s) reported in ${location}.`, 
          isBot: true 
        }]);

        setMessages(prev => [...prev, {
          isBot: true,
          isWidget: true,
          widgetType: 'COMPLAINT_LIST',
          data: complaints
        }]);

        setMessages(prev => [...prev, { text: "If your issue isn't listed, or you still want to file a new one, please let me know.", isBot: true }]);
      } else {
        setMessages(prev => [...prev, { 
          text: `No current issues reported in ${location}. We will register your complaint about ${chatState.pendingAiData?.category} right now.`, 
          isBot: true 
        }]);
        setTimeout(() => {
             setMessages(prev => [...prev, { 
                text: `✅ **Complaint Registered**\n\nCategory: ${chatState.pendingAiData?.category}\nPriority: ${chatState.pendingAiData?.priority}\n\nOur team has been notified. Stay tuned for updates!`, 
                isBot: true 
              }]);
        }, 1000);
      }
      setChatState({ action: null, pendingAiData: null });
    } catch (error) {
      setMessages(prev => [...prev, { text: "Error fetching location data.", isBot: true }]);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await axios.patch(`${API_URL}/complaints/${id}/upvote`);
      setMessages(prev => prev.map(msg => {
          if (msg.isWidget && msg.widgetType === 'COMPLAINT_LIST') {
              return {
                  ...msg,
                  data: msg.data.map(c => c.id === id ? { ...c, upvotes: (c.upvotes || 0) + 1, hasVoted: true } : c)
              }
          }
          return msg;
      }));
      
      setMessages(prev => [...prev, { text: "Thank you for confirming. We have recorded your response and escalated the issue scale.", isBot: true }]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            boxShadow: 'var(--shadow-lg)',
            cursor: 'pointer',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            transition: 'transform 0.3s ease'
          }}
        >
          💬
        </button>
      )}

      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '380px',
          maxWidth: 'calc(100vw - 48px)',
          height: '600px',
          maxHeight: 'calc(100vh - 140px)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, var(--primary) 0%, #1a2a4f 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: '600',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '12px' }}>🤖</div>
                <div>
                    <div style={{ fontSize: '1rem', lineHeight: '1.2' }}>SAMADHAN Bot</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 'normal' }}>AI Assistant - Online</div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a 
                href={`https://wa.me/917879387076?text=${encodeURIComponent("Hi Samadhan!")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  background: 'rgba(37, 211, 102, 0.2)', 
                  border: '1px solid rgba(37, 211, 102, 0.4)', 
                  color: '#25D366', 
                  cursor: 'pointer', 
                  fontSize: '12px', 
                  padding: '4px 10px', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  textDecoration: 'none',
                  transition: 'background 0.2s' 
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(37, 211, 102, 0.3)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(37, 211, 102, 0.2)'}
              >
                WhatsApp
              </a>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                ✕
              </button>
            </div>
          </div>

          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: '#F8FAFC'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
              }}>
                {msg.isWidget && msg.widgetType === 'COMPLAINT_LIST' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                     {msg.data.map(c => (
                         <div key={c.id} style={{
                             background: 'var(--bg)',
                             border: '1px solid var(--border)',
                             padding: '12px',
                             borderRadius: '8px',
                             fontSize: '13px'
                         }}>
                             <div style={{ fontWeight: '600', marginBottom: '4px' }}>{c.category} Issue</div>
                             <div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{c.description.substring(0, 50)}...</div>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <span style={{ fontSize: '12px', color: 'var(--accent-saffron)' }}>Status: {c.status}</span>
                                 <button 
                                    onClick={() => handleUpvote(c.id)}
                                    disabled={c.hasVoted}
                                    style={{
                                        background: c.hasVoted ? 'var(--bg-secondary)' : 'var(--primary)',
                                        color: c.hasVoted ? 'var(--text-secondary)' : 'white',
                                        border: 'none',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        cursor: c.hasVoted ? 'default' : 'pointer',
                                        fontSize: '12px'
                                    }}
                                 >
                                     {c.hasVoted ? 'Voted' : `Vote (${c.upvotes || 0})`}
                                 </button>
                             </div>
                         </div>
                     ))}
                  </div>
                ) : (
                  <div style={{
                    background: msg.isBot ? 'white' : 'var(--primary)',
                    color: msg.isBot ? 'var(--text-dark)' : 'white',
                    padding: '12px 16px',
                    borderRadius: msg.isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap',
                    border: msg.isBot ? '1px solid rgba(0,0,0,0.05)' : 'none'
                  }}>
                    {msg.text.split('**').map((text, i) => i % 2 === 1 ? <strong key={i}>{text}</strong> : text)}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'white', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', color: 'var(--text-muted)', fontSize: '14px', display: 'flex', gap: '4px', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', animation: 'typing 1s infinite' }}></div>
                <div className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', animation: 'typing 1s infinite 0.2s' }}></div>
                <div className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', animation: 'typing 1s infinite 0.4s' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{
            padding: '16px',
            background: 'white',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chatbot.placeholder')}
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                background: '#F8FAFC',
                color: 'var(--text-dark)',
                outline: 'none',
                fontSize: '14px',
                transition: 'border 0.2s',
              }}
              onFocus={(e) => e.target.style.border = '1px solid var(--accent-saffron)'}
              onBlur={(e) => e.target.style.border = '1px solid #E2E8F0'}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              style={{
                background: 'var(--accent-saffron)',
                color: 'white',
                border: 'none',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: isLoading || !input.trim() ? 0.7 : 1,
                boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = isLoading || !input.trim() ? 'scale(1)' : 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      )}
      <style>
        {`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes typing {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
        `}
      </style>
    </>
  );
};

export default ChatBot;
