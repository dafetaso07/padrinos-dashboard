/**
 * Google Apps Script - Backend para Dashboard de Padrinos
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. Abre tu Google Sheet (el de los padrinos)
 * 2. Ve a Extensiones → Apps Script
 * 3. Borra todo el código que haya y pega este archivo completo
 * 4. Clic en "Implementar" → "Nueva implementación"
 * 5. Tipo: "Aplicación web"
 * 6. Ejecutar como: "Yo" (tu cuenta)
 * 7. Quién tiene acceso: "Cualquiera"
 * 8. Clic en "Implementar"
 * 9. Copia la URL que te da (es tu API)
 * 10. Pon esa URL en el .env del frontend como VITE_API_URL
 */

// Nombre de la hoja donde están los datos
const SHEET_NAME = 'Hoja 1';

// Columnas esperadas (en orden)
const COLUMNS = ['id', 'padrino', 'area', 'iniciativa', 'actividad', 'fechaCompromiso', 'estado', 'porcentajeAvance', 'retos', 'observaciones', 'avanceUltimoPeriodo'];

function doGet(e) {
  const action = e.parameter.action || 'getAll';
  
  try {
    switch (action) {
      case 'getAll':
        return jsonResponse(getAllActividades());
      case 'getPadrino':
        return jsonResponse(getActividadesByPadrino(e.parameter.padrino));
      default:
        return jsonResponse({ error: 'Acción no reconocida' }, 400);
    }
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

function doPost(e) {
  const action = e.parameter.action || 'save';
  const data = JSON.parse(e.postData.contents);
  
  try {
    switch (action) {
      case 'save':
        return jsonResponse(saveAllActividades(data));
      case 'add':
        return jsonResponse(addActividad(data));
      case 'update':
        return jsonResponse(updateActividad(data));
      case 'delete':
        return jsonResponse(deleteActividad(data.id));
      default:
        return jsonResponse({ error: 'Acción no reconocida' }, 400);
    }
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

// === FUNCIONES CRUD ===

function getAllActividades() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return []; // Solo headers o vacía
  
  const headers = data[0].map(h => h.toString().trim().toLowerCase());
  const actividades = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0] && !row[1]) continue; // Fila vacía
    
    const actividad = {};
    COLUMNS.forEach((col, idx) => {
      const headerIdx = findHeaderIndex(headers, col);
      if (headerIdx >= 0) {
        actividad[col] = row[headerIdx] !== undefined ? row[headerIdx].toString() : '';
      } else {
        actividad[col] = '';
      }
    });
    
    // Generar ID si no tiene
    if (!actividad.id) {
      actividad.id = 'act-' + new Date().getTime() + '-' + i;
    }
    
    // Asegurar porcentajeAvance sea número
    actividad.porcentajeAvance = parseInt(actividad.porcentajeAvance) || 0;
    
    actividades.push(actividad);
  }
  
  return actividades;
}

function getActividadesByPadrino(padrino) {
  const all = getAllActividades();
  return all.filter(a => a.padrino === padrino);
}

function saveAllActividades(actividades) {
  const sheet = getSheet();
  
  // Limpiar todo excepto headers
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, COLUMNS.length).clearContent();
  }
  
  // Escribir headers si no existen
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]);
  }
  
  // Escribir datos
  if (actividades.length > 0) {
    const rows = actividades.map(a => COLUMNS.map(col => a[col] || ''));
    sheet.getRange(2, 1, rows.length, COLUMNS.length).setValues(rows);
  }
  
  return { ok: true, count: actividades.length };
}

function addActividad(actividad) {
  const sheet = getSheet();
  
  // Generar ID
  if (!actividad.id) {
    actividad.id = 'act-' + new Date().getTime() + '-' + Math.random().toString(36).slice(2, 7);
  }
  
  const row = COLUMNS.map(col => actividad[col] || '');
  sheet.appendRow(row);
  
  return { ok: true, id: actividad.id };
}

function updateActividad(actividad) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0].map(h => h.toString().trim().toLowerCase());
  const idIdx = findHeaderIndex(headers, 'id');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIdx] === actividad.id) {
      const row = COLUMNS.map(col => actividad[col] || '');
      sheet.getRange(i + 1, 1, 1, COLUMNS.length).setValues([row]);
      return { ok: true, id: actividad.id };
    }
  }
  
  return { error: 'Actividad no encontrada', id: actividad.id };
}

function deleteActividad(id) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0].map(h => h.toString().trim().toLowerCase());
  const idIdx = findHeaderIndex(headers, 'id');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIdx] === id) {
      sheet.deleteRow(i + 1);
      return { ok: true, deleted: id };
    }
  }
  
  return { error: 'Actividad no encontrada', id: id };
}

// === HELPERS ===

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    // Intentar con otros nombres comunes
    sheet = ss.getSheetByName('Hoja1') || ss.getSheetByName('Sheet1') || ss.getSheets()[0];
  }
  
  if (!sheet) {
    throw new Error('No se encontró la hoja de datos');
  }
  
  return sheet;
}

function findHeaderIndex(headers, columnName) {
  const aliases = {
    'id': ['id'],
    'padrino': ['padrino'],
    'area': ['área', 'area'],
    'iniciativa': ['iniciativa'],
    'actividad': ['actividad'],
    'fechacompromiso': ['fecha compromiso', 'fechacompromiso', 'fecha_compromiso'],
    'estado': ['estado'],
    'porcentajeavance': ['porcentaje de avance', 'porcentajeavance', '% avance', 'avance'],
    'retos': ['retos', 'reto'],
    'observaciones': ['observaciones', 'observación'],
    'avanceultimoperiodo': ['avance ultimo periodo', 'avance último periodo', 'avanceultimoperiodo']
  };
  
  const searchAliases = aliases[columnName.toLowerCase()] || [columnName.toLowerCase()];
  
  for (const alias of searchAliases) {
    const idx = headers.indexOf(alias);
    if (idx >= 0) return idx;
  }
  
  return -1;
}

function jsonResponse(data, code) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// === FUNCIÓN DE PRUEBA ===
// Ejecuta esta función para verificar que todo funciona
function testGetAll() {
  const result = getAllActividades();
  Logger.log('Total actividades: ' + result.length);
  Logger.log(JSON.stringify(result.slice(0, 2), null, 2));
}
