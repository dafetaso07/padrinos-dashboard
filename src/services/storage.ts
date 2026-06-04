import { Actividad, Estado } from '../types';

const STORAGE_KEY = 'padrinos-actividades';

export function saveActividades(actividades: Actividad[]): void {
  const serialized = actividades.map((a) => ({
    ...a,
    fechaCompromiso: a.fechaCompromiso.toISOString(),
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
}

export function loadActividades(): Actividad[] | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return parsed.map((a: Record<string, unknown>) => ({
      ...a,
      fechaCompromiso: new Date(a.fechaCompromiso as string),
      estado: a.estado as Estado,
      porcentajeAvance: Number(a.porcentajeAvance),
    })) as Actividad[];
  } catch {
    return null;
  }
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function generateId(): string {
  return `act-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
