// ============= Logo Watermark Component =============
export function LogoWatermark() {
  return (
    <div className="fixed bottom-4 right-4 z-40 opacity-20 hover:opacity-40 transition-opacity duration-300">
      <img 
        src="/logo.png" 
        alt="COLECCIONES DE TEMPORADA" 
        className="h-12 w-12 rounded-full object-cover shadow-lg"
      />
    </div>
  );
}