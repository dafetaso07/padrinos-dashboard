export function Header() {
  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <h1 className="text-xl font-bold">Dashboard de Seguimiento</h1>
            <p className="text-blue-200 text-sm">Planes de Trabajo de Padrinos</p>
          </div>
        </div>
      </div>
    </header>
  );
}
