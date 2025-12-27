export default function Navbar() {
  return (
    // PERUBAHAN DI SINI:
    // Ganti 'fixed' menjadi 'absolute'
    <div className="absolute top-6 left-0 right-0 z-50 flex justify-center px-4">
      
      <nav className="glass-panel px-6 py-3 rounded-full flex items-center gap-4 shadow-lg shadow-gray-200/20">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm shadow-blue-200 shadow-md">
          DL
        </div>
        <h1 className="text-sm font-bold text-gray-700 tracking-tight">
          Diabetic Lens
        </h1>
        <div className="h-4 w-[1px] bg-gray-300"></div>
        <a 
          href="#" 
          className="text-xs font-medium text-gray-400 hover:text-blue-600 transition"
        >
          v1.0
        </a>
      </nav>
      
    </div>
  );
}