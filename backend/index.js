import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { categorizeComplaint, analyzeIntentAndContent, analyzeImage } from './aiService.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { initWhatsApp, sendWAMessage } from './whatsappService.js';
import { sendEmail } from './emailService.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });


// Twilio removed as per requirements

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For Twilio Webhooks
app.use('/uploads', express.static('uploads'));


// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SAMADHAN AI Backend is running with Groq and Twilio!' });
});

// GET all complaints (for Officer Dashboard)
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// POST to analyze complaint via AI (used for previewing)
app.post('/api/analyze', async (req, res) => {
  try {
    const { description } = req.body;
    console.log("Previewing complaint analysis with Groq AI...");
    const aiAnalysis = await categorizeComplaint(description);
    res.json(aiAnalysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to analyze complaint' });
  }
});

// NEW: Vision Analysis Endpoint
app.post('/api/vision/analyze', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No image provided" });
        const { task } = req.body; // e.g., "pothole" or "waste"
        console.log(`Analyzing image for task: ${task}...`);
        
        const imageBuffer = fs.readFileSync(req.file.path);
        const result = await analyzeImage(imageBuffer, req.file.mimetype, task);
        res.json(result);
    } catch (error) {
        console.error("Vision Analysis Error:", error);
        res.status(500).json({ error: "Failed to analyze image" });
    }
});

// POST new complaint (from Citizen Form) with optional image
app.post('/api/complaints', upload.single('image'), async (req, res) => {
  try {
    const { citizenName, mobile, email, description, location } = req.body;
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;
    
    // Call the Groq AI service to categorize the complaint!
    console.log("Analyzing complaint with Groq AI...");
    const aiAnalysis = await categorizeComplaint(description);
    console.log("AI Result:", aiAnalysis);

    const complaint = await prisma.complaint.create({
      data: {
        citizenName,
        mobile,
        email,
        description,
        location,
        imageUrl,
        category: aiAnalysis.category,
        department: aiAnalysis.department,
        priority: aiAnalysis.priority,
        severity: aiAnalysis.severity,
        aiConfidence: aiAnalysis.confidence
      }
    });

    // Send Confirmation via WhatsApp (Non-blocking)
    const number = `91${mobile}@c.us`;
    sendWAMessage(number, `✅ *Complaint Registered Successfully!*\n\n*Tracking ID:* ${complaint.id}\n*Category:* ${complaint.category}\n*Department:* ${complaint.department}\n\nOur team is working on resolving it.`);

    // Send Confirmation via Email if provided (Non-blocking)
    if (email) {
        sendEmail(
            email, 
            `Complaint Registered: ${complaint.id}`,
            `Hello ${citizenName},\n\nYour complaint regarding ${complaint.category} has been registered successfully. \n\nTracking ID: ${complaint.id}\nDepartment: ${complaint.department}\n\nThank you for using SAMADHAN AI.`,
            `<h1>Complaint Registered</h1><p>Hello <b>${citizenName}</b>,</p><p>Your complaint regarding <b>${complaint.category}</b> has been registered successfully.</p><p><b>Tracking ID:</b> ${complaint.id}</p><p><b>Department:</b> ${complaint.department}</p><p>Thank you for using SAMADHAN AI.</p>`
        ).catch(err => console.error("Email failed in background:", err));
    }

    res.status(201).json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit complaint' });
  }
});


// AUTH ENDPOINTS (Real OTP via Twilio)
const otpStore = {}; // Memory storage for hackathon demo

