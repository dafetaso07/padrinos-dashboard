interface NavigationProps {
  currentPage: 'dashboard' | 'admin' | 'mapa';
  onNavigate: (page: 'dashboard' | 'admin' | 'mapa') => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 h-12 items-center">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              currentPage === 'dashboard'
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => onNavigate('mapa')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              currentPage === 'mapa'
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            🗺️ Mapa de Padrinos
          </button>
          <button
            onClick={() => onNavigate('admin')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              currentPage === 'admin'
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            ✏️ Administrar Actividades
          </button>
        </div>
      </div>
    </nav>
  );
}
