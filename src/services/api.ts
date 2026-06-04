import { Actividad, Estado } from '../types';

const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : '';

export async function fetchActividadesAPI(): Promise<Actividad[]> {
  const response = await fetch(`${API_BASE}/api/actividades`);
  if (!response.ok) {
    throw new Error(`Error al obtener datos: ${response.status}`);
  }
  const data = await response.json();

  // Parsear fechas de vuelta a objetos Date
  return data.map((a: Record<string, unknown>) => ({
    ...a,
    fechaCompromiso: new Date(a.fechaCompromiso as string),
    estado: a.estado as Estado,
    porcentajeAvance: Number(a.porcentajeAvance),
  })) as Actividad[];
}

export async function saveActividadesAPI(actividades: Actividad[]): Promise<void> {
  const response = await fetch(`${API_BASE}/api/actividades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(actividades),
  });
  if (!response.ok) {
    throw new Error(`Error al guardar: ${response.status}`);
  }
}
