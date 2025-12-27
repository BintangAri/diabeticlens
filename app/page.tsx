'use client';

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ImageUploader from './components/ImageUploader';
import ResultCard from './components/ResultCard';
import SkeletonLoader from './components/SkeletonLoader';

// Tipe data untuk History
interface HistoryItem {
  id: number;
  food_name: string;
  verdict: string;
  date: string;
  data: any; // Data lengkap hasil scan
}

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // 1. Load History saat aplikasi dibuka
  useEffect(() => {
    const saved = localStorage.getItem('diabetic_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setImage(null);
    setResult(null);
  };

  // Fungsi simpan ke LocalStorage
  const saveToHistory = (data: any) => {
    const newItem: HistoryItem = {
      id: Date.now(),
      food_name: data.food_name || "Makanan Tanpa Nama",
      verdict: data.verdict,
      date: new Date().toLocaleDateString('id-ID'),
      data: data
    };

    // Ambil history lama, tambah yg baru di depan, batasi max 10 item
    const newHistory = [newItem, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('diabetic_history', JSON.stringify(newHistory));
  };

  // Fungsi Load dari History
  const loadFromHistory = (item: HistoryItem) => {
    setResult(item.data);
    setImage(null); // Sembunyikan uploader saat melihat history
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();
      setResult(data);
      saveToHistory(data); // OTOMATIS SIMPAN KE HISTORY
    } catch (error) {
      alert('Gagal, coba lagi ya!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-20 font-sans">
      <Navbar />
      
      <div className="pt-32 px-6 flex flex-col items-center max-w-md mx-auto">
        
        {/* Tombol kembali ke scan (jika sedang lihat history) */}
        {!image && result && (
          <button 
            onClick={() => { setResult(null); setImage(null); }}
            className="mb-6 text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline"
          >
            ← Kembali ke Scan Baru
          </button>
        )}

        {/* Uploader (Sembunyi jika sedang lihat hasil history tanpa gambar) */}
        {(!result || image) && (
          <>
            {!image && (
              <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                  Cek Makananmu,<br/> <span className="text-blue-600">Jaga Gula Darahmu.</span>
                </h2>
              </div>
            )}
            <ImageUploader 
              image={image} 
              onImageSelect={handleImageSelect} 
              onReset={handleReset}
              loading={loading}
            />
          </>
        )}

        {/* Tombol Analisa */}
        {image && !result && !loading && (
          <button
            onClick={analyzeImage}
            className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            ✨ Cek Keamanan Sekarang
          </button>
        )}

        {/* TAMPILAN HASIL */}
        {loading && <SkeletonLoader />}
        {result && <ResultCard data={result} />}

        {/* 🕒 FITUR 3: DAFTAR HISTORY */}
        {!image && !result && history.length > 0 && (
          <div className="w-full mt-10">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Riwayat Scan Terakhir</h3>
            <div className="space-y-3">
              {history.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition active:scale-98"
                >
                  <div>
                    <p className="font-bold text-gray-800">{item.food_name}</p>
                    <p className="text-xs text-gray-400">{item.date}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full 
                    ${item.verdict.includes('AMAN') ? 'bg-green-100 text-green-700' : 
                      item.verdict.includes('HINDARI') ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {item.verdict}
                  </span>
                </div>
              ))}
            </div>
            {/* Tombol Hapus History */}
            <button 
              onClick={() => { localStorage.removeItem('diabetic_history'); setHistory([]); }}
              className="mt-6 text-xs text-red-400 w-full text-center hover:text-red-600"
            >
              Hapus Semua Riwayat
            </button>
          </div>
        )}

      </div>
    </main>
  );
}