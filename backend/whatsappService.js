import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import qrcodeTerminal from 'qrcode-terminal';
import QRCode from 'qrcode';
import pino from 'pino';
import { analyzeIntentAndContent } from './aiService.js';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

let sock = null;
let isReady = false;

export const initWhatsApp = async () => {
    console.log("Initializing WhatsApp Client (Baileys)...");
    
    // Clear old auth info if it exists to avoid conflicts
    const authPath = path.join(process.cwd(), 'baileys_auth_info');
    
    const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');
    
    sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
        browser: ["SAMADHAN AI", "Chrome", "1.0.0"]
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log('SCAN THIS QR CODE WITH YOUR WHATSAPP TO LINK BOT:');
            qrcodeTerminal.generate(qr, { small: true });
            
            // Also save QR to file for user visibility
            const qrPath = path.join(process.cwd(), 'whatsapp-qr.png');
            QRCode.toFile(qrPath, qr, (err) => {
                if (err) console.error('Failed to save QR code:', err);
                else console.log('QR code saved to:', qrPath);
            });
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed. Reconnecting...', shouldReconnect);
            if (shouldReconnect) initWhatsApp();
        } else if (connection === 'open') {
            console.log('WhatsApp Bot is READY and connected!');
            isReady = true;
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        if (m.type === 'notify') {
            for (const msg of m.messages) {
                if (!msg.key.fromMe && msg.message) {
                    const from = msg.key.remoteJid;
                    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
                    
                    if (!text) continue;

                    // KEYWORD FILTER: Only respond if the message starts with a greeting or "Samadhan"
                    const greetings = ['hi', 'hello', 'hey', 'samadhan', 'namaste', 'tukur'];
                    const lowerText = text.toLowerCase().trim();
                    const isGreeting = greetings.some(g => lowerText.startsWith(g));
                    const isTrackingId = lowerText.length > 20; // Assume long IDs are tracking requests

                    if (!isGreeting && !isTrackingId) {
                        console.log(`Ignoring personal message from ${from}: ${text}`);
                        continue;
                    }
                    
                    console.log(`WhatsApp message from ${from}: ${text}`);

                    try {
                        // Call our Groq AI Engine to understand the intent
                        const aiAnalysis = await analyzeIntentAndContent(text);
                        
                        let replyText = "";

                        // Routing Logic based on AI Analysis
                        switch(aiAnalysis.intent) {
                            case 'COMPLAINT':
                                replyText = `We have registered your issue regarding ${aiAnalysis.category} (Dept: ${aiAnalysis.department}). Our team is looking into it. Priority set to ${aiAnalysis.priority}.`;
                                break;
                            case 'INQUIRY':
                                replyText = `You can track the status of your complaints or find more info on our official portal.`;
                                break;
                            case 'GREETING':
                                replyText = `Welcome to SAMADHAN AI. How can I help you today? You can report an issue or ask for tracking details.`;
                                break;
                            default:
                                replyText = `Thank you for your message. We have noted your input.`;
                        }

                        // Append sentiment or urgency if it's high
                        if (aiAnalysis.urgency === 'High' && aiAnalysis.intent === 'COMPLAINT') {
                            replyText += `\n*Note: This has been marked as High Urgency.*`;
                        }

                        await sock.sendMessage(from, { text: replyText });

                    } catch (err) {
                        console.error("Error processing WhatsApp message:", err);
                        await sock.sendMessage(from, { text: "Sorry, our AI is currently busy. Please try again later." });
                    }
                }
            }
        }
    });
};

export const waitForReady = () => {
    return new Promise((resolve) => {
        if (isReady) return resolve();
        const interval = setInterval(() => {
            if (isReady) {
                clearInterval(interval);
                resolve();
            }
        }, 1000);
        // Timeout after 30 seconds
        setTimeout(() => {
            clearInterval(interval);
            resolve();
        }, 30000);
    });
};

export const sendWAMessage = async (to, message) => {
    await waitForReady();
    if (!isReady || !sock) {
        console.warn("WhatsApp client is not ready. Message not sent:", message);
        return false;
    }
    try {
        // Baileys uses JID format: 919876543210@s.whatsapp.net
        const cleanTo = to.replace('@c.us', '').replace('+', '').replace(' ', '');
        const jid = cleanTo.includes('@') ? cleanTo : `${cleanTo}@s.whatsapp.net`;
        
        await sock.sendMessage(jid, { text: message });
        return true;
    } catch (error) {
        console.error("Error sending WhatsApp message:", error);
        return false;
    }
};
