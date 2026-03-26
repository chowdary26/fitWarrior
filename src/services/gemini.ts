import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getAICoachAdvice(userProfile: any, recentStats: any) {
  const prompt = `
    You are the FitWarrior AI Coach. 
    User Profile: ${JSON.stringify(userProfile)}
    Recent Stats: ${JSON.stringify(recentStats)}
    
    Provide a short, motivating piece of advice (max 2 sentences) for the user's daily dashboard. 
    Focus on their goal and current progress.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Keep pushing, Warrior! Consistency is the key to transformation.";
  } catch (error) {
    console.error("AI Coach Error:", error);
    return "Keep pushing, Warrior! Consistency is the key to transformation.";
  }
}
