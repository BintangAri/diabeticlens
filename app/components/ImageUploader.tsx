'use client';

import { useRef } from 'react';

interface Props {
  image: string | null;
  onImageSelect: (file: File) => void;
  onReset: () => void;
  loading: boolean;
}

export default function ImageUploader({ image, onImageSelect, onReset, loading }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageSelect(file);
  };

  if (image) {
    return (
      <div className="w-full max-w-md relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transition-all hover:scale-[1.02]">
        <img src={image} alt="Preview" className="w-full h-auto object-cover" />
        
        {!loading && (
          <button 
            onClick={onReset}
            className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-red-500 hover:bg-red-50 transition shadow-lg backdrop-blur-sm"
          >
            ✕ Ganti Foto
          </button>
        )}
      </div>
    );
  }

  return (
    <div 
      onClick={() => fileInputRef.current?.click()}
      className="w-full max-w-md h-64 border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 hover:border-blue-500 transition-all group gap-3 active:scale-95"
    >
      {/* Icon Kamera & Galeri */}
      <div className="flex gap-3 mb-1">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl group-hover:scale-110 transition-transform">
          📷
        </div>
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl group-hover:scale-110 transition-transform delay-75">
          🖼️
        </div>
      </div>
      
      <div className="text-center space-y-1">
        <p className="font-bold text-blue-900 text-lg">Ambil Foto / Pilih Galeri</p>
        <p className="text-blue-500/80 text-xs font-medium uppercase tracking-wider">
          Klik disini untuk memilih
        </p>
      </div>

      {/* INPUT FILE STANDAR */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
        aria-label="Upload foto label nutrisi"
        // PENTING: Jangan pakai 'capture' agar HP memberikan pilihan (Kamera/Galeri)
      />
    </div>
  );
}