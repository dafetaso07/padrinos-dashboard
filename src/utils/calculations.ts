import { Actividad, CumplimientoItem, EstadoDistribucion, Estado } from '../types';

const ESTADO_COLORS: Record<Estado, string> = {
  'Completada': '#10B981',
  'En ejecución': '#3B82F6',
  'Vencida': '#EF4444',
  'Pendiente': '#F59E0B',
};

export function calcularCumplimientoPorPadrino(actividades: Actividad[]): CumplimientoItem[] {
  const groups = new Map<string, { total: number; completadas: number }>();

  for (const a of actividades) {
    const current = groups.get(a.padrino) ?? { total: 0, completadas: 0 };
    current.total++;
    if (a.estado === 'Completada') current.completadas++;
    groups.set(a.padrino, current);
  }

  const result: CumplimientoItem[] = [];
  for (const [nombre, data] of groups) {
    const porcentaje = data.total > 0 ? Math.round((data.completadas / data.total) * 100) : 0;
    result.push({ nombre, porcentaje });
  }

  return result.sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export function calcularCumplimientoPorArea(actividades: Actividad[]): CumplimientoItem[] {
  const groups = new Map<string, { total: number; completadas: number }>();

  for (const a of actividades) {
    const current = groups.get(a.area) ?? { total: 0, completadas: 0 };
    current.total++;
    if (a.estado === 'Completada') current.completadas++;
    groups.set(a.area, current);
  }

  const result: CumplimientoItem[] = [];
  for (const [nombre, data] of groups) {
    if (data.total === 0) continue;
    const porcentaje = Math.round((data.completadas / data.total) * 100);
    result.push({ nombre, porcentaje });
  }

  return result.sort((a, b) => b.porcentaje - a.porcentaje);
}

export function calcularActividadesPorEstado(actividades: Actividad[]): EstadoDistribucion[] {
  const total = actividades.length;
  const estados: Estado[] = ['Completada', 'En ejecución', 'Vencida', 'Pendiente'];

  return estados.map((estado) => {
    const cantidad = actividades.filter((a) => a.estado === estado).length;
    const porcentaje = total > 0 ? Math.round((cantidad / total) * 1000) / 10 : 0;
    return {
      estado,
      cantidad,
      porcentaje,
      color: ESTADO_COLORS[estado],
    };
  });
}

export function calcularCumplimientoPorIniciativa(actividades: Actividad[]): CumplimientoItem[] {
  const groups = new Map<string, { total: number; completadas: number }>();

  for (const a of actividades) {
    const key = a.iniciativa || 'Sin iniciativa';
    const current = groups.get(key) ?? { total: 0, completadas: 0 };
    current.total++;
    if (a.estado === 'Completada') current.completadas++;
    groups.set(key, current);
  }

  const result: CumplimientoItem[] = [];
  for (const [nombre, data] of groups) {
    if (data.total === 0) continue;
    const porcentaje = Math.round((data.completadas / data.total) * 100);
    result.push({ nombre, porcentaje });
  }

  return result.sort((a, b) => b.porcentaje - a.porcentaje);
}
