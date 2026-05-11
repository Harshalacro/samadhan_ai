import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Enhanced AI analysis for WhatsApp and Web.
 * Detects if the user wants to report a complaint, track one, or just ask a question.
 */
export async function analyzeIntentAndContent(text) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI assistant for SAMADHAN, India's Smart Grievance Redressal System. 
          You must support multiple languages including English, Hindi, Marathi, and Kannada.
          Your task is to analyze the user's message and categorize it into one of three intents:
          1. "REPORT": User is describing a problem (e.g., "pothole", "no water", "noise").
          2. "TRACK": User is asking for status (e.g., "track my complaint", "status of ID 123", "where is my request").
          3. "ASK": User is asking a general question (e.g., "what is samadhan", "how to file complaint", "is there a fee").

          Rules:
          - If the input is in Hindi, Marathi, or Kannada, translate the problem description internally to English for classification, but you can respond in the user's language if intent is "ASK".
          - Return a JSON object exactly like this:
          {
            "intent": "REPORT" | "TRACK" | "ASK",
            "category": "Electricity" | "Water Supply" | "Sanitation" | "Roads" | "Public Services" | "General",
            "department": "Name of the relevant department",
            "priority": "P0 Critical" | "P1 High" | "P2 Medium" | "P3 Low",
            "severity": "Critical" | "High" | "Medium" | "Low",
            "confidence": 0-100,
            "answer": "If intent is ASK, provide a helpful answer in 1-2 sentences in the user's detected language. Otherwise null.",
            "trackingId": "If intent is TRACK and a ID is mentioned, extract it, otherwise null"
          }`
        },
        {
          role: "user",
          content: text,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" }
    });


    const aiResponse = chatCompletion.choices[0]?.message?.content || "{}";
    
    // Robust JSON extraction using regex to handle cases where AI includes text
    try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
        return JSON.parse(jsonString.trim());
    } catch (e) {
        console.error("AI Parse Error. Raw response:", aiResponse);
        return {
            intent: "ASK",
            category: "General",
            department: "Municipal Corp.",
            priority: "P2 Medium",
            severity: "Medium",
            confidence: 50,
            answer: "I understand you have a concern. Could you please provide more details?"
        };
    }
  } catch (error) {
    console.error("Groq AI Error:", error);
    // Fallback in case of AI failure
    return {
      category: "General",
      department: "Municipal Corp.",
      priority: "P2 Medium",
      severity: "Medium",
      confidence: 50
    };
  }
}

export async function analyzeImage(imageBuffer, mimeType, task) {
  try {
    const base64Image = imageBuffer.toString('base64');
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `Analyze this image for ${task}. If it's a pothole, estimate its depth and width in cm. If it's waste, estimate the volume and type. Return ONLY a JSON object. Example for pothole: {"depth": "15cm", "width": "50cm", "severity": "High", "priority": "P1 High"}. Example for waste: {"volume": "2 bags", "type": "Plastic/Organic", "severity": "Medium", "priority": "P2 Medium"}` },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      model: "llama-3.2-90b-vision-preview",
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const aiResponse = response.choices[0]?.message?.content || "{}";
    console.log("Vision AI Raw Response:", aiResponse); // CRITICAL LOG
    try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
        const parsed = JSON.parse(jsonString.trim());
        // Ensure fields exist
        return {
            depth: parsed.depth || "Unknown",
            width: parsed.width || "Unknown",
            severity: parsed.severity || "Moderate",
            priority: parsed.priority || "P2 Medium",
            volume: parsed.volume || "Unknown",
            type: parsed.type || "General"
        };
    } catch (e) {
        console.error("Vision Parse Error. Raw response:", aiResponse);
        return { error: "Analysis failed", depth: "10cm", width: "30cm", severity: "Moderate", priority: "P2 Medium" };
    }
  } catch (error) {
    console.error("Groq Vision Error:", error);
    return { error: "Analysis failed", depth: "N/A", width: "N/A", severity: "Moderate", priority: "P2 Medium" };
  }
}

export async function categorizeComplaint(text) {
  return analyzeIntentAndContent(text);
}

