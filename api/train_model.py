import pandas as pd
import numpy as np
import re
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from imblearn.over_sampling import SMOTE
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

print("1. Membaca dan Membersihkan Dataset...")
# Sesuaikan nama file Excel dengan nama file yang Anda miliki
file_path = "Dataset.xlsx"
df = pd.read_excel(file_path)

# ==============================================================
# TAHAP 1: PREPROCESSING & DATA CLEANING
# ==============================================================

# B. Membersihkan Jenis Kelamin (P = 1, L = 0)
df['Jenis Kelamin'] = df['JENIS KELAMIN'].apply(lambda x: 1 if str(x).strip().upper() == 'P' else 0)

# C. Membersihkan Umur (Hanya mengambil angka dari string seperti '30 th')
df['Usia'] = df['UMUR'].astype(str).apply(lambda x: re.sub(r'\D', '', x))
df['Usia'] = pd.to_numeric(df['Usia'], errors='coerce')

# D. Membersihkan Riwayat Kehamilan (Sesuai jumlah persalinan)
df['Riwayat Hamil'] = pd.to_numeric(df['Riwayat Hamil'], errors='coerce').fillna(0)
df.loc[df['Riwayat Hamil'] > 20, 'Riwayat Hamil'] = 0  # Hapus outlier (misal salah ketik '410')

# E. Membersihkan Riwayat Keluarga (1 = Ada, 0 = Tidak)
df['Riwayat Keluarga'] = pd.to_numeric(df['Riwayat Keluarga'], errors='coerce').fillna(0)
df['Riwayat Keluarga'] = df['Riwayat Keluarga'].apply(lambda x: 1 if x > 0 else 0)

# F. Konversi format numerik untuk fitur lainnya
df['Glukosa Darah Sewaktu'] = pd.to_numeric(df['Glukosa Darah Sewaktu'], errors='coerce')
df['IMT'] = pd.to_numeric(df['IMT'], errors='coerce')
df['Sistolik'] = pd.to_numeric(df['Sistolik'], errors='coerce')
df['Diastolik'] = pd.to_numeric(df['Diastolik'], errors='coerce')

# ==============================================================
# TAHAP 2: PEMILIHAN FITUR & PENANGANAN MISSING VALUES
# ==============================================================

# Menentukan 8 fitur input yang akan dipelajari model (TB dan BB dibuang)
features = ['Usia', 'Jenis Kelamin', 'IMT', 'Sistolik', 'Diastolik', 'Glukosa Darah Sewaktu', 'Riwayat Hamil', 'Riwayat Keluarga']

# Mengambil kolom fitur dan target, lalu membuang baris yang masih kosong (NaN)
df_clean = df[features + ['Outcome']].dropna()

X = df_clean[features]
y = df_clean['Outcome']

print(f"Total data bersih sebelum SMOTE: {len(df_clean)} pasien")
print(f"Distribusi Target: Diabetes = {sum(y==1)}, Tidak Diabetes = {sum(y==0)}")

# ==============================================================
# TAHAP 3: PEMBAGIAN DATA & PENYEIMBANGAN (SMOTE)
# ==============================================================

# Split data latih (70%) dan data uji (30%) SEBELUM menerapkan SMOTE
X_train_raw, X_test_raw, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Normalisasi data menggunakan MinMaxScaler
print("\n2. Normalisasi Data Lokal (Offline)...")
scaler = MinMaxScaler()
# Fit scaler hanya pada data latih untuk mencegah kebocoran informasi (data leakage)
X_train_scaled = scaler.fit_transform(X_train_raw)
X_test_scaled = scaler.transform(X_test_raw)

# Menerapkan SMOTE HANYA pada data latih agar model tidak bias
print("3. Menyeimbangkan Data Latih dengan SMOTE...")
smote = SMOTE(random_state=42)
X_train_smote, y_train_smote = smote.fit_resample(X_train_scaled, y_train)

print(f"Distribusi Target Latih setelah SMOTE: Diabetes = {sum(y_train_smote==1)}, Tidak = {sum(y_train_smote==0)}")

# ==============================================================
# TAHAP 4: TRAINING MODEL & EVALUASI
# ==============================================================

print("\n4. Melatih Model Naïve Bayes...")
model = GaussianNB()
model.fit(X_train_smote, y_train_smote)

# Menguji model dengan data uji (yang tidak disentuh SMOTE)
y_pred = model.predict(X_test_scaled)

print("\n=========================================")
print("      HASIL EVALUASI MODEL NAIVE BAYES    ")
print("=========================================")
print(f"Akurasi Keseluruhan : {accuracy_score(y_test, y_pred) * 100:.2f}%\n")

cm = confusion_matrix(y_test, y_pred)
print("--- Confusion Matrix ---")
# Baris: Kelas Asli, Kolom: Kelas Prediksi
print(cm)

print("\n--- Classification Report ---")
print(classification_report(y_test, y_pred, target_names=["Tidak Diabetes (0)", "Diabetes (1)"]))
print("=========================================\n")

# ==============================================================
# TAMBAHAN: VISUALISASI CONFUSION MATRIX KE PNG
# ==============================================================

plt.figure(figsize=(7, 5))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
            xticklabels=["Tidak Diabetes (0)", "Diabetes (1)"],
            yticklabels=["Tidak Diabetes (0)", "Diabetes (1)"],
            annot_kws={"size": 16})

plt.xlabel('Nilai Prediksi Sistem (Predicted Label)', fontweight='bold')
plt.ylabel('Nilai Asli Pasien (True Label)', fontweight='bold')
plt.title('Confusion Matrix - Algoritma Naïve Bayes', fontweight='bold', pad=15)
plt.tight_layout()

# Menyimpan hasil visualisasi menjadi file PNG
plt.savefig('confusion_matrix.png', dpi=300)
print("[SUKSES] Visualisasi disimpan sebagai 'confusion_matrix.png'")

# Hapus tanda '#' pada baris di bawah ini jika Anda ingin 
# gambarnya juga muncul (pop-up) di layar saat program dijalankan
# plt.show() 

# ==============================================================
# TAHAP 5: EXPORT MODEL
# ==============================================================

joblib.dump(model, 'diabetes_model1.pkl')
joblib.dump(scaler, 'diabetes_scaler1.pkl')
print("[SUKSES] File 'diabetes_model1.pkl' dan 'diabetes_scaler1.pkl' berhasil disimpan.")
print("Siap digunakan untuk backend FastAPI Anda!")