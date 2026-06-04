import { useMemo } from 'react';
import { Actividad, KPIs } from '../types';

export function useKPIs(actividades: Actividad[]): KPIs {
  return useMemo(() => {
    const total = actividades.length;

    if (total === 0) {
      return {
        totalActividades: 0,
        completadas: 0,
        enEjecucion: 0,
        vencidas: 0,
        porcentajeCumplimiento: 0,
      };
    }

    const completadas = actividades.filter((a) => a.estado === 'Completada').length;
    const enEjecucion = actividades.filter((a) => a.estado === 'En ejecución').length;
    const vencidas = actividades.filter((a) => a.estado === 'Vencida').length;
    const porcentajeCumplimiento = Math.round((completadas / total) * 1000) / 10;

    return {
      totalActividades: total,
      completadas,
      enEjecucion,
      vencidas,
      porcentajeCumplimiento,
    };
  }, [actividades]);
}
