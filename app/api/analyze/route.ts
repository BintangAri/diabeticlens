import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key belum disetting" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const data = await req.json();
    const image = data.image;

    if (!image) {
      return NextResponse.json({ error: "Gambar tidak ditemukan" }, { status: 400 });
    }

    const mimeType = image.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)?.[0] || "image/jpeg";
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // UPDATE PROMPT: Minta Alternatif & Info Insulin
    const prompt = `
      Kamu adalah ahli gizi spesialis diabetes. Analisis gambar label nutrisi ini.
      
      Tugasmu:
      1. Identifikasi Nama Makanan/Produk (jika tidak ada, tebak berdasarkan jenisnya).
      2. Cari Total Karbohidrat, Gula, dan Serat.
      3. Hitung "Carb Exchange" (1 Exchange = 15g Karbohidrat Total).
      4. Jika verdict bukan "AMAN", berikan 2-3 alternatif makanan sejenis yang lebih sehat.
      
      Output WAJIB JSON valid (tanpa markdown) dengan format:
      {
        "food_name": "Nama Makanan",
        "verdict": "AMAN" atau "BATASI" atau "HINDARI",
        "risk_level": "Rendah/Sedang/Tinggi",
        "nutrients": {
           "total_carbs": "jumlah gram (angka saja, misal 20)",
           "sugar": "jumlah gram (angka saja, misal 15)",
           "fiber": "jumlah gram (angka saja, misal 2)"
        },
        "carb_info": {
           "exchange": "angka estimasi takaran (misal 1.5)", 
           "suggestion": "Saran porsi insulin singkat" 
        },
        "healthy_alternatives": ["Alternatif 1", "Alternatif 2"],
        "bad_ingredients": ["bahan 1", "bahan 2"],
        "reasoning": "Penjelasan singkat max 2 kalimat."
      }
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: mimeType } },
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanedText));

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Gagal memproses gambar" }, { status: 500 });
  }
}