import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const data = await pdfParse(buffer);

        return NextResponse.json({ text: data.text });
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
    }
}
