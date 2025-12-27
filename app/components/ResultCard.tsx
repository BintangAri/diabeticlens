import { useState } from 'react';

// Definisi Tipe Data Baru
interface ResultData {
  food_name: string;
  verdict: string;
  risk_level: string;
  reasoning: string;
  nutrients: { sugar: string; total_carbs: string; fiber: string; };
  bad_ingredients: string[];
  healthy_alternatives?: string[];
  carb_info?: { exchange: number; suggestion: string; };
}

export default function ResultCard({ data }: { data: ResultData }) {
  // State untuk Kalkulator Insulin
  const [ratio, setRatio] = useState<number>(15); // Default rasio 1:15
  
  const getTheme = () => {
    const v = data.verdict?.toUpperCase() || '';
    if (v.includes('AMAN')) return { 
      bg: 'bg-emerald-50/90', border: 'border-emerald-200', text: 'text-emerald-800', badge: 'bg-emerald-100 text-emerald-700', icon: '🥗' 
    };
    if (v.includes('HINDARI')) return { 
      bg: 'bg-rose-50/90', border: 'border-rose-200', text: 'text-rose-800', badge: 'bg-rose-100 text-rose-700', icon: '🚨' 
    };
    return { 
      bg: 'bg-amber-50/90', border: 'border-amber-200', text: 'text-amber-800', badge: 'bg-amber-100 text-amber-700', icon: '⚠️' 
    };
  };

  const theme = getTheme();
  const carbs = parseFloat(data.nutrients.total_carbs) || 0;
  const estimatedInsulin = (carbs / ratio).toFixed(1);

  return (
    <div className={`w-full max-w-md mt-6 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl border ${theme.border} animate-in fade-in slide-in-from-bottom-4`}>
      
      {/* HEADER */}
      <div className={`${theme.bg} p-6 border-b ${theme.border} flex justify-between items-center relative overflow-hidden`}>
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase opacity-60 mb-1">{data.food_name || "Produk Makanan"}</p>
          <h2 className={`text-3xl font-black tracking-tight ${theme.text}`}>{data.verdict}</h2>
        </div>
        <div className="text-5xl animate-float filter drop-shadow-sm">{theme.icon}</div>
      </div>

      {/* BODY */}
      <div className="p-6 bg-white/90 space-y-6">
        
        {/* Penjelasan */}
        <p className="text-gray-700 italic border-l-4 border-gray-200 pl-4 text-sm leading-relaxed">
          "{data.reasoning}"
        </p>

        {/* Grid Nutrisi */}
        <div className="grid grid-cols-3 gap-3">
          <Box label="Gula" value={data.nutrients.sugar} unit="g" />
          <Box label="Karbo" value={data.nutrients.total_carbs} unit="g" />
          <Box label="Serat" value={data.nutrients.fiber} unit="g" />
        </div>

        {/* 💡 FITUR 1: ALTERNATIF MAKANAN (Hanya muncul jika tidak AMAN) */}
        {data.healthy_alternatives && data.healthy_alternatives.length > 0 && !data.verdict.includes('AMAN') && (
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="text-xs font-bold text-blue-600 uppercase mb-2">✨ Coba Alternatif Lebih Sehat:</p>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              {data.healthy_alternatives.map((alt, i) => (
                <li key={i}>{alt}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 💉 FITUR 2: KALKULATOR INSULIN */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-bold text-gray-500 uppercase">Kalkulator Insulin</p>
            <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded text-gray-500">Estimasi Saja</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex-1">
              <label className="block text-[10px] text-gray-400 mb-1">Rasio Karbo (1:XX)</label>
              <input 
                type="number" 
                value={ratio} 
                onChange={(e) => setRatio(Number(e.target.value))}
                className="w-full p-2 rounded-lg border text-center font-bold text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                aria-label="hasil label nutrisi"
              />
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Butuh Sekitar</p>
              <p className="text-2xl font-black text-blue-600">{estimatedInsulin} <span className="text-sm font-normal text-gray-500">Unit</span></p>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            *Konsultasikan rasio insulin dengan dokter Anda.
          </p>
        </div>

      </div>
    </div>
  );
}

function Box({ label, value, unit }: any) {
  return (
    <div className="p-2 rounded-xl bg-gray-50 border border-gray-100 text-center">
      <p className="text-[10px] text-gray-400 font-bold uppercase">{label}</p>
      <p className="text-lg font-bold text-gray-800">{value}<span className="text-xs font-normal text-gray-400">{unit}</span></p>
    </div>
  );
}