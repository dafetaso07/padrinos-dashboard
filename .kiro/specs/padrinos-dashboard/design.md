# Documento de Diseño Técnico

## Introducción

Este documento describe la arquitectura técnica del Dashboard de Seguimiento de Planes de Trabajo de Padrinos. Se adopta una arquitectura MVP simple: una SPA (Single Page Application) construida con React + Vite que consume datos de Google Sheets a través de su API pública de CSV/JSON, sin backend propio.

## Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│                    Google Sheets                         │
│              (Fuente de datos publicada)                 │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP GET (CSV/JSON público)
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   SPA (React + Vite)                     │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐   │
│  │ Data Layer  │  │  State Mgmt │  │   UI Layer    │   │
│  │ (fetch +    │──│  (React     │──│  (Components) │   │
│  │  parse CSV) │  │   Context)  │  │               │   │
│  └─────────────┘  └─────────────┘  └───────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Framework UI | React 18 + TypeScript | Ecosistema maduro, componentes reutilizables |
| Build tool | Vite | Rápido en desarrollo, builds optimizados |
| Gráficos | Recharts | Librería declarativa para React, simple |
| Estilos | Tailwind CSS | Utilidades rápidas, sin CSS custom complejo |
| Fuente de datos | Google Sheets (publicado como CSV) | Sin backend, acceso directo |
| Parsing CSV | PapaParse | Robusta, maneja edge cases de CSV |
| Estado | React Context + useReducer | Suficiente para MVP, sin dependencias extra |

## Modelo de Datos

### Interfaz principal: `Actividad`

```typescript
interface Actividad {
  padrino: string;
  area: string;
  actividad: string;
  fechaCompromiso: Date;
  estado: Estado;
  porcentajeAvance: number; // 0-100
  retos: string;
  observaciones: string;
}

type Estado = 'Completada' | 'En ejecución' | 'Vencida' | 'Pendiente';
```

### Interfaz de KPIs calculados

```typescript
interface KPIs {
  totalActividades: number;
  completadas: number;
  enEjecucion: number;
  vencidas: number;
  porcentajeCumplimiento: number; // 0-100, un decimal
}
```

### Estado de filtros

```typescript
interface FiltrosState {
  padrinos: string[];   // valores seleccionados
  areas: string[];      // valores seleccionados
  estados: Estado[];    // valores seleccionados
}
```

## Estructura de Componentes

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Layout principal + providers
├── types/
│   └── index.ts               # Interfaces TypeScript
├── services/
│   └── googleSheets.ts        # Fetch y parsing de datos
├── context/
│   └── DashboardContext.tsx    # Estado global (datos, filtros)
├── hooks/
│   ├── useActividades.ts      # Hook para datos filtrados
│   └── useKPIs.ts             # Hook para cálculo de KPIs
├── components/
│   ├── Layout/
│   │   └── Header.tsx         # Encabezado del dashboard
│   ├── KPIs/
│   │   └── KPICards.tsx       # Tarjetas de indicadores
│   ├── Charts/
│   │   ├── CumplimientoPadrino.tsx  # Gráfica por padrino
│   │   ├── CumplimientoArea.tsx     # Gráfica por área
│   │   └── ActividadesPorEstado.tsx # Gráfica por estado
│   ├── Filters/
│   │   └── FilterBar.tsx      # Barra de filtros
│   ├── Retos/
│   │   └── RetosSection.tsx   # Tabla de retos
│   └── common/
│       ├── LoadingSpinner.tsx  # Indicador de carga
│       └── ErrorMessage.tsx   # Mensaje de error
└── utils/
    └── calculations.ts        # Funciones de cálculo puras
```

## Flujo de Datos

```
1. App se monta
   └── DashboardContext llama a googleSheets.fetchData()
       └── Fetch HTTP al CSV público de Google Sheets
           └── PapaParse convierte CSV → Array<Actividad>
               └── Estado se actualiza con los datos

2. Usuario aplica filtro
   └── FiltrosState se actualiza en el Context
       └── useActividades() recalcula datos filtrados
           └── useKPIs() recalcula indicadores
               └── Componentes se re-renderizan
```

## Diseño de Componentes Clave

### 1. Servicio de datos (`services/googleSheets.ts`)

```typescript
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv';

export async function fetchActividades(): Promise<Actividad[]> {
  // 1. Fetch con timeout de 10 segundos
  // 2. Parse CSV con PapaParse
  // 3. Mapear filas a interface Actividad
  // 4. Validar campos requeridos
  // Throws en caso de error de red o parsing
}
```

**Conexión con Google Sheets:**
- La hoja debe publicarse como "Publicar en la web" (Archivo > Compartir > Publicar en la web)
- Se accede al endpoint de exportación CSV público — no requiere autenticación ni API key
- Timeout configurable (default: 10s)

### 2. Context y estado (`context/DashboardContext.tsx`)

```typescript
interface DashboardState {
  actividades: Actividad[];
  filtros: FiltrosState;
  loading: boolean;
  error: string | null;
}

type DashboardAction =
  | { type: 'SET_DATA'; payload: Actividad[] }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FILTRO_PADRINO'; payload: string[] }
  | { type: 'SET_FILTRO_AREA'; payload: string[] }
  | { type: 'SET_FILTRO_ESTADO'; payload: Estado[] }
  | { type: 'CLEAR_FILTROS' };
