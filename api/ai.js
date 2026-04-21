import { GoogleGenerativeAI } from '@google/generative-ai';

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  const { message, history } = JSON.parse(event.body);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        text: "I'm sorry, but the librarian has not configured my brain yet (GEMINI_API_KEY is missing). Please ask them to set up the environment variables."
      })
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemma-4-31b-it" });

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const systemPrompt = "You are the Maulana Azad Library AI Assistant at AMU. Be polite, scholarly, and helpful. IMPORTANT: Output ONLY the final response. Do NOT include any 'The user said...', bullet-point plans, or internal reasoning.";
    const result = await chat.sendMessage(`${systemPrompt}\n\nUser Message: ${message}`);
    const response = await result.response;
    let text = response.text();

    // Post-processing to strip "thinking" or "reasoning" blocks if the model ignores system instructions
    // This removes "The user said...", bulleted plans, and meta-commentary
    text = text
      .replace(/^The user said.*?\n/is, '') // Remove "The user said..." preamble
      .replace(/^(\s*[\*\-]\s+.*?\n)+/gm, '') // Remove bullet point plans
      .replace(/^(Previous interaction|Maintain the|Be friendly|Encourage the|The previous).*?\n/igm, '') // Remove meta-commentary
      .trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ text })
    };
  } catch (err) {
    console.error('Gemini API Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ text: "I encountered an error while processing your request. Please try again later." })
    };
  }
};
