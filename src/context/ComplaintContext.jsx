import React, { createContext, useContext, useState, useEffect } from 'react';

const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState(null);
  const [officer, setOfficer] = useState(null);
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchComplaints();
    const savedUser = localStorage.getItem('samadhan_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedOfficer = localStorage.getItem('samadhan_officer');
    if (savedOfficer) setOfficer(JSON.parse(savedOfficer));
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${API_URL}/complaints`);
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    }
  };

  const addComplaint = async (formData) => {
    try {
      const res = await fetch(`${API_URL}/complaints`, {
        method: 'POST',
        body: formData // Sending as FormData for file upload
      });
      const saved = await res.json();
      setComplaints([saved, ...complaints]);
      return saved;
    } catch (err) {
      console.error('Failed to submit complaint:', err);
      throw err;
    }
  };

  const updateComplaintStatus = async (id, newStatus) => {
    try {
      await fetch(`${API_URL}/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setComplaints(complaints.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const simulateAIAnalysis = async (text) => {
    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: text })
      });
      const data = await res.json();
      return {
        category: data.category || 'General',
        dept: data.department || 'Municipal Corp.',
        priority: data.priority || 'P2 Medium',
        severity: data.severity || 'Medium',
        confidence: data.confidence || 85
      };
    } catch (err) {
      console.error('Failed AI analysis:', err);
      return { category: 'General', dept: 'Municipal Corp.', priority: 'P2 Medium', severity: 'Medium', confidence: 50 };
    }
  };

  const sendOTP = async (mobile) => {
    await fetch(`${API_URL}/auth/otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile })
    });
  };

  const verifyOTP = async (mobile, otp) => {
    const res = await fetch(`${API_URL}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp })
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      localStorage.setItem('samadhan_user', JSON.stringify(data.user));
      return true;
    }
    return false;
  };

  const loginOfficer = async (id, password) => {
    const res = await fetch(`${API_URL}/auth/officer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password })
    });
    const data = await res.json();
    if (data.success) {
      setOfficer(data.user);
      localStorage.setItem('samadhan_officer', JSON.stringify(data.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setOfficer(null);
    localStorage.removeItem('samadhan_user');
    localStorage.removeItem('samadhan_officer');
  };

  return (
    <ComplaintContext.Provider value={{ 
      complaints, user, officer, addComplaint, updateComplaintStatus, 
      simulateAIAnalysis, sendOTP, verifyOTP, loginOfficer, logout 
    }}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => useContext(ComplaintContext);
