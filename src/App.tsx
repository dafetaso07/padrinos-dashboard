import { useState, useEffect, useCallback } from 'react';
import { Actividad, FiltrosState } from './types';
import { fetchActividadesAPI } from './services/api';
import { useActividades } from './hooks/useActividades';
import { useKPIs } from './hooks/useKPIs';
import { calcularCumplimientoPorPadrino, calcularCumplimientoPorArea, calcularCumplimientoPorIniciativa, calcularActividadesPorEstado } from './utils/calculations';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ErrorMessage } from './components/common/ErrorMessage';
import { FilterBar } from './components/Filters/FilterBar';
import { KPICards } from './components/KPIs/KPICards';
import { CumplimientoPadrino } from './components/Charts/CumplimientoPadrino';
import { CumplimientoArea } from './components/Charts/CumplimientoArea';
import { CumplimientoIniciativa } from './components/Charts/CumplimientoIniciativa';
import { ActividadesPorEstado } from './components/Charts/ActividadesPorEstado';
import { IniciativaDetail } from './components/Charts/IniciativaDetail';
import { RetosSection } from './components/Retos/RetosSection';
import { MapaPadrinos } from './components/Mapa/MapaPadrinos';
import { AdminPage } from './components/Admin/AdminPage';

function DashboardContent({ actividades }: { actividades: Actividad[] }) {
  const [filtros, setFiltros] = useState<FiltrosState>({
    padrinos: [],
    areas: [],
    estados: [],
    iniciativas: [],
  });

  const actividadesFiltradas = useActividades(actividades, filtros);
  const kpis = useKPIs(actividadesFiltradas);

  const cumplimientoPadrino = calcularCumplimientoPorPadrino(actividadesFiltradas);
  const cumplimientoArea = calcularCumplimientoPorArea(actividadesFiltradas);
  const cumplimientoIniciativa = calcularCumplimientoPorIniciativa(actividadesFiltradas);
  const distribucionEstado = calcularActividadesPorEstado(actividadesFiltradas);

  const hasActiveFilters =
    filtros.padrinos.length > 0 || filtros.areas.length > 0 || filtros.estados.length > 0 || filtros.iniciativas.length > 0;

  const noResults = hasActiveFilters && actividadesFiltradas.length === 0;

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <FilterBar actividades={actividades} filtros={filtros} onFiltroChange={setFiltros} />

      {noResults ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">No hay datos para los filtros seleccionados</p>
        </div>
      ) : (
        <>
          <KPICards kpis={kpis} />

          {/* Gráficas resumen */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CumplimientoIniciativa data={cumplimientoIniciativa} />
            <ActividadesPorEstado data={distribucionEstado} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CumplimientoPadrino data={cumplimientoPadrino} />
            <CumplimientoArea data={cumplimientoArea} />
          </div>

          {/* Detalle agrupado por iniciativa */}
          <IniciativaDetail actividades={actividadesFiltradas} />

          {/* Retos */}
          <RetosSection actividades={actividadesFiltradas} />
        </>
      )}
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState<'dashboard' | 'admin' | 'mapa'>('dashboard');
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchActividadesAPI();
      setActividades(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateActividades = (updated: Actividad[]) => {
    setActividades(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Navigation currentPage={page} onNavigate={setPage} />

      {page === 'dashboard' && <DashboardContent actividades={actividades} />}
      {page === 'mapa' && <MapaPadrinos actividades={actividades} />}
      {page === 'admin' && <AdminPage actividades={actividades} onUpdate={handleUpdateActividades} />}
    </div>
  );
}
