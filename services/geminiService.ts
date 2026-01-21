
import { GoogleGenAI } from "@google/genai";

export async function fetchFunFact(countryName: string): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide one extremely short, surprising, and fun fact about ${countryName}. Max 15 words.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "No fun fact available at the moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The world is full of wonders!";
  }
}
