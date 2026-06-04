import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EstadoDistribucion } from '../../types';

interface ActividadesPorEstadoProps {
  data: EstadoDistribucion[];
}

export function ActividadesPorEstado({ data }: ActividadesPorEstadoProps) {
  const hasData = data.some((d) => d.cantidad > 0);

  if (!hasData) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividades por Estado</h3>
        <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividades por Estado</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="cantidad"
            nameKey="estado"
            label={({ estado, porcentaje }) => `${estado}: ${porcentaje}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [`${value} actividades`, name]}
          />
          <Legend
            formatter={(value: string) => {
              const item = data.find((d) => d.estado === value);
              return `${value} (${item?.cantidad ?? 0})`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
