import { Actividad, Estado } from '../types';

// URL del Apps Script desplegado (se configura en .env)
const API_URL = import.meta.env.VITE_API_URL || '';

export async function fetchActividadesAPI(): Promise<Actividad[]> {
  if (!API_URL) {
    throw new Error('No se ha configurado VITE_API_URL en el archivo .env');
  }

  const response = await fetch(`${API_URL}?action=getAll`, {
    credentials: 'include',
    redirect: 'follow',
  });
  if (!response.ok) {
    throw new Error(`Error al obtener datos: ${response.status}`);
  }
  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.map((a: Record<string, unknown>) => ({
    ...a,
    fechaCompromiso: new Date(a.fechaCompromiso as string),
    estado: (a.estado || 'Pendiente') as Estado,
    porcentajeAvance: Number(a.porcentajeAvance) || 0,
  })) as Actividad[];
}

export async function saveActividadesAPI(actividades: Actividad[]): Promise<void> {
  if (!API_URL) return;

  const response = await fetch(`${API_URL}?action=save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(actividades),
    credentials: 'include',
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Error al guardar: ${response.status}`);
  }
}

export async function addActividadAPI(actividad: Actividad): Promise<void> {
  if (!API_URL) return;

  await fetch(`${API_URL}?action=add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(actividad),
    credentials: 'include',
    redirect: 'follow',
  });
}

export async function updateActividadAPI(actividad: Actividad): Promise<void> {
  if (!API_URL) return;

  await fetch(`${API_URL}?action=update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(actividad),
    credentials: 'include',
    redirect: 'follow',
  });
}

export async function deleteActividadAPI(id: string): Promise<void> {
  if (!API_URL) return;

  await fetch(`${API_URL}?action=delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
    credentials: 'include',
    redirect: 'follow',
  });
}
