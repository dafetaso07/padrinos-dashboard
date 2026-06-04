import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CumplimientoItem } from '../../types';

interface CumplimientoAreaProps {
  data: CumplimientoItem[];
}

export function CumplimientoArea({ data }: CumplimientoAreaProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cumplimiento por Área</h3>
        <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
      </div>
    );
  }

  const chartHeight = Math.max(250, data.length * 45);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Cumplimiento por Área</h3>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} unit="%" />
          <YAxis type="category" dataKey="nombre" width={75} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value: number) => [`${value}%`, 'Cumplimiento']} />
          <Bar dataKey="porcentaje" fill="#10B981" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
