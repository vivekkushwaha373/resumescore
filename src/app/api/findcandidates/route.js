import pinecone from "@/lib/pinecone";
import { generateEmbedding } from "@/lib/generateEmbedding";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
    runtime: "edge", 
};
export async function POST(req) {

    const { jobDescription } = await req.json();

    if (!jobDescription) {
        return Response.json({ message: "Job description is required" },{status:400});
    }

    try {
       
        const jobEmbedding = await generateEmbedding(jobDescription);
        if (!jobEmbedding) {
            return Response.json({ message: "Failed to generate job embedding" },{status:500});
        }

        
        const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
        const searchResults = await index.query({
            vector: jobEmbedding,
            topK: 5, // Get top 5 candidates
            includeMetadata: true,
        });

        if (!searchResults.matches.length) {
            return Response.json({ candidates: [] },{status:200});
        }

       
        const candidatesData = searchResults.matches.map((candidate) => ({
            name: candidate.metadata.name,
            email: candidate.metadata.email,
            linkedin: candidate.metadata.linkdinUrl,
            resumeText: candidate.metadata.resumeText,
            skills:candidate.metadata.skills
        }));

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL});

        
        const summaries = await Promise.all(
            candidatesData.map(async (candidate) => {
                try {

                    const prompt= `Summarize this candidate's profile in 5-6 sentences in string format, this is the candidate profile:\n\n${candidate.resumeText}`
                    

                    const result = await model.generateContent(prompt);
                    const responseText = result.response.text();
                    return responseText || "No summary available.";
                    // const data = await response.json();
                    // return data.candidates[0].output || "No summary available.";
                } catch (error) {
                    console.error("AI Summary Error:", error);
                    return "Error generating summary.";
                }
            })
        );
        
       

       
        const finalResults = candidatesData.map(({ resumeText, ...candidate }, index) => ({
            ...candidate,
            summary: summaries[index],
        }));

       

        return Response.json({ candidates: finalResults },{status:200});
    } catch (error) {
        console.error("Error in findCandidates API:", error);
        return Response.json({ message: "Internal Server Error" },{status:500});
    }
}
