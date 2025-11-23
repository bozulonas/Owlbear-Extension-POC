import { GoogleGenAI, Type } from "@google/genai";
import { EncounterResult } from "../types";

// NOTE: In a production extension, you shouldn't expose the key directly if possible,
// but for a PoC running locally/iframe, this uses the env var.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateEncounter = async (theme: string): Promise<EncounterResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a quick, interesting RPG encounter based on the theme: "${theme}". Keep it concise suitable for a VTT sidebar.`,
      config: {
        systemInstruction: "You are a helpful Dungeon Master assistant for Owlbear Rodeo. You provide concise, creative encounter hooks.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            suggestedCreatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "description", "suggestedCreatures"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as EncounterResult;
    }
    
    throw new Error("No content generated");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};