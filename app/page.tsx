import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Selamat Datang di <span className="text-blue-600">DiabeticLens</span>
          </h1>
          <p className="text-slate-500 text-lg">
            Sistem pendukung keputusan cerdas untuk skrining risiko Diabetes Melitus Tipe 2 
            dan analisis keamanan label nutrisi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* MENU PREDIKSI */}
          <Link href="/prediksi" className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 hover:shadow-xl transition-all text-center group">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🩺</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Prediksi Risiko</h2>
            <p className="text-slate-500 mb-6">Cek tingkat risiko diabetes menggunakan 8 parameter klinis kesehatan dasar.</p>
            <div className="bg-blue-50 text-blue-600 py-3 rounded-xl font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
              Mulai Prediksi &rarr;
            </div>
          </Link>

          {/* MENU SCAN NUTRISI */}
          <Link href="/scan" className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 hover:shadow-xl transition-all text-center group">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📸</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Scan Nutrisi</h2>
            <p className="text-slate-500 mb-6">Unggah foto label Gizi pada kemasan untuk mengecek apakah kandungan gulanya aman dikonsumsi.</p>
            <div className="bg-emerald-50 text-emerald-600 py-3 rounded-xl font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              Mulai Scan &rarr;
            </div>
          </Link>
        </div>
      </div>
      
      <footer className="w-full py-6 text-center text-sm text-slate-400">
        &copy; {new Date().getFullYear()} Bintang Ari - Universitas Gunadarma
      </footer>
    </main>
  );
}