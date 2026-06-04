# Dashboard de Seguimiento - Planes de Trabajo de Padrinos

Dashboard web para visualizar el avance de actividades de padrinos, identificar retrasos y retos reportados. Consume datos directamente de Google Sheets.

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- Una hoja de Google Sheets con los datos publicada en la web

## Instalación

```bash
npm install
```

## Configuración de Google Sheets

1. Abre tu hoja de Google Sheets con los datos de actividades
2. Ve a **Archivo → Compartir → Publicar en la web**
3. Selecciona la hoja específica y formato **CSV**
4. Haz clic en "Publicar" y copia el enlace generado

La hoja debe tener las siguientes columnas (primera fila como encabezados):

| Padrino | Área | Actividad | Fecha compromiso | Estado | Porcentaje de avance | Retos | Observaciones |
|---------|------|-----------|-----------------|--------|---------------------|-------|---------------|

Los valores válidos para **Estado** son: `Completada`, `En ejecución`, `Vencida`, `Pendiente`

## Configuración del entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita `.env` y coloca la URL de tu hoja publicada:

```
VITE_GOOGLE_SHEET_URL=https://docs.google.com/spreadsheets/d/TU_SHEET_ID/export?format=csv
```

## Ejecución en desarrollo

```bash
npm run dev
```

Abre http://localhost:5173 en tu navegador.

## Build de producción

```bash
npm run build
```

Los archivos estáticos se generan en la carpeta `dist/`. Puedes servirlos con cualquier servidor web estático.

## Estructura del proyecto

```
src/
├── types/          → Interfaces TypeScript
├── services/       → Conexión a Google Sheets
├── context/        → Estado global (React Context)
├── hooks/          → Hooks de filtrado y KPIs
├── utils/          → Funciones de cálculo
└── components/     → Componentes UI
    ├── Layout/     → Header
    ├── KPIs/       → Tarjetas de indicadores
    ├── Charts/     → Gráficas (Recharts)
    ├── Filters/    → Barra de filtros
    ├── Retos/      → Tabla de retos
    └── common/     → Loading, Error
```

## Stack tecnológico

- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- Recharts (gráficas)
- PapaParse (parsing CSV)
