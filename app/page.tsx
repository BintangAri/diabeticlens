'use client';

import Link from 'next/link';
import Navbar from './components/Navbar';
import PredictionForm from './components/PredictionForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans">

      <Navbar />

      <div className="pt-28 px-6 pb-16 max-w-xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
            Prediksi
            <span className="text-blue-600"> Risiko Diabetes</span>
          </h1>

          <p className="mt-4 text-gray-600 text-base leading-relaxed">
            Isi data kesehatan Anda untuk mengetahui tingkat risiko diabetes
            menggunakan model Machine Learning.
          </p>
        </div>

        {/* Prediction Form */}
        <PredictionForm />

        {/* Divider */}
        <div className="flex items-center gap-4 my-12">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="text-gray-400 text-sm font-medium">ATAU</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Scan Section */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-8 text-center">

          <div className="text-5xl mb-4">
            🍽️
          </div>

          <h2 className="text-2xl font-bold text-slate-800">
            Ingin mengecek makanan atau minumanmu?
          </h2>

          <p className="mt-3 text-gray-600 leading-relaxed">
            Upload foto makanan atau minuman dan biarkan AI membantu
            menganalisis apakah makanan tersebut aman dikonsumsi oleh
            penderita diabetes.
          </p>

          <Link
            href="/scan"
            className="inline-flex items-center justify-center mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-blue-200"
          >
            📷 Scan Makanan Sekarang
          </Link>

        </div>

      </div>

    </main>
  );
}

