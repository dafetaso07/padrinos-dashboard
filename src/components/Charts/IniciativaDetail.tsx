import { Actividad, Estado } from '../../types';

interface IniciativaDetailProps {
  actividades: Actividad[];
}

interface IniciativaGroup {
  nombre: string;
  padrino: string;
  area: string;
  actividades: Actividad[];
  totalActividades: number;
  completadas: number;
  porcentajeCumplimiento: number;
  avancePromedio: number;
}

function getEstadoBadge(estado: Estado): string {
  switch (estado) {
    case 'Completada':
      return 'bg-green-100 text-green-800';
    case 'En ejecución':
      return 'bg-blue-100 text-blue-800';
    case 'Vencida':
      return 'bg-red-100 text-red-800';
    case 'Pendiente':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getCumplimientoColor(porcentaje: number): string {
  if (porcentaje >= 75) return 'text-green-700 bg-green-50 border-green-200';
  if (porcentaje >= 50) return 'text-blue-700 bg-blue-50 border-blue-200';
  if (porcentaje >= 25) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
  return 'text-red-700 bg-red-50 border-red-200';
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
}

function groupByIniciativa(actividades: Actividad[]): IniciativaGroup[] {
  const groups = new Map<string, Actividad[]>();

  for (const a of actividades) {
    const key = a.iniciativa || 'Sin iniciativa';
    const current = groups.get(key) ?? [];
    current.push(a);
    groups.set(key, current);
  }

  const result: IniciativaGroup[] = [];
  for (const [nombre, acts] of groups) {
    const completadas = acts.filter((a) => a.estado === 'Completada').length;
    const avancePromedio = acts.length > 0
      ? Math.round(acts.reduce((sum, a) => sum + a.porcentajeAvance, 0) / acts.length)
      : 0;
    const padrinos = [...new Set(acts.map((a) => a.padrino))];
    const areas = [...new Set(acts.map((a) => a.area))];

    result.push({
      nombre,
      padrino: padrinos.join(', '),
      area: areas.join(', '),
      actividades: acts,
      totalActividades: acts.length,
      completadas,
      porcentajeCumplimiento: acts.length > 0 ? Math.round((completadas / acts.length) * 100) : 0,
      avancePromedio,
    });
  }

  return result.sort((a, b) => b.porcentajeCumplimiento - a.porcentajeCumplimiento);
}

export function IniciativaDetail({ actividades }: IniciativaDetailProps) {
  const grupos = groupByIniciativa(actividades);

  if (grupos.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalle por Iniciativa</h3>
        <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Detalle por Iniciativa</h3>

      {grupos.map((grupo) => (
        <div key={grupo.nombre} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header de la iniciativa */}
          <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-semibold text-gray-800 text-base">{grupo.nombre}</h4>
              <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                <span>👤 {grupo.padrino}</span>
                <span>🏢 {grupo.area}</span>
                <span>📋 {grupo.totalActividades} actividades</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Barra de avance promedio */}
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Avance promedio</div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all"
                      style={{ width: `${grupo.avancePromedio}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{grupo.avancePromedio}%</span>
                </div>
              </div>
              {/* Badge de cumplimiento */}
              <div className={`px-3 py-1.5 rounded-lg border text-sm font-bold ${getCumplimientoColor(grupo.porcentajeCumplimiento)}`}>
                {grupo.porcentajeCumplimiento}% cumplido
              </div>
            </div>
          </div>

          {/* Tabla de actividades */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Actividad</th>
                  <th className="px-4 py-2">Fecha</th>
                  <th className="px-4 py-2">Estado</th>
                  <th className="px-4 py-2">Avance</th>
                  <th className="px-4 py-2">Avance último periodo</th>
                  <th className="px-4 py-2">Retos</th>
                </tr>
              </thead>
              <tbody>
                {grupo.actividades.map((a, idx) => (
                  <tr key={a.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2.5 text-gray-800 font-medium">{a.actividad}</td>
                    <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{formatDate(a.fechaCompromiso)}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getEstadoBadge(a.estado)}`}>
                        {a.estado}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-14 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${a.porcentajeAvance}%` }} />
                        </div>
                        <span className="text-xs text-gray-600">{a.porcentajeAvance}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-gray-600 text-xs max-w-[160px] truncate" title={a.avanceUltimoPeriodo}>
                      {a.avanceUltimoPeriodo || '—'}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600 text-xs max-w-[140px] truncate" title={a.retos}>
                      {a.retos || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
