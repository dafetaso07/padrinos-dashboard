# Tareas de Implementación

## Tarea 1: Inicializar proyecto con Vite + React + TypeScript

**Requisitos cubiertos:** R8 (Arquitectura MVP)

**Instrucciones:**
1. Crear proyecto con `npm create vite@latest` usando template `react-ts`
2. Instalar dependencias: `recharts`, `papaparse`, `@types/papaparse`, `tailwindcss`, `@tailwindcss/vite`
3. Configurar Tailwind CSS con el plugin de Vite
4. Crear archivo `.env.example` con `VITE_GOOGLE_SHEET_URL=`
5. Configurar estructura de carpetas: `src/types/`, `src/services/`, `src/context/`, `src/hooks/`, `src/components/`, `src/utils/`
6. Verificar que `npm run dev` inicia correctamente

**Archivos a crear/modificar:**
- `package.json`
- `vite.config.ts`
- `src/main.tsx` (actualizar con import de CSS)
- `src/index.css` (Tailwind directives)
- `.env.example`
- Carpetas de estructura

- [x] Completada

---

## Tarea 2: Definir tipos TypeScript e interfaces

**Requisitos cubiertos:** R1, R2 (Modelo de datos)

**Instrucciones:**
1. Crear `src/types/index.ts` con las interfaces:
   - `Actividad` (padrino, area, actividad, fechaCompromiso, estado, porcentajeAvance, retos, observaciones)
   - `Estado` type literal ('Completada' | 'En ejecución' | 'Vencida' | 'Pendiente')
   - `KPIs` (totalActividades, completadas, enEjecucion, vencidas, porcentajeCumplimiento)
   - `FiltrosState` (padrinos: string[], areas: string[], estados: Estado[])
   - `DashboardState` (actividades, filtros, loading, error)
   - `DashboardAction` discriminated union para el reducer

**Archivos a crear:**
- `src/types/index.ts`

- [x] Completada

---

## Tarea 3: Implementar servicio de conexión a Google Sheets

**Requisitos cubiertos:** R1 (Conexión con fuente de datos)

**Instrucciones:**
1. Crear `src/services/googleSheets.ts`
2. Implementar `fetchActividades()`:
   - Leer URL de `import.meta.env.VITE_GOOGLE_SHEET_URL`
   - Hacer fetch con AbortController y timeout de 10 segundos
   - Parsear CSV con PapaParse (header: true, skipEmptyLines: true)
   - Mapear cada fila a la interface `Actividad`:
     - `fechaCompromiso` → parsear string a Date
     - `porcentajeAvance` → parsear a number, validar 0-100
     - `estado` → validar que sea un valor de tipo Estado
     - `retos` y `observaciones` → trim, permitir vacío
   - En caso de error de red o timeout, lanzar error descriptivo
3. Exportar la función

**Archivos a crear:**
- `src/services/googleSheets.ts`

- [x] Completada

---

## Tarea 4: Implementar Context y estado global

**Requisitos cubiertos:** R1, R6 (Estado, filtros)

**Instrucciones:**
1. Crear `src/context/DashboardContext.tsx`
2. Implementar reducer con acciones: SET_DATA, SET_ERROR, SET_LOADING, SET_FILTRO_PADRINO, SET_FILTRO_AREA, SET_FILTRO_ESTADO, CLEAR_FILTROS
3. Crear `DashboardProvider` que:
   - Inicializa estado con loading: true
   - Llama a `fetchActividades()` en useEffect al montar
   - Despacha SET_DATA o SET_ERROR según resultado
4. Crear hook `useDashboard()` que retorna state y dispatch
5. Exportar provider y hook

**Archivos a crear:**
- `src/context/DashboardContext.tsx`

- [x] Completada

---

## Tarea 5: Implementar hooks de datos filtrados y KPIs

**Requisitos cubiertos:** R2, R6 (Cálculos, filtrado)

**Instrucciones:**
1. Crear `src/hooks/useActividades.ts`:
   - Recibe actividades y filtros del context
   - Filtra por padrinos seleccionados (si hay alguno)
   - Filtra por áreas seleccionadas (si hay alguna)
   - Filtra por estados seleccionados (si hay alguno)
   - Aplica intersección de todos los filtros activos
   - Retorna array filtrado memorizado con useMemo
