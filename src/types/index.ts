export type Estado = 'Completada' | 'En ejecución' | 'Vencida' | 'Pendiente';

export interface Actividad {
  id: string;
  padrino: string;
  area: string;
  iniciativa: string;
  actividad: string;
  fechaCompromiso: Date;
  estado: Estado;
  porcentajeAvance: number;
  retos: string;
  observaciones: string;
  avanceUltimoPeriodo: string;
}

export interface KPIs {
  totalActividades: number;
  completadas: number;
  enEjecucion: number;
  vencidas: number;
  porcentajeCumplimiento: number;
}

export interface FiltrosState {
  padrinos: string[];
  areas: string[];
  estados: Estado[];
  iniciativas: string[];
}

export interface DashboardState {
  actividades: Actividad[];
  filtros: FiltrosState;
  loading: boolean;
  error: string | null;
}

export type DashboardAction =
  | { type: 'SET_DATA'; payload: Actividad[] }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FILTRO_PADRINO'; payload: string[] }
  | { type: 'SET_FILTRO_AREA'; payload: string[] }
  | { type: 'SET_FILTRO_ESTADO'; payload: Estado[] }
  | { type: 'CLEAR_FILTROS' };

export interface CumplimientoItem {
  nombre: string;
  porcentaje: number;
}

export interface EstadoDistribucion {
  estado: Estado;
  cantidad: number;
  porcentaje: number;
  color: string;
}
