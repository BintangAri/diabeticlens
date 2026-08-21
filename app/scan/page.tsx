'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import Navbar from '../components/Navbar';
import ImageUploader from '../components/ImageUploader';
import ResultCard from '../components/ResultCard';
import SkeletonLoader from '../components/SkeletonLoader';

interface HistoryItem {
  id: number;
  food_name: string;
  verdict: string;
  date: string;
  data: any;
}

export default function ScanPage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

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

  const saveToHistory = (data: any) => {
    // Mengambil verdict dari penilaian dewasa sebagai acuan utama riwayat
    const primaryVerdict = data.adult_assessment?.verdict || 'AMAN';

    const newItem: HistoryItem = {
      id: Date.now(),
      food_name: data.food_name || 'Makanan Tanpa Nama',
      verdict: primaryVerdict,
      date: new Date().toLocaleDateString('id-ID'),
      data,
    };

    const newHistory = [newItem, ...history].slice(0, 10);

    setHistory(newHistory);
    localStorage.setItem(
      'diabetic_history',
      JSON.stringify(newHistory)
    );
  };

  const loadFromHistory = (item: HistoryItem) => {
    setResult(item.data);
    setImage(null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const analyzeImage = async () => {
    if (!image) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image,
        }),
      });

      const data = await response.json();

      setResult(data);
      saveToHistory(data);
    } catch (error) {
      console.error(error);
      alert('Gagal melakukan analisis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20 font-sans">

      <Navbar />

      <div className="pt-28 px-6 max-w-md mx-auto">

        <div className="text-center mb-10">

          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
            Scan
            <span className="text-blue-600">
              {' '}Makanan & Minuman
            </span>
          </h1>

          <p className="mt-4 text-gray-600 leading-relaxed">
            Upload foto makanan atau minuman untuk mengetahui
            apakah aman dikonsumsi oleh penderita diabetes.
          </p>

        </div>

        {(!result || image) && (
          <ImageUploader
            image={image}
            onImageSelect={handleImageSelect}
            onReset={handleReset}
            loading={loading}
          />
        )}

        {image && !loading && !result && (
          <button
            onClick={analyzeImage}
            className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 transition active:scale-95"
          >
            ✨ Cek Keamanan Sekarang
          </button>
        )}

        {loading && <SkeletonLoader />}

        {result && (
          <>
            <ResultCard data={result} />

          </>
        )}

        {!image && !result && history.length > 0 && (

          <div className="mt-12">

            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
              Riwayat Scan Terakhir
            </h3>

            <div className="space-y-3">

              {history.map((item) => {
                // Menggunakan optional chaining untuk mengamankan pembacaan verdict dewasa
                const verdictText = item.verdict || (item as any).adult_assessment?.verdict || 'AMAN';

                return (
                  <div
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 cursor-pointer hover:bg-blue-50 transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-800">
                          {item.food_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.date}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          verdictText.includes('AMAN')
                            ? 'bg-green-100 text-green-700'
                            : verdictText.includes('HINDARI')
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {verdictText}
                      </span>
                    </div>
                  </div>
                );
              })}

            </div>

            <button
              onClick={() => {
                localStorage.removeItem('diabetic_history');
                setHistory([]);
              }}
              className="mt-6 w-full text-center text-xs text-red-500 hover:text-red-700"
            >
              Hapus Semua Riwayat
            </button>

          </div>
          

        )}

        <div className="mt-12 text-center">
          <Link href="/" className="inline-flex items-center text-slate-500 font-bold hover:text-blue-600 hover:underline transition-colors">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>

    </main>
  );
}