import { Actividad, Estado } from '../../types';

interface ActividadesTableProps {
  actividades: Actividad[];
  padrinos: string[];
  onEdit: (actividad: Actividad) => void;
  onDelete: (id: string) => void;
  onMarkComplete: (id: string) => void;
  onReassign: (id: string, nuevoPadrino: string) => void;
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

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function ActividadesTable({ actividades, padrinos, onEdit, onDelete, onMarkComplete, onReassign }: ActividadesTableProps) {
  if (actividades.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <p className="text-gray-500">No hay actividades registradas para este padrino</p>
      </div>
    );
  }

  const handleReassign = (actividadId: string, currentPadrino: string) => {
    const otrosPadrinos = padrinos.filter((p) => p !== currentPadrino);
    if (otrosPadrinos.length === 0) {
      alert('No hay otros padrinos disponibles para reasignar');
      return;
    }
    const nuevoPadrino = prompt(
      `Reasignar a otro padrino.\nOpciones disponibles:\n${otrosPadrinos.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nEscribe el nombre exacto del padrino:`
    );
    if (nuevoPadrino && padrinos.includes(nuevoPadrino.trim())) {
      onReassign(actividadId, nuevoPadrino.trim());
    } else if (nuevoPadrino) {
      alert('Padrino no encontrado. Verifica el nombre.');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-600 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-3 py-3">Iniciativa</th>
              <th className="px-3 py-3">Actividad</th>
              <th className="px-3 py-3">Área</th>
              <th className="px-3 py-3">Fecha</th>
              <th className="px-3 py-3">Estado</th>
              <th className="px-3 py-3">Avance</th>
              <th className="px-3 py-3">Avance último periodo</th>
              <th className="px-3 py-3">Retos</th>
              <th className="px-3 py-3 text-center">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {actividades.map((a, index) => (
              <tr
                key={a.id}
                className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
              >
                <td className="px-3 py-3 font-medium text-gray-800 max-w-[140px]">
                  {a.iniciativa || '—'}
                </td>
                <td className="px-3 py-3 text-gray-700 max-w-[180px]">
                  {a.actividad}
                </td>
                <td className="px-3 py-3 text-gray-600">{a.area}</td>
                <td className="px-3 py-3 text-gray-600 whitespace-nowrap">
                  {formatDate(a.fechaCompromiso)}
                </td>
                <td className="px-3 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getEstadoBadge(a.estado)}`}>
                    {a.estado}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-14 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${a.porcentajeAvance}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{a.porcentajeAvance}%</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-gray-600 max-w-[140px] truncate" title={a.avanceUltimoPeriodo}>
                  {a.avanceUltimoPeriodo || '—'}
                </td>
                <td className="px-3 py-3 text-gray-600 max-w-[130px] truncate" title={a.retos}>
                  {a.retos || '—'}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-center gap-1">
                    {a.estado !== 'Completada' && (
                      <button
                        onClick={() => onMarkComplete(a.id)}
                        title="Marcar como completada"
                        className="p-1.5 text-green-600 hover:bg-green-100 rounded-md transition-colors cursor-pointer text-sm"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(a)}
                      title="Editar"
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors cursor-pointer text-sm"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleReassign(a.id, a.padrino)}
                      title="Reasignar a otro padrino"
                      className="p-1.5 text-purple-600 hover:bg-purple-100 rounded-md transition-colors cursor-pointer text-sm"
                    >
                      ↗
                    </button>
                    <button
                      onClick={() => onDelete(a.id)}
                      title="Eliminar"
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors cursor-pointer text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
