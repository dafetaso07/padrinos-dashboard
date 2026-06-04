import { Actividad } from '../../types';

interface MapaPadrinosProps {
  actividades: Actividad[];
}

interface PadrinoCard {
  nombre: string;
  iniciativas: {
    nombre: string;
    actividades: {
      descripcion: string;
      fecha: string;
      estado: string;
    }[];
  }[];
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' });
}

function getEstadoIndicator(estado: string): string {
  switch (estado) {
    case 'Completada':
      return '✅';
    case 'En ejecución':
      return '🔄';
    case 'Vencida':
      return '🔴';
    case 'Pendiente':
      return '⏳';
    default:
      return '';
  }
}

function buildPadrinoCards(actividades: Actividad[]): PadrinoCard[] {
  const padrinoMap = new Map<string, Map<string, Actividad[]>>();

  for (const a of actividades) {
    if (!padrinoMap.has(a.padrino)) {
      padrinoMap.set(a.padrino, new Map());
    }
    const iniciativaMap = padrinoMap.get(a.padrino)!;
    const key = a.iniciativa || 'General';
    if (!iniciativaMap.has(key)) {
      iniciativaMap.set(key, []);
    }
    iniciativaMap.get(key)!.push(a);
  }

  const cards: PadrinoCard[] = [];
  for (const [nombre, iniciativaMap] of padrinoMap) {
    const iniciativas = [];
    for (const [initNombre, acts] of iniciativaMap) {
      iniciativas.push({
        nombre: initNombre,
        actividades: acts.map((a) => ({
          descripcion: a.actividad,
          fecha: formatDateShort(a.fechaCompromiso),
          estado: a.estado,
        })),
      });
    }
    cards.push({ nombre, iniciativas });
  }

  return cards.sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export function MapaPadrinos({ actividades }: MapaPadrinosProps) {
  const cards = buildPadrinoCards(actividades);

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-gray-500">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Padrinos de proyectos / Iniciativas</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div
            key={card.nombre}
            className="border-2 border-green-600 rounded-lg bg-white shadow-sm flex flex-col"
          >
            {/* Nombre del padrino */}
            <div className="bg-white border-b border-green-600 px-4 py-3 rounded-t-lg">
              <h3 className="text-center font-bold text-gray-800 text-sm">{card.nombre}</h3>
            </div>

            {/* Contenido: iniciativas y actividades */}
            <div className="px-4 py-3 flex-1 space-y-3 text-xs text-gray-700">
              {card.iniciativas.map((ini) => (
                <div key={ini.nombre}>
                  <p className="font-bold text-gray-800 mb-1">{ini.nombre}:</p>
                  <ul className="space-y-0.5">
                    {ini.actividades.map((act, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="shrink-0">{getEstadoIndicator(act.estado)}</span>
                        <span>
                          {act.descripcion}{' '}
                          <span className="font-semibold text-green-700">{act.fecha}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
