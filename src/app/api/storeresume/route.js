import pinecone from "@/lib/pinecone";
import { generateEmbedding } from "@/lib/generateEmbedding";

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, skills, linkdinUrl, resumeText } = body;

        
        const embedding = await generateEmbedding(resumeText);
        if (!embedding) {
            return new Response(JSON.stringify({ message: "Failed to generate embedding" }), { status: 500 });
        }

        console.log('Embedding:', embedding);

        const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
        await index.upsert([
            {
                id: email, 
                values: embedding, 
                metadata: { name, email, skills, linkdinUrl, resumeText },
            },
        ]);

        return new Response(JSON.stringify({ message: "Resume stored successfully!" }), { status: 200 });
    } catch (error) {
        console.error("Error storing in Pinecone:", error);
        return new Response(JSON.stringify({ message: "Failed to store in Pinecone" }), { status: 500 });
    }
}
