import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CumplimientoItem } from '../../types';

interface CumplimientoIniciativaProps {
  data: CumplimientoItem[];
}

export function CumplimientoIniciativa({ data }: CumplimientoIniciativaProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cumplimiento por Iniciativa</h3>
        <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
      </div>
    );
  }

  const chartHeight = Math.max(250, data.length * 45);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Cumplimiento por Iniciativa</h3>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} unit="%" />
          <YAxis type="category" dataKey="nombre" width={95} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(value: number) => [`${value}%`, 'Cumplimiento']} />
          <Bar dataKey="porcentaje" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
