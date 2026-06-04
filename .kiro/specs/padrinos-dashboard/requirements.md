# Documento de Requisitos

## Introducción

Dashboard de Seguimiento de Planes de Trabajo de Padrinos. Este sistema proporciona visibilidad del progreso de las actividades de los padrinos, permitiendo identificar retrasos, riesgos y retos reportados. Los datos se obtienen de Google Sheets y se presentan a través de indicadores clave, visualizaciones y filtros interactivos.

## Glosario

- **Dashboard**: Interfaz web que muestra indicadores, visualizaciones y filtros para el seguimiento de actividades de padrinos.
- **Padrino**: Persona responsable de ejecutar actividades dentro de un plan de trabajo.
- **Área**: Departamento o división organizacional a la que pertenece una actividad.
- **Actividad**: Tarea específica dentro del plan de trabajo de un padrino con fecha de compromiso y estado asociado.
- **Estado**: Clasificación del progreso de una actividad (Completada, En ejecución, Vencida, Pendiente).
- **Porcentaje_de_Avance**: Valor numérico entre 0 y 100 que indica el progreso de una actividad.
- **Reto**: Obstáculo o desafío reportado por un padrino en relación con una actividad.
- **Fuente_de_Datos**: Hoja de cálculo de Google Sheets que contiene los registros de actividades de los padrinos.
- **KPI**: Indicador clave de desempeño que resume el estado general de las actividades.
- **Filtro**: Control interactivo que permite al usuario restringir los datos mostrados en el Dashboard según criterios específicos.

## Requisitos

### Requisito 1: Conexión con fuente de datos

**Historia de Usuario:** Como usuario del Dashboard, quiero que el sistema obtenga los datos desde Google Sheets, para que la información mostrada refleje el estado actual de los planes de trabajo.

#### Criterios de Aceptación

1. WHEN el Dashboard se carga, THE Fuente_de_Datos SHALL proporcionar los registros de actividades con los campos: Padrino, Área, Actividad, Fecha compromiso (formato fecha), Estado, Porcentaje_de_Avance (valor numérico entre 0 y 100), Retos y Observaciones, en un tiempo máximo de 10 segundos.
2. IF la conexión con Google Sheets no responde en un plazo de 10 segundos o devuelve un error, THEN THE Dashboard SHALL mostrar un mensaje de error indicando que no se pudieron cargar los datos y conservar los últimos datos cargados previamente si los hubiera.
3. WHEN el usuario recarga el Dashboard, THE Fuente_de_Datos SHALL obtener los datos más recientes de la hoja de cálculo y actualizar la vista en un tiempo máximo de 10 segundos.
4. WHILE el Dashboard está obteniendo los datos de Google Sheets, THE Dashboard SHALL mostrar un indicador de carga visible al usuario.

### Requisito 2: Indicadores clave de desempeño (KPIs)

**Historia de Usuario:** Como usuario del Dashboard, quiero ver indicadores resumidos de las actividades, para tener una visión rápida del estado general de los planes de trabajo.

#### Criterios de Aceptación

1. THE Dashboard SHALL mostrar el total de actividades registradas como un KPI numérico con valor entero mayor o igual a 0.
2. THE Dashboard SHALL mostrar la cantidad de actividades con Estado "Completada" como un KPI numérico con valor entero mayor o igual a 0.
3. THE Dashboard SHALL mostrar la cantidad de actividades con Estado "En ejecución" como un KPI numérico con valor entero mayor o igual a 0.
4. THE Dashboard SHALL mostrar la cantidad de actividades con Estado "Vencida" como un KPI numérico con valor entero mayor o igual a 0.
5. WHEN los datos se cargan, THE Dashboard SHALL calcular el porcentaje de cumplimiento como la proporción de actividades completadas sobre el total de actividades, expresado como porcentaje redondeado a un decimal (ejemplo: 75.0%).
6. IF el total de actividades es cero, THEN THE Dashboard SHALL mostrar el porcentaje de cumplimiento como 0% y los KPIs numéricos como 0.

### Requisito 3: Visualización de cumplimiento por padrino

**Historia de Usuario:** Como usuario del Dashboard, quiero ver el nivel de cumplimiento de cada padrino, para identificar quiénes están al día y quiénes presentan retrasos.

#### Criterios de Aceptación

1. THE Dashboard SHALL mostrar una visualización gráfica que presente el porcentaje de cumplimiento de cada Padrino, expresado como valor entero entre 0 y 100.
2. WHEN los datos se cargan, THE Dashboard SHALL calcular el cumplimiento de cada Padrino como la cantidad de actividades con Estado "Completada" dividida entre el total de actividades asignadas a ese Padrino, multiplicado por 100.
3. IF un Padrino no tiene actividades asignadas, THEN THE Dashboard SHALL mostrar un cumplimiento de 0% para ese Padrino.
4. WHEN los Filtros están activos, THE Dashboard SHALL recalcular y actualizar la visualización de cumplimiento por Padrino considerando únicamente las actividades que coincidan con los filtros aplicados.

### Requisito 4: Visualización de cumplimiento por área

**Historia de Usuario:** Como usuario del Dashboard, quiero ver el nivel de cumplimiento por área, para identificar qué departamentos tienen mayor o menor avance.

#### Criterios de Aceptación

