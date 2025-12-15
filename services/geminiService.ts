import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateExplanation = async (topic: string, context?: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      You are an expert in Operations Research and Computer Science. 
      Explain the following topic related to the Knapsack Problem clearly and concisely using Markdown.
      Topic: ${topic}
      ${context ? `Context: ${context}` : ''}
      
      Keep it educational, suitable for a web view, and under 300 words if possible unless a deep dive is requested.
      Use bolding for key terms.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No explanation generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate explanation at this time. Please check your API key configuration.";
  }
};

export const generateScenario = async (): Promise<{ scenarioName: string, capacity: number, items: any[] }> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Generate a realistic business scenario for a Knapsack Problem (e.g., Cargo Loading, Investment Portfolio, Resource Allocation).
      Return ONLY a JSON object with the following structure:
      {
        "scenarioName": "String description",
        "capacity": Number (integer, realistic for the scenario),
        "items": [
          { "name": "String", "weight": Number, "value": Number }
        ]
      }
      Generate between 5 to 10 items.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      scenarioName: "Error generating scenario",
      capacity: 50,
      items: []
    };
  }
};

export const askExpert = async (history: { role: string, text: string }[], message: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are an Operations Research expert specializing in Combinatorial Optimization and Reinforcement Learning. Answer questions about the Knapsack problem, algorithms, and business applications."
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini Chat Error", error);
    return "I'm having trouble connecting to the optimization server right now.";
  }
};