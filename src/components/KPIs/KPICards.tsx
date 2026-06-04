import { KPIs } from '../../types';

interface KPICardsProps {
  kpis: KPIs;
}

interface KPICardData {
  title: string;
  value: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

export function KPICards({ kpis }: KPICardsProps) {
  const cards: KPICardData[] = [
    {
      title: 'Total Actividades',
      value: String(kpis.totalActividades),
      icon: '📋',
      bgColor: 'bg-gray-50 border-gray-200',
      textColor: 'text-gray-800',
    },
    {
      title: 'Completadas',
      value: String(kpis.completadas),
      icon: '✅',
      bgColor: 'bg-green-50 border-green-200',
      textColor: 'text-green-800',
    },
    {
      title: 'En Ejecución',
      value: String(kpis.enEjecucion),
      icon: '🔄',
      bgColor: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-800',
    },
    {
      title: 'Vencidas',
      value: String(kpis.vencidas),
      icon: '🚨',
      bgColor: 'bg-red-50 border-red-200',
      textColor: 'text-red-800',
    },
    {
      title: '% Cumplimiento',
      value: `${kpis.porcentajeCumplimiento.toFixed(1)}%`,
      icon: '📊',
      bgColor: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-800',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.bgColor} border rounded-xl p-4 flex flex-col items-center gap-2`}
        >
          <span className="text-2xl">{card.icon}</span>
          <span className={`text-2xl font-bold ${card.textColor}`}>{card.value}</span>
          <span className="text-xs text-gray-600 text-center">{card.title}</span>
        </div>
      ))}
    </div>
  );
}