```

### 3. Hook de cálculos (`hooks/useKPIs.ts`)

```typescript
export function useKPIs(actividades: Actividad[]): KPIs {
  return useMemo(() => {
    const total = actividades.length;
    const completadas = actividades.filter(a => a.estado === 'Completada').length;
    const enEjecucion = actividades.filter(a => a.estado === 'En ejecución').length;
    const vencidas = actividades.filter(a => a.estado === 'Vencida').length;
    const porcentaje = total > 0 
      ? Math.round((completadas / total) * 1000) / 10 
      : 0;
    return { totalActividades: total, completadas, enEjecucion, vencidas, porcentajeCumplimiento: porcentaje };
  }, [actividades]);
}
```

### 4. Visualizaciones

| Visualización | Tipo de gráfico | Librería |
|--------------|----------------|----------|
| Cumplimiento por padrino | Barra horizontal | Recharts `<BarChart>` |
| Cumplimiento por área | Barra horizontal | Recharts `<BarChart>` |
| Actividades por estado | Gráfico de dona | Recharts `<PieChart>` |

**Colores por estado:**
- Completada: `#10B981` (verde)
- En ejecución: `#3B82F6` (azul)
- Vencida: `#EF4444` (rojo)
- Pendiente: `#F59E0B` (amarillo)

### 5. Filtros (`components/Filters/FilterBar.tsx`)

- Cada filtro es un dropdown multi-select
- Los valores disponibles se extraen dinámicamente de los datos cargados
- Ordenamiento alfabético
- Indicador visual cuando hay filtros activos (badge con conteo)
- Botón "Limpiar filtros" visible cuando hay filtros activos

### 6. Sección de Retos (`components/Retos/RetosSection.tsx`)

- Tabla con columnas: Padrino | Actividad | Estado | Reto
- Header con badge mostrando conteo total de retos
- Ordenada alfabéticamente por Padrino
- Mensaje vacío cuando no hay retos
- Respeta los filtros globales activos

## Layout del Dashboard

```
┌────────────────────────────────────────────────────────────┐
│  Header: "Dashboard de Seguimiento - Planes de Trabajo"    │
├────────────────────────────────────────────────────────────┤
│  [Filtro Padrino ▼] [Filtro Área ▼] [Filtro Estado ▼]     │
├────────────────────────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐        │
│  │Total │ │Compl.│ │Ejec. │ │Venc. │ │% Cumpl.  │        │
│  │  24  │ │  12  │ │   8  │ │   4  │ │  50.0%   │        │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────────┘        │
├────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐ ┌─────────────────────────┐  │
│  │ Cumplimiento x Padrino  │ │  Cumplimiento x Área    │  │
│  │ (Barra horizontal)      │ │  (Barra horizontal)     │  │
│  └─────────────────────────┘ └─────────────────────────┘  │
├────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐ ┌─────────────────────────┐  │
│  │ Actividades por Estado  │ │   Sección de Retos      │  │
│  │ (Gráfico dona)          │ │   (Tabla)               │  │
│  └─────────────────────────┘ └─────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

## Configuración de Google Sheets

Para que el dashboard funcione, el usuario debe:

1. Abrir la hoja de Google Sheets con los datos
2. Ir a Archivo > Compartir > Publicar en la web
3. Seleccionar la hoja específica y formato CSV
4. Copiar el enlace generado
5. Configurar ese enlace en una variable de entorno `VITE_GOOGLE_SHEET_URL`

**Formato esperado de la hoja:**

| Padrino | Área | Actividad | Fecha compromiso | Estado | Porcentaje de avance | Retos | Observaciones |
|---------|------|-----------|-----------------|--------|---------------------|-------|---------------|
| Juan Pérez | Tecnología | Migrar BD | 2025-03-15 | Completada | 100 | | Sin novedad |

## Manejo de Errores

| Escenario | Comportamiento |
|-----------|---------------|
| Red no disponible | Mostrar mensaje de error, conservar datos previos si existen |
| Timeout (>10s) | Abortar fetch, mostrar error con opción de reintentar |
| CSV malformado | Mostrar error de parsing, no renderizar datos parciales |
| Hoja vacía | Mostrar KPIs en 0, visualizaciones vacías |
| Filtros sin resultados | KPIs en 0, mensaje "No hay datos para los filtros seleccionados" |

## Decisiones Técnicas MVP

1. **Sin backend**: Los datos se leen directamente del CSV público de Google Sheets desde el navegador
2. **Sin autenticación**: La hoja debe estar publicada públicamente (solo lectura)
3. **Sin cache persistente**: Datos frescos en cada carga de página
4. **Sin tiempo real**: El usuario recarga manualmente para obtener datos actualizados
5. **React Context sobre Redux/Zustand**: Suficiente para la complejidad del MVP
6. **Recharts sobre Chart.js/D3**: API declarativa más natural en React, menor curva de aprendizaje

## Requisitos Cubiertos

| Requisito | Componentes de diseño |
|-----------|----------------------|
| R1: Conexión datos | `services/googleSheets.ts`, `DashboardContext` |
| R2: KPIs | `hooks/useKPIs.ts`, `KPICards.tsx` |
| R3: Cumplimiento padrino | `CumplimientoPadrino.tsx`, `calculations.ts` |
| R4: Cumplimiento área | `CumplimientoArea.tsx`, `calculations.ts` |
| R5: Actividades por estado | `ActividadesPorEstado.tsx` |
| R6: Filtros | `FilterBar.tsx`, `DashboardContext` |
| R7: Sección retos | `RetosSection.tsx` |
| R8: Arquitectura MVP | Stack completo (React+Vite, static deploy) |
