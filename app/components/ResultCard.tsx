// 1. Definisi Tipe Data Baru (Sesuai output Gemini API yang direvisi)
interface Assessment {
  verdict: string;
  risk_level: string;
  reasoning: string;
}

interface ResultData {
  food_name: string;
  adult_assessment: Assessment;
  child_assessment: Assessment;
  nutrients: { sugar: string; total_carbs: string; fiber: string; };
  bad_ingredients: string[];
  healthy_alternatives?: string[];
  carb_info?: { exchange: number; suggestion: string; };
}

export default function ResultCard({ data }: { data: ResultData }) {
  
  // 2. Fungsi Dinamis Penentu Warna Tema Berdasarkan Verdict
  const getTheme = (verdict?: string) => {
    const v = verdict?.toUpperCase() || '';
    if (v.includes('AMAN')) return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', badge: 'bg-emerald-100 text-emerald-700' };
    if (v.includes('HINDARI')) return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', badge: 'bg-rose-100 text-rose-700' };
    return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', badge: 'bg-amber-100 text-amber-700' };
  };

  const adultTheme = getTheme(data.adult_assessment?.verdict);
  const childTheme = getTheme(data.child_assessment?.verdict);

  // Cek apakah produk tidak aman untuk salah satu kategori
  const isNotSafe = !data.adult_assessment?.verdict?.includes('AMAN') || !data.child_assessment?.verdict?.includes('AMAN');

  return (
    <div className="w-full max-w-md mt-6 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl border border-gray-200 animate-in fade-in slide-in-from-bottom-4 bg-white">
      
      {/* HEADER: NAMA PRODUK */}
      <div className="bg-slate-50 p-6 border-b border-gray-200 text-center relative overflow-hidden">
        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Hasil Analisis Nutrisi</p>
        <h2 className="text-2xl font-black tracking-tight text-slate-800">{data.food_name || "Produk Makanan"}</h2>
      </div>

      {/* BODY */}
      <div className="p-5 space-y-5">
        
        {/* KOTAK PENILAIAN GANDA (DEWASA & ANAK-ANAK) */}
        <div className="flex flex-col gap-3">
          
          {/* Card Dewasa */}
          <div className={`${adultTheme.bg} border ${adultTheme.border} p-4 rounded-2xl transition-colors`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className={`font-bold ${adultTheme.text} text-sm flex items-center gap-2`}>
                🧑 Dewasa <span className="text-[10px] font-normal opacity-75">(Batas 50g/hari)</span>
              </h3>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${adultTheme.badge}`}>
                {data.adult_assessment?.verdict || "N/A"}
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed border-l-2 border-current pl-2 opacity-90">
              "{data.adult_assessment?.reasoning}"
            </p>
          </div>

          {/* Card Anak-anak */}
          <div className={`${childTheme.bg} border ${childTheme.border} p-4 rounded-2xl transition-colors`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className={`font-bold ${childTheme.text} text-sm flex items-center gap-2`}>
                🧒 Anak <span className="text-[10px] font-normal opacity-75">(Batas 25g/hari)</span>
              </h3>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${childTheme.badge}`}>
                {data.child_assessment?.verdict || "N/A"}
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed border-l-2 border-current pl-2 opacity-90">
              "{data.child_assessment?.reasoning}"
            </p>
          </div>

        </div>

        {/* Grid Nutrisi Ekstrak API */}
        <div className="grid grid-cols-3 gap-3">
          <Box label="Gula" value={data.nutrients?.sugar} unit="g" />
          <Box label="Karbo" value={data.nutrients?.total_carbs} unit="g" />
          <Box label="Serat" value={data.nutrients?.fiber} unit="g" />
        </div>

        {/* 💡 FITUR: ALTERNATIF MAKANAN (Hanya muncul jika tidak AMAN) */}
        {isNotSafe && data.healthy_alternatives && data.healthy_alternatives.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="text-xs font-bold text-blue-600 uppercase mb-2">✨ Coba Alternatif Lebih Sehat:</p>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              {data.healthy_alternatives.map((alt, i) => (
                <li key={i}>{alt}</li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}

// Komponen Pembantu (Grid Nutrisi)
function Box({ label, value, unit }: any) {
  return (
    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-gray-800">{value || 0}<span className="text-xs font-normal text-gray-400 ml-1">{unit}</span></p>
    </div>
  );
}