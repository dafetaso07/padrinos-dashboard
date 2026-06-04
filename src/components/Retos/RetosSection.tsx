import { Actividad, Estado } from '../../types';

interface RetosSectionProps {
  actividades: Actividad[];
}

function getEstadoBadgeColor(estado: Estado): string {
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

export function RetosSection({ actividades }: RetosSectionProps) {
  const actividadesConRetos = actividades
    .filter((a) => a.retos.trim().length > 0)
    .sort((a, b) => a.padrino.localeCompare(b.padrino));

  const totalRetos = actividadesConRetos.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Retos Reportados</h3>
        <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {totalRetos}
        </span>
      </div>

      {totalRetos === 0 ? (
        <p className="text-gray-500 text-center py-6">
          No se encontraron actividades con retos reportados
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-600 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3">Padrino</th>
                <th className="px-4 py-3">Actividad</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Reto</th>
              </tr>
            </thead>
            <tbody>
              {actividadesConRetos.map((a, index) => (
                <tr
                  key={`${a.padrino}-${a.actividad}-${index}`}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">{a.padrino}</td>
                  <td className="px-4 py-3 text-gray-700">{a.actividad}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getEstadoBadgeColor(a.estado)}`}
                    >
                      {a.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{a.retos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