1. THE Dashboard SHALL mostrar una visualización gráfica que presente el porcentaje de cumplimiento agrupado por cada Área, expresado como valor entero entre 0 y 100.
2. WHEN los datos se cargan, THE Dashboard SHALL calcular el cumplimiento de cada Área como la proporción de actividades con Estado "Completada" sobre el total de actividades asignadas a esa Área, expresado como porcentaje.
3. IF un Área no tiene actividades asignadas, THEN THE Dashboard SHALL excluir esa Área de la visualización de cumplimiento por área.
4. THE Dashboard SHALL ordenar las Áreas en la visualización de mayor a menor porcentaje de cumplimiento.

### Requisito 5: Visualización de actividades por estado

**Historia de Usuario:** Como usuario del Dashboard, quiero ver la distribución de actividades según su estado, para entender la proporción de actividades completadas, en ejecución y vencidas.

#### Criterios de Aceptación

1. THE Dashboard SHALL mostrar una visualización gráfica que presente la cantidad y el porcentaje de actividades agrupadas por cada Estado definido en el sistema (Completada, En ejecución, Vencida, Pendiente).
2. THE Dashboard SHALL representar cada Estado con un color visualmente distinguible entre sí en la visualización.
3. IF un Estado no tiene actividades asociadas, THEN THE Dashboard SHALL representar ese Estado con valor cero en la visualización.

### Requisito 6: Filtros interactivos

**Historia de Usuario:** Como usuario del Dashboard, quiero filtrar la información por padrino, área o estado, para enfocar el análisis en segmentos específicos.

#### Criterios de Aceptación

1. THE Dashboard SHALL proporcionar un Filtro por Padrino que liste todos los padrinos disponibles en los datos, ordenados alfabéticamente, permitiendo seleccionar uno o más valores simultáneamente.
2. THE Dashboard SHALL proporcionar un Filtro por Área que liste todas las áreas disponibles en los datos, ordenadas alfabéticamente, permitiendo seleccionar uno o más valores simultáneamente.
3. THE Dashboard SHALL proporcionar un Filtro por Estado que liste todos los estados disponibles en los datos (Completada, En ejecución, Vencida, Pendiente), permitiendo seleccionar uno o más valores simultáneamente.
4. WHEN el usuario selecciona un valor en cualquier Filtro, THE Dashboard SHALL actualizar los KPIs y las visualizaciones en no más de 1 segundo para reflejar únicamente los datos que coincidan con los filtros aplicados.
5. WHEN el usuario limpia un Filtro, THE Dashboard SHALL mostrar los datos sin restricción para ese criterio.
6. WHEN múltiples Filtros están activos, THE Dashboard SHALL aplicar todos los filtros de forma combinada (intersección).
7. WHEN el Dashboard se carga por primera vez, THE Dashboard SHALL mostrar todos los Filtros sin ningún valor seleccionado y presentar los datos completos sin restricción.
8. IF la combinación de filtros activos no produce resultados, THEN THE Dashboard SHALL mostrar los KPIs en cero y las visualizaciones vacías con un mensaje indicando que no hay datos para los filtros seleccionados.
9. THE Dashboard SHALL indicar visualmente qué Filtros tienen valores seleccionados actualmente.

### Requisito 7: Sección de retos

**Historia de Usuario:** Como usuario del Dashboard, quiero ver un listado de actividades con retos reportados y un resumen de los mismos, para identificar obstáculos y tomar acciones correctivas.

#### Criterios de Aceptación

1. THE Dashboard SHALL mostrar una lista de actividades que tengan un valor no vacío (excluyendo cadenas compuestas únicamente por espacios en blanco) en el campo Retos, ordenada alfabéticamente por nombre de Padrino.
2. WHEN se muestra la lista de retos, THE Dashboard SHALL incluir para cada entrada: el nombre del Padrino, la Actividad, el Estado y el Reto reportado.
3. THE Dashboard SHALL mostrar un resumen con el conteo total de actividades que reportan retos, reflejando los filtros activos en ese momento.
4. WHILE uno o más Filtros están activos, THE Dashboard SHALL mostrar en la sección de retos únicamente las actividades con retos que coincidan con los filtros aplicados, y actualizar el conteo del resumen de acuerdo a los resultados filtrados.
5. IF no existen actividades con retos reportados (o ninguna coincide con los filtros activos), THEN THE Dashboard SHALL mostrar un mensaje indicando que no se encontraron actividades con retos.

### Requisito 8: Arquitectura MVP

**Historia de Usuario:** Como desarrollador, quiero que la arquitectura sea simple y adecuada para un MVP, para facilitar el desarrollo rápido y la iteración.

#### Criterios de Aceptación

1. THE Dashboard SHALL funcionar como una aplicación web de página única (SPA) que se pueda servir como archivos estáticos sin requerir un servidor de aplicaciones backend.
2. THE Dashboard SHALL obtener los datos de Google Sheets mediante la API de Google Sheets o una exportación en formato CSV o JSON.
3. THE Dashboard SHALL ser responsivo con un viewport mínimo soportado de 1024px de ancho y SHALL renderizar todos los KPIs, visualizaciones y filtros sin errores funcionales en las últimas 2 versiones estables de Chrome, Firefox, Safari y Edge en escritorio.
