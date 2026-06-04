import { useMemo } from 'react';
import { Actividad, FiltrosState } from '../types';

export function useActividades(actividades: Actividad[], filtros: FiltrosState): Actividad[] {
  return useMemo(() => {
    let filtered = actividades;

    if (filtros.padrinos.length > 0) {
      filtered = filtered.filter((a) => filtros.padrinos.includes(a.padrino));
    }

    if (filtros.areas.length > 0) {
      filtered = filtered.filter((a) => filtros.areas.includes(a.area));
    }

    if (filtros.estados.length > 0) {
      filtered = filtered.filter((a) => filtros.estados.includes(a.estado));
    }

    if (filtros.iniciativas.length > 0) {
      filtered = filtered.filter((a) => filtros.iniciativas.includes(a.iniciativa));
    }

    return filtered;
  }, [actividades, filtros]);
}
