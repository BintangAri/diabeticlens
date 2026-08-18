"use client";

import { useState } from "react";

interface PredictionResult {
  prediksi: string;
}

export default function PredictionForm() {
  const [formData, setFormData] = useState({
    usia: "",
    jenis_kelamin: "0",
    berat_badan: "",
    tinggi_badan: "",
    tekanan_darah: "", 
    glukosa: "",
    riwayat_hamil: "0",
    riwayat_keluarga: "0",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PredictionResult | null>(null);

  // LOGIKA BARU: Mencegat perubahan jenis kelamin
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "jenis_kelamin" && value === "0") {
      // Jika diganti ke Laki-laki, paksa riwayat_hamil menjadi 0
      setFormData({
        ...formData,
        [name]: value,
        riwayat_hamil: "0",
      });
    } else {
      // Jika input lain yang berubah, update secara normal
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Kalkulasi IMT secara live (Real-time) untuk ditampilkan di UI
  const berat = Number(formData.berat_badan);
  const tinggiMeter = Number(formData.tinggi_badan) / 100;
  const imtLive = (tinggiMeter > 0 && berat > 0) 
    ? (berat / Math.pow(tinggiMeter, 2)).toFixed(1) 
    : "0.0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // 1. Validasi Tekanan Darah
      const tdParts = formData.tekanan_darah.split("/");
      if (tdParts.length !== 2) {
        throw new Error("Format tekanan darah tidak valid. Gunakan format seperti 120/80.");
      }
      const sistolik = Number(tdParts[0].trim());
      const diastolik = Number(tdParts[1].trim());

      // 2. Susun Payload dengan nilai IMT yang sudah dikalkulasi
      const payload = {
        usia: Number(formData.usia),
        jenis_kelamin: Number(formData.jenis_kelamin),
        imt: parseFloat(imtLive), // Menggunakan nilai IMT yang tampil di layar
        sistolik: sistolik,
        diastolik: diastolik,
        glukosa: Number(formData.glukosa),
        riwayat_hamil: Number(formData.riwayat_hamil),
        riwayat_keluarga: Number(formData.riwayat_keluarga),
      };

      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Gagal terhubung ke Backend. Pastikan uvicorn sudah berjalan di port 8000.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch: Pastikan server FastAPI sudah dinyalakan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        Prediksi Risiko Diabetes
      </h2>
      <p className="text-gray-500 mb-8">
        Lengkapi data klinis berikut untuk mengetahui tingkat risiko diabetes Anda.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Usia</label>
            <input
              type="number"
              name="usia"
              value={formData.usia}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Contoh: 45"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Jenis Kelamin</label>
            <select
              name="jenis_kelamin"
              value={formData.jenis_kelamin}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="0">Laki-laki</option>
              <option value="1">Perempuan</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Tinggi Badan (cm)</label>
            <input
              type="number"
              name="tinggi_badan"
              value={formData.tinggi_badan}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Contoh: 165"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Berat Badan (kg)</label>
            <input
              type="number"
              name="berat_badan"
              value={formData.berat_badan}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Contoh: 65"
              required
            />
          </div>
        </div>

        {/* --- KOTAK TAMPILAN IMT --- */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center mt-2 mb-2">
          <span className="text-sm font-semibold text-slate-600">
            Kalkulasi Indeks Massa Tubuh (IMT):
          </span>
          <span className="text-xl font-bold text-blue-600">
            {imtLive}
          </span>
        </div>
        {/* --------------------------- */}

        <div>
          <label className="block text-sm font-semibold mb-2">Tekanan Darah</label>
          <input
            type="text"
            name="tekanan_darah"
            value={formData.tekanan_darah}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Format: 120/80"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Glukosa Darah Sewaktu (mg/dL)</label>
          <input
            type="number"
            name="glukosa"
            value={formData.glukosa}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Contoh: 110"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Riwayat Kehamilan</label>
            <input
              type="number"
              name="riwayat_hamil"
              value={formData.riwayat_hamil}
              onChange={handleChange}
              disabled={formData.jenis_kelamin === "0"} 
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              placeholder="0 jika laki-laki"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Riwayat Diabetes Keluarga</label>
            <select
              name="riwayat_keluarga"
              value={formData.riwayat_keluarga}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="0">Tidak Ada</option>
              <option value="1">Ada</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-2xl transition mt-6"
        >
          {loading ? "Memproses Analisis..." : "Prediksi Risiko Diabetes"}
        </button>
      </form>

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 font-medium">
          {error}
        </div>
      )}

      {result && (
        <div
          className={`mt-8 rounded-2xl border p-6 transition-all duration-300 ${
            result.prediksi === "Risiko Tinggi"
              ? "bg-red-50 border-red-300 text-red-800"
              : "bg-green-50 border-green-300 text-green-800"
          }`}
        >
          <h3 className="text-xl font-bold mb-3">Hasil Klasifikasi</h3>
          <p className="text-lg">
            <strong>Status:</strong> {result.prediksi}
          </p>
          
          {/* KOTAK SARAN TAMBAHAN */}
          <div className="mt-4 pt-4 border-t border-current opacity-90">
            <p className="text-sm font-bold mb-1 flex items-center gap-2">
              💡 Saran Tindakan:
            </p>
            <p className="text-sm leading-relaxed">
              {result.prediksi === "Risiko Tinggi"
                ? "Segera konsultasikan dengan dokter atau fasilitas kesehatan terdekat untuk pemeriksaan klinis lebih lanjut (seperti tes laboratorium HbA1c). Mulailah perbaiki gaya hidup Anda dengan rutin berolahraga, menjaga pola makan bergizi, membatasi asupan gula tambahan, dan mengontrol berat badan."
                : "Pertahankan gaya hidup sehat Anda! Tetap rutin berolahraga, konsumsi makanan bergizi seimbang, dan jaga berat badan ideal. Jangan lupa untuk tetap melakukan pemeriksaan kesehatan secara berkala agar kondisi tubuh tetap terpantau."}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}