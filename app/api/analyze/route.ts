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

    // UPDATE PROMPT: Pemisahan Logika Gula Dewasa (50g) dan Anak-anak (25g), Penghapusan Porsi Insulin
    const prompt = `
      Anda adalah Ahli Gizi Klinis dan Sistem Pendukung Keputusan yang ahli dalam membaca Informasi Nilai Gizi (ING) pada kemasan produk di Indonesia.
      Tugas Anda adalah membaca gambar label nutrisi kemasan, mengekstrak nilainya, dan mengklasifikasikan keamanan konsumsinya secara terpisah untuk orang DEWASA dan ANAK-ANAK.

      Aturan Klasifikasi (Wajib digunakan sebagai logika utama):
      1. Merujuk pada Peraturan Pemerintah (PP) No. 28 Tahun 2024 (BPOM dan WHO) tentang batas maksimum asupan gula harian:
         - DEWASA: Maksimal 50 gram per hari (sekitar 4 sendok makan).
         - ANAK-ANAK: Maksimal 25 gram per hari (sekitar 2 sendok makan atau 6 sendok teh).
      2. Evaluasi Dewasa: Jika gula per sajian menyumbang >20-30% batas harian 50g, berikan verdict "HINDARI" atau "BATASI" dengan risk_level "Tinggi" atau "Sedang".
      3. Evaluasi Anak: Jika gula per sajian menyumbang >20-30% batas harian 25g, berikan verdict "HINDARI" atau "BATASI" dengan risk_level "Tinggi" atau "Sedang".
      4. Jika kandungan gula rendah/nol, dan karbohidrat wajar, berikan verdict "AMAN" dengan risk_level "Rendah".

      Tugas Tambahan:
      1. Identifikasi Nama Makanan/Produk (jika tidak ada, tebak berdasarkan jenisnya).
      2. Hitung "Carb Exchange" (1 Exchange = 15g Karbohidrat Total).
      3. Berikan 2-3 alternatif makanan sejenis yang lebih sehat jika produk masuk kategori BATASI/HINDARI.
      
      Output WAJIB JSON valid (tanpa markdown) dengan format berikut:
      {
        "food_name": "Nama Makanan",
        "adult_assessment": {
           "verdict": "AMAN" | "BATASI" | "HINDARI",
           "risk_level": "Rendah" | "Sedang" | "Tinggi",
           "reasoning": "Penjelasan medis singkat (max 2 kalimat) mengaitkan angka gula dengan batas harian dewasa 50g."
        },
        "child_assessment": {
           "verdict": "AMAN" | "BATASI" | "HINDARI",
           "risk_level": "Rendah" | "Sedang" | "Tinggi",
           "reasoning": "Penjelasan medis singkat (max 2 kalimat) mengaitkan angka gula dengan batas harian anak-anak 25g."
        },
        "nutrients": {
           "total_carbs": "jumlah gram (angka saja, misal 20)",
           "sugar": "jumlah gram (angka saja, misal 15)",
           "fiber": "jumlah gram (angka saja, misal 2)"
        },
        "carb_info": {
           "exchange": "angka estimasi takaran (misal 1.5)"
        },
        "healthy_alternatives": ["Alternatif 1", "Alternatif 2"],
        "bad_ingredients": ["bahan 1", "bahan 2"]
      }
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: mimeType } },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Sanitasi respons LLM agar menjadi format JSON yang murni
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanedText));

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Menangkap error khusus 503 dari Google API saat server sedang sibuk
    if (error.status === 503 || (error.message && error.message.includes('503'))) {
      return NextResponse.json(
        { error: "Layanan pemindai saat ini sedang sibuk karena tingginya permintaan. Silakan coba beberapa saat lagi." }, 
        { status: 503 }
      );
    }

    // Menangkap error umum lainnya
    return NextResponse.json(
      { error: "Gagal memproses gambar. Pastikan gambar jelas dan coba lagi." }, 
      { status: 500 }
    );
  }
}