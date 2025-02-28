import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

export async function generateEmbedding(text) {
    try {
        const result = await model.embedContent(text);

        return result.embedding.values; 
    } catch (error) {
        console.error("Error generating embedding:", error);
        return null;
    }
}