2. Crear `src/hooks/useKPIs.ts`:
   - Recibe array de actividades (ya filtradas)
   - Calcula: total, completadas, enEjecucion, vencidas
   - Calcula porcentajeCumplimiento redondeado a 1 decimal
   - Si total es 0, retorna todo en 0
   - Retorna objeto KPIs memorizado con useMemo
3. Crear `src/utils/calculations.ts`:
   - `calcularCumplimientoPorPadrino(actividades)` → array de {padrino, porcentaje}
   - `calcularCumplimientoPorArea(actividades)` → array de {area, porcentaje}, ordenado desc, excluyendo áreas sin actividades
   - `calcularActividadesPorEstado(actividades)` → array de {estado, cantidad, porcentaje, color}

**Archivos a crear:**
- `src/hooks/useActividades.ts`
- `src/hooks/useKPIs.ts`
- `src/utils/calculations.ts`

- [x] Completada

---

## Tarea 6: Implementar componentes comunes (Loading, Error)

**Requisitos cubiertos:** R1 (Indicador de carga, mensaje de error)

**Instrucciones:**
1. Crear `src/components/common/LoadingSpinner.tsx`:
   - Spinner centrado con texto "Cargando datos..."
   - Estilizado con Tailwind (animate-spin)
2. Crear `src/components/common/ErrorMessage.tsx`:
   - Props: message (string)
   - Muestra icono de error + mensaje descriptivo
   - Botón "Reintentar" que recarga la página
   - Estilo con fondo rojo claro, texto rojo

**Archivos a crear:**
- `src/components/common/LoadingSpinner.tsx`
- `src/components/common/ErrorMessage.tsx`

- [x] Completada

---

## Tarea 7: Implementar componente KPICards

**Requisitos cubiertos:** R2 (Indicadores clave)

**Instrucciones:**
1. Crear `src/components/KPIs/KPICards.tsx`
2. Mostrar 5 tarjetas en fila (grid responsive):
   - Total actividades (icono genérico, fondo gris)
   - Completadas (icono check, fondo verde claro)
   - En ejecución (icono reloj, fondo azul claro)
   - Vencidas (icono alerta, fondo rojo claro)
   - % Cumplimiento (icono gráfico, fondo morado claro)
3. Cada tarjeta: título, valor numérico grande, icono decorativo
4. El % de cumplimiento se muestra con 1 decimal seguido de "%"
5. Usar hook useKPIs para obtener los valores

**Archivos a crear:**
- `src/components/KPIs/KPICards.tsx`

- [x] Completada

---

## Tarea 8: Implementar gráficas de cumplimiento

**Requisitos cubiertos:** R3, R4 (Cumplimiento por padrino y por área)

