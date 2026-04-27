import React, { createContext, useContext, useState } from 'react';

const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([
    { 
      id: 'SAM-2024-HR-004782', 
      citizen: 'Ramesh Kumar', 
      category: 'Roads', 
      location: 'NH-48, Gurugram', 
      priority: 'P0', 
      status: 'In Progress', 
      time: '2h ago',
      desc: 'Large pothole near Kherki Daula toll is causing massive traffic jam and risks accidents for bikers.',
      dept: 'PWD Haryana',
      sla: 'Within 24 hours',
      filedVia: 'Web'
    },
    { 
      id: 'SAM-2024-HR-004785', 
      citizen: 'Priya Sharma', 
      category: 'Water', 
      location: 'Sector 14, Gurugram', 
      priority: 'P1', 
      status: 'Assigned', 
      time: '4h ago',
      desc: 'No water supply for 3 days in our society. Several complaints filed to Jal Board but no action.',
      dept: 'Jal Board',
      sla: 'Within 48 hours',
      filedVia: 'App'
    },
  ]);

  const addComplaint = (newComplaint) => {
    setComplaints([newComplaint, ...complaints]);
  };

  const updateComplaintStatus = (id, newStatus) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const simulateAIAnalysis = (text, hasMedia) => {
    const lowerText = text.toLowerCase();
    let category = 'Public Services';
    let dept = 'Municipal Corp.';
    let priority = 'P2 Medium';
    let severity = 'Low';
    let confidence = Math.floor(Math.random() * 15) + 80; // 80-95%
    
    // Simple heuristic-based NLP simulation
    if (lowerText.includes('pothole') || lowerText.includes('road') || lowerText.includes('सड़क') || lowerText.includes('kherki')) {
      category = 'Roads';
      dept = 'PWD';
      priority = hasMedia ? 'P1 High' : 'P2 Medium';
      severity = hasMedia ? 'High' : 'Medium';
      confidence += 4;
    } else if (lowerText.includes('water') || lowerText.includes('pani') || lowerText.includes('पानी')) {
      category = 'Water Supply';
      dept = 'Jal Board';
      priority = 'P0 Critical';
      severity = 'Critical';
      confidence += 3;
    } else if (lowerText.includes('electricity') || lowerText.includes('power') || lowerText.includes('bijli') || lowerText.includes('बिजली')) {
      category = 'Electricity';
      dept = 'Power Body';
      priority = 'P0 Critical';
      severity = 'Critical';
      confidence += 2;
    } else if (lowerText.includes('garbage') || lowerText.includes('sanitation') || lowerText.includes('kachra') || lowerText.includes('कचरा')) {
      category = 'Sanitation';
      dept = 'Waste Mgmt.';
      priority = 'P2 Medium';
      severity = 'Medium';
      confidence += 5;
    }

    return { category, dept, priority, severity, confidence: Math.min(confidence, 99) };
  };

  return (
    <ComplaintContext.Provider value={{ complaints, addComplaint, updateComplaintStatus, simulateAIAnalysis }}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => useContext(ComplaintContext);
