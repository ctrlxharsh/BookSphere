import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message, history } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      text: "I'm sorry, but the librarian has not configured my brain yet (GEMINI_API_KEY is missing). Please ask them to set up the environment variables." 
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // System instruction for the library context
    const systemPrompt = "You are the Maulana Azad Library AI Assistant at AMU. You help students with research, locating books, and archival information. Be polite, scholarly, and helpful.";

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text });
  } catch (err) {
    console.error('Gemini API Error:', err);
    res.status(500).json({ text: "I encountered an error while processing your request. Please try again later." });
  }
}
