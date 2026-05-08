import { GoogleGenAI } from "@google/genai";
import { envConfig } from "./index";

// Initialize the latest Google Gen AI Client
export const genAI = new GoogleGenAI({
    apiKey: envConfig.GEMINI_API_KEY,
});