app.post('/api/auth/otp', async (req, res) => {
  try {
    const { mobile } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore[mobile] = otp;

    // Send OTP via WhatsApp
    console.log(`Mock: Generated OTP ${otp} for ${mobile}`);
    const number = `91${mobile}@c.us`;
    await sendWAMessage(number, `🔐 *SAMADHAN AI*\n\nYour Login OTP is: *${otp}*\n\nPlease do not share this with anyone.`);

    // Note: We could also send via email here if we had the user's email pre-registered

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error("OTP Error:", error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

app.post('/api/auth/verify', (req, res) => {
  const { mobile, otp } = req.body;
  if (otpStore[mobile] === otp || otp === '1234') { // Allow 1234 for testing
    res.json({ success: true, user: { mobile, name: 'User' } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid OTP' });
  }
});

app.post('/api/auth/officer', (req, res) => {
  const { id, password } = req.body;
  if (id === 'ADMIN' && password === 'admin123') {
    res.json({ success: true, user: { role: 'officer', name: 'Admin Officer', id: 'ADMIN' } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid Officer Credentials' });
  }
});



// PATCH complaint status (for Officer resolution)
app.patch('/api/complaints/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.complaint.update({
      where: { id },
      data: { status }
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// WEB CHATBOT ENDPOINT
app.post('/api/chat', async (req, res) => {
  const { message, state } = req.body;
  // state could contain { mobile: "9876543210", location: "Indore" } etc.
  
  console.log(`Received Web Chat message: ${message}`);

  try {
    const ai = await analyzeIntentAndContent(message);
    console.log("AI Intent:", ai.intent);

    let replyText = "";
    let action = null; // Used to tell frontend to do something (e.g. ask_location, show_complaints)

    if (ai.intent === "TRACK") {
      const trackingId = ai.trackingId;
      if (trackingId) {
        const complaint = await prisma.complaint.findUnique({ where: { id: trackingId } });
        if (complaint) {
          replyText = `🔍 **Complaint Status**\n\nID: ${complaint.id}\nCategory: ${complaint.category}\nStatus: ${complaint.status}\nDepartment: ${complaint.department}\n\n_Note: Officers are currently working on your issue._`;
        } else {
          replyText = `❌ We couldn't find a complaint with ID ${trackingId}. Please check the ID and try again.`;
        }
      } else {
        replyText = `Could you please provide the tracking ID or your registered mobile number?`;
        action = "ASK_MOBILE";
      }
    } else if (ai.intent === "ASK") {
      replyText = `🤖 **SAMADHAN Assistant**\n\n${ai.answer}\n\n_How else can I help you today?_`;
    } else {
      replyText = `It looks like you want to report a problem about ${ai.category}. Could you please provide your location (e.g., City name) so I can check if others are facing this too?`;
      action = "ASK_LOCATION";
    }

    res.json({ reply: replyText, intent: ai.intent, action: action, aiData: ai });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ reply: "⚠️ Sorry, I'm having trouble processing your request right now." });
  }
});

// ANALYZE endpoint for real-time classification in form
app.post('/api/analyze', async (req, res) => {
    try {
        const { description } = req.body;
        if (!description) return res.status(400).json({ error: 'Description is required' });
        
        const aiAnalysis = await categorizeComplaint(description);
        res.json(aiAnalysis);
    } catch (error) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: 'AI Analysis failed' });
    }
});

// GET active complaints by location
app.get('/api/complaints/location/:location', async (req, res) => {
  try {
    const { location } = req.params;
    // Simple case-insensitive match for demo
    const complaints = await prisma.complaint.findMany({
      where: {
        location: {
          contains: location,
          mode: 'insensitive'
        },
        status: {
          not: 'Resolved'
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch location complaints' });
  }
});

// GET latest complaint by mobile (for tracking)
app.get('/api/complaints/mobile/:mobile', async (req, res) => {
  try {
    const { mobile } = req.params;
    const latest = await prisma.complaint.findFirst({
      where: { mobile: mobile },
      orderBy: { createdAt: 'desc' }
    });
    res.json(latest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch mobile complaints' });
  }
});

// UPVOTE a complaint
app.patch('/api/complaints/:id/upvote', async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await prisma.complaint.update({
      where: { id },
      data: {
        upvotes: {
          increment: 1
        }
      }
    });
    
    // Automatically escalate priority if upvotes reach a threshold (e.g., > 10)
    if (complaint.upvotes >= 10 && complaint.priority !== "P0 Critical") {
        await prisma.complaint.update({
            where: { id },
            data: { priority: "P1 High", severity: "High" }
        });
    }

    res.json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upvote' });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  // Initialize WhatsApp Bot (DISABLED AS REQUESTED)
  // initWhatsApp();
});
