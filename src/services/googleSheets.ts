import Papa from 'papaparse';
import { Actividad, Estado } from '../types';

const VALID_ESTADOS: Estado[] = ['Completada', 'En ejecución', 'Vencida', 'Pendiente'];

function parseEstado(value: string): Estado {
  const trimmed = value.trim();
  const found = VALID_ESTADOS.find(
    (e) => e.toLowerCase() === trimmed.toLowerCase()
  );
  return found ?? 'Pendiente';
}

function parseFecha(value: string): Date {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return new Date();
  }
  return date;
}

function parseNumber(value: string): number {
  const num = parseFloat(value);
  if (isNaN(num)) return 0;
  return Math.max(0, Math.min(100, num));
}

interface RawRow {
  [key: string]: string;
}

function findColumn(row: RawRow, candidates: string[]): string {
  for (const candidate of candidates) {
    const key = Object.keys(row).find(
      (k) => k.trim().toLowerCase() === candidate.toLowerCase()
    );
    if (key && row[key] !== undefined) return row[key];
  }
  return '';
}

let idCounter = 0;

function generateId(): string {
  idCounter++;
  return `act-${Date.now()}-${idCounter}`;
}

function mapRowToActividad(row: RawRow): Actividad {
  return {
    id: generateId(),
    padrino: findColumn(row, ['Padrino', 'padrino']).trim(),
    area: findColumn(row, ['Área', 'Area', 'área', 'area']).trim(),
    iniciativa: findColumn(row, ['Iniciativa', 'iniciativa']).trim(),
    actividad: findColumn(row, ['Actividad', 'actividad']).trim(),
    fechaCompromiso: parseFecha(
      findColumn(row, ['Fecha compromiso', 'Fecha Compromiso', 'fecha compromiso', 'FechaCompromiso'])
    ),
    estado: parseEstado(
      findColumn(row, ['Estado', 'estado'])
    ),
    porcentajeAvance: parseNumber(
      findColumn(row, ['Porcentaje de avance', 'Porcentaje de Avance', 'porcentaje de avance', '% Avance', 'Avance'])
    ),
    retos: findColumn(row, ['Retos', 'retos', 'Reto']).trim(),
    observaciones: findColumn(row, ['Observaciones', 'observaciones', 'Observación']).trim(),
    avanceUltimoPeriodo: findColumn(row, ['Avance ultimo periodo', 'Avance último periodo', 'Avance Ultimo Periodo']).trim(),
  };
}

export async function fetchActividades(): Promise<Actividad[]> {
  // Intenta primero con URL remota de Google Sheets
  let url = import.meta.env.VITE_GOOGLE_SHEET_URL;

  // Si no hay URL remota o falla, usa el CSV local
  const useLocal = !url || url.trim() === '';

  if (useLocal) {
    url = '/data/actividades.csv';
  } else if (import.meta.env.DEV && url.includes('docs.google.com')) {
    // En desarrollo, usar proxy para evitar CORS
    url = url.replace('https://docs.google.com', '/sheets-proxy');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    let response = await fetch(url, { signal: controller.signal });

    // Si la URL remota falla, intentar con CSV local
    if (!response.ok && !useLocal) {
      clearTimeout(timeoutId);
      console.warn(`Google Sheets no accesible (${response.status}). Cargando CSV local...`);
      response = await fetch('/data/actividades.csv');
    }

    if (!response.ok) {
      throw new Error(
        `Error al obtener datos: ${response.status} ${response.statusText}. ` +
        'Coloca el archivo CSV en public/data/actividades.csv'
      );
    }

    clearTimeout(timeoutId);
    const csvText = await response.text();

    const result = Papa.parse<RawRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
    });

    if (result.errors.length > 0 && result.data.length === 0) {
      throw new Error('Error al parsear los datos CSV');
    }

    const actividades = result.data
      .map(mapRowToActividad)
      .filter((a) => a.padrino !== '' && a.actividad !== '');

    return actividades;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Tiempo de espera agotado (10s). Verifica tu conexión e intenta de nuevo.');
      }
      throw error;
    }
    throw new Error('Error desconocido al obtener los datos');
  }
}