**Instrucciones:**
1. Crear `src/components/Charts/CumplimientoPadrino.tsx`:
   - Usar Recharts `<BarChart>` con layout="vertical" (barras horizontales)
   - Eje Y: nombre del padrino
   - Eje X: porcentaje (0-100)
   - Color de barra: azul (#3B82F6)
   - Tooltip con valor exacto
   - Usar calcularCumplimientoPorPadrino()
2. Crear `src/components/Charts/CumplimientoArea.tsx`:
   - Mismo patrón de barra horizontal
   - Datos ordenados de mayor a menor porcentaje
   - Color de barra: verde (#10B981)
   - Usar calcularCumplimientoPorArea()
3. Ambos componentes con título, contenedor con borde redondeado y sombra

**Archivos a crear:**
- `src/components/Charts/CumplimientoPadrino.tsx`
- `src/components/Charts/CumplimientoArea.tsx`

- [x] Completada

---

## Tarea 9: Implementar gráfica de actividades por estado

**Requisitos cubiertos:** R5 (Distribución por estado)

**Instrucciones:**
1. Crear `src/components/Charts/ActividadesPorEstado.tsx`
2. Usar Recharts `<PieChart>` con `<Pie>` tipo dona (innerRadius)
3. Colores por estado:
   - Completada: #10B981 (verde)
   - En ejecución: #3B82F6 (azul)
   - Vencida: #EF4444 (rojo)
   - Pendiente: #F59E0B (amarillo)
4. Mostrar leyenda con cantidad y porcentaje por estado
5. Tooltip con detalle al hover
6. Si un estado tiene 0 actividades, incluirlo con valor 0
7. Usar calcularActividadesPorEstado()
8. Contenedor con título, borde redondeado y sombra

**Archivos a crear:**
- `src/components/Charts/ActividadesPorEstado.tsx`

- [x] Completada

---

## Tarea 10: Implementar barra de filtros

**Requisitos cubiertos:** R6 (Filtros interactivos)

**Instrucciones:**
1. Crear `src/components/Filters/FilterBar.tsx`
2. Implementar 3 dropdowns multi-select:
   - Filtro Padrino: lista alfabética de padrinos únicos
   - Filtro Área: lista alfabética de áreas únicas
   - Filtro Estado: valores fijos (Completada, En ejecución, Vencida, Pendiente)
3. Cada dropdown:
   - Checkboxes para selección múltiple
   - Botón que muestra "Padrino (2)" cuando hay 2 seleccionados
   - Se abre/cierra al hacer click
   - Se cierra al hacer click fuera
4. Botón "Limpiar filtros" visible cuando hay algún filtro activo
5. Indicador visual (badge/punto) en filtros con valores seleccionados
6. Despachar acciones SET_FILTRO_* al context al cambiar selección

**Archivos a crear:**
- `src/components/Filters/FilterBar.tsx`

- [x] Completada

---

## Tarea 11: Implementar sección de retos

**Requisitos cubiertos:** R7 (Sección de retos)

**Instrucciones:**
1. Crear `src/components/Retos/RetosSection.tsx`
2. Header con título "Retos Reportados" y badge con conteo total
3. Tabla con columnas: Padrino | Actividad | Estado | Reto
4. Filtrar actividades que tengan campo retos no vacío (trim)
5. Ordenar alfabéticamente por nombre de padrino
6. Respetar filtros globales activos
7. Si no hay retos: mostrar mensaje "No se encontraron actividades con retos"
8. Estilizar tabla con zebra striping (filas alternas)
9. Badge de estado con color correspondiente en cada fila

**Archivos a crear:**
- `src/components/Retos/RetosSection.tsx`

- [x] Completada

---

## Tarea 12: Implementar layout principal y Header

**Requisitos cubiertos:** R8 (Arquitectura MVP)

**Instrucciones:**
1. Crear `src/components/Layout/Header.tsx`:
   - Título: "Dashboard de Seguimiento - Planes de Trabajo de Padrinos"
   - Fondo azul oscuro, texto blanco
   - Logo o icono opcional
2. Actualizar `src/App.tsx`:
   - Envolver con DashboardProvider
   - Layout: Header → FilterBar → KPICards → Gráficas (grid 2 cols) → Retos
   - Manejar estados: loading → LoadingSpinner, error → ErrorMessage
   - Grid responsivo: 1 columna en pantallas medianas, 2 en grandes
   - Fondo gris claro general
   - Padding y gaps consistentes
3. Viewport mínimo: 1024px funcional

**Archivos a crear/modificar:**
- `src/components/Layout/Header.tsx`
- `src/App.tsx`

- [x] Completada

---

## Tarea 13: Configuración final y documentación

**Requisitos cubiertos:** R1, R8 (Despliegue y configuración)

**Instrucciones:**
1. Crear `README.md` con:
   - Descripción del proyecto
   - Requisitos previos (Node.js 18+)
   - Instrucciones de instalación (`npm install`)
   - Cómo configurar Google Sheets (publicar como web, copiar URL)
   - Cómo configurar `.env` con `VITE_GOOGLE_SHEET_URL`
   - Cómo ejecutar en desarrollo (`npm run dev`)
   - Cómo hacer build de producción (`npm run build`)
2. Crear `.env.example` con la variable documentada
3. Agregar `.env` al `.gitignore`
4. Verificar que `npm run build` genera el bundle sin errores

**Archivos a crear/modificar:**
- `README.md`
- `.env.example`
- `.gitignore`

- [x] Completada
