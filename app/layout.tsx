import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Diabetic Lens",
  description: "AI Nutrition Analyzer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        {children}

        {/* --- DOKTER POJOK KIRI (Mengintip & Goyang Kalem) --- */}
        <img
          src="/doctor.png"
          alt="Ilustrasi Dokter"
          // PERBAIKAN POSISI:
          // -ml-12 (negative margin-left 48px) -> Menarik gambar lebih ke kiri (keluar layar sedikit)
          className="fixed bottom-0 left-0 -ml-12 w-36 md:w-44 h-auto z-50 opacity-100 pointer-events-none animate-swing"
        />
        {/* ---------------------------------------------------- */}

      </body>
    </html>
  );
}