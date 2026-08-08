import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getGenAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Chat responses will run in simulation mode.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey || "dummy-key-for-dev",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiInstance;
}

export const SYSTEM_PROMPT = `You are the AI assistant for Origin and Everlasting Trading PLC, a premier diversified Ethiopian enterprise.
You assist visitors in understanding and navigating our four major commercial divisions:

1. B-VIBE Garment (Manufacturing, Retail, Wholesale & Custom Corporate Uniforms):
   - Modern Ethiopian fashion, Habesha Kemis, high-volume corporate blazers, hospitality uniforms, Mini-Me heritage sets.
   - B2B Wholesale Portal with tiered pricing (50+, 200+, 500+ units) and global ETB (Chapa) or USD (Stripe) payment options.

2. Tx (Tˣ) Digital Marketing (Creative Agency):
   - Brand identity creation, TikTok & Telegram viral campaigns, AI performance marketing, social media management, short-form video production.
   - Interactive service package configurators and case studies.

3. Consulting & Training (Enterprise Advisory + Capacity Building):
   - Scalable management workflows, AI operating model deployment, technology integration, research whitepapers, policy briefs, and live session booking calendar.
   - Technical vocational training for industrial and garment manufacturing workforces.
   - Enterprise leadership development programs for managers and executives.
   - Emerging technology and AI integration bootcamps for corporate teams.

4. Branding & Promotion (Brand Strategy + Promotional Campaigns):
   - Corporate identity design, brand strategy, promotional campaign creation, collateral production.
   - Exhibition stand design, outdoor media assets, event promotional activation, and merchandising.

GUIDELINES:
- Be professional, warm, executive, and helpful.
- Direct users to specific pages: /garment, /garment/shop, /garment/wholesale, /digital, /digital/packages, /consulting, /consulting/book, /branding, /media, /contact.
- Respond fluently in English and Amharic (አማርኛ) as appropriate to the user's input.
- Keep responses concise, clear, and actionable.`;

export async function generateChatResponse(messages: { role: 'user' | 'model' | 'assistant'; content: string }[], divisionContext?: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Intelligent simulation response when no API key is set
    const lastUserMsg = messages[messages.length - 1]?.content.toLowerCase() || '';
    if (lastUserMsg.includes('bvibe') || lastUserMsg.includes('garment') || lastUserMsg.includes('dress') || lastUserMsg.includes('uniform')) {
      return "Greetings! Welcome to B-VIBE Garment. We specialize in modern Ethiopian clothing, handspun cotton dresses, and volume corporate uniforms. You can explore our catalog at /garment/shop or request B2B pricing at /garment/wholesale.";
    }
    if (lastUserMsg.includes('tx') || lastUserMsg.includes('marketing') || lastUserMsg.includes('digital')) {
      return "Hello! Tˣ Digital Agency leads performance marketing and AI creative strategy in Ethiopia. You can build a custom package at /digital/packages or review our campaign case studies at /digital/portfolio.";
    }
    if (lastUserMsg.includes('consulting') || lastUserMsg.includes('book') || lastUserMsg.includes('advisory')) {
      return "Welcome to our Consulting & Training Hub. We advise organizations on AI operating models, management workflows, and professional capacity building. You can book an executive session directly at /consulting/book.";
    }
    if (lastUserMsg.includes('training') || lastUserMsg.includes('vocational') || lastUserMsg.includes('capacity') || lastUserMsg.includes('leadership program')) {
      return "Our Consulting & Training division offers technical vocational programs, enterprise leadership workshops, and AI integration bootcamps. Submit an enquiry at /consulting.";
    }
    if (lastUserMsg.includes('brand') || lastUserMsg.includes('promotion') || lastUserMsg.includes('identity') || lastUserMsg.includes('campaign')) {
      return "Welcome to our Branding & Promotion division. We offer corporate identity design, promotional campaigns, event branding, and collateral production. Explore our services at /branding.";
    }
    return "Greetings! I am the Origin & Everlasting AI assistant. How may I assist you today across our four divisions: B-VIBE Garment, Tˣ Digital Marketing, Consulting & Training, or Branding & Promotion?";
  }

  try {
    const ai = getGenAI();
    let promptContent = `${SYSTEM_PROMPT}\n\n`;
    if (divisionContext) {
      promptContent += `[Current User Context: User is viewing ${divisionContext} section]\n\n`;
    }

    const conversationHistory = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    promptContent += conversationHistory;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptContent,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Thank you for reaching out to Origin & Everlasting. How may we assist you further?";
  } catch (error) {
    console.error("Gemini API Chat Error:", error);
    return "Welcome to Origin & Everlasting Trading PLC. Please feel free to browse our divisions or contact our team at /contact.";
  }
}
