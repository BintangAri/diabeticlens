import os
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd

app = FastAPI()

@app.get("/")
def read_root():
    return {"Pesan": "Server Backend Prediksi Diabetes Berjalan Lancar!"}

# Konfigurasi CORS agar Next.js (port 3000) diizinkan mengakses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Memuat model machine learning DAN scaler yang sudah dilatih menggunakan Absolute Path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, 'diabetes_model1.pkl'))
scaler = joblib.load(os.path.join(BASE_DIR, 'diabetes_scaler1.pkl'))

# Mendefinisikan struktur JSON yang akan dikirim oleh Frontend Next.js
class DiabetesInput(BaseModel):
    usia: float
    jenis_kelamin: int  # 1 = Perempuan, 0 = Laki-laki
    imt: float
    sistolik: float
    diastolik: float
    glukosa: float      # Variabel Python tidak boleh pakai spasi. Tetap gunakan 'glukosa' untuk menerima dari Frontend
    riwayat_hamil: float # Angka jumlah persalinan (0 jika laki-laki/belum pernah)
    riwayat_keluarga: int # 1 = Ada, 0 = Tidak

@app.post("/api/predict")
def predict_diabetes(data: DiabetesInput):
    # 1. Mengonversi JSON menjadi DataFrame Pandas
    input_df = pd.DataFrame([{
        'Usia': data.usia,
        'Jenis Kelamin': data.jenis_kelamin,
        'IMT': data.imt,
        'Sistolik': data.sistolik,
        'Diastolik': data.diastolik,
        'Glukosa Darah Sewaktu': data.glukosa, 
        'Riwayat Hamil': data.riwayat_hamil,
        'Riwayat Keluarga': data.riwayat_keluarga
    }])
    
    # 2. Menormalisasi data
    input_scaled = scaler.transform(input_df)
    
    # 3. Mendapatkan nilai probabilitas (tetap dihitung untuk logika di bawah)
    probability = model.predict_proba(input_scaled)[0][1] * 100 
    
    # ==============================================================
    # 4. KLASIFIKASI 2 KATEGORI (HIBRIDA KLINIS & ML)
    # ==============================================================
    nilai_glukosa = data.glukosa
    
    # Kategori 1: Risiko Tinggi 
    # (Batas pasti GDS >= 200 menurut PERKENI ATAU probabilitas ML >= 50%)
    if nilai_glukosa >= 200 or probability >= 50:
        hasil_teks = "Risiko Tinggi"
        
    # Kategori 2: Risiko Rendah
    else:
        hasil_teks = "Risiko Rendah"
    
    # Mengembalikan output tanpa persentase probabilitas
    return {
        "prediksi": hasil_teks,
        "data_diproses": data.model_dump() 
    }