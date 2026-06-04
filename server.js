import express from 'express';
import cors from 'cors';
import https from 'https';
import http from 'http';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const HTTP_PORT = 3001;
const HTTPS_PORT = 3443;
const DATA_FILE = join(__dirname, 'data', 'actividades.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Servir el frontend (build de producción)
app.use(express.static(join(__dirname, 'dist')));

// Asegurar que el directorio data existe
if (!existsSync(join(__dirname, 'data'))) {
  mkdirSync(join(__dirname, 'data'), { recursive: true });
}

// Inicializar archivo de datos si no existe
if (!existsSync(DATA_FILE)) {
  writeFileSync(DATA_FILE, '[]', 'utf-8');
}

// API: Obtener todas las actividades
app.get('/api/actividades', (req, res) => {
  try {
    const data = readFileSync(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error leyendo datos:', error);
    res.status(500).json({ error: 'Error al leer los datos' });
  }
});

// API: Guardar todas las actividades
app.post('/api/actividades', (req, res) => {
  try {
    const actividades = req.body;
    if (!Array.isArray(actividades)) {
      return res.status(400).json({ error: 'Se esperaba un array de actividades' });
    }
    writeFileSync(DATA_FILE, JSON.stringify(actividades, null, 2), 'utf-8');
    res.json({ ok: true, count: actividades.length });
  } catch (error) {
    console.error('Error guardando datos:', error);
    res.status(500).json({ error: 'Error al guardar los datos' });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Servidor HTTP
http.createServer(app).listen(HTTP_PORT, '0.0.0.0', () => {
  console.log(`   HTTP:     http://localhost:${HTTP_PORT}`);
});

// Servidor HTTPS
const certPath = join(__dirname, 'cert.pem');
const keyPath = join(__dirname, 'key.pem');

if (existsSync(certPath) && existsSync(keyPath)) {
  const sslOptions = {
    key: readFileSync(keyPath),
    cert: readFileSync(certPath),
  };

  https.createServer(sslOptions, app).listen(HTTPS_PORT, '0.0.0.0', () => {
    console.log(`   HTTPS:    https://localhost:${HTTPS_PORT}`);

    import('os').then(os => {
      const nets = os.networkInterfaces();
      console.log(`\n🚀 Dashboard Padrinos corriendo en:`);
      for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
          if (net.family === 'IPv4' && !net.internal) {
            console.log(`   Red HTTP:  http://${net.address}:${HTTP_PORT}`);
            console.log(`   Red HTTPS: https://${net.address}:${HTTPS_PORT}`);
          }
        }
      }
      console.log(`\n📱 Para celulares usa la URL HTTPS.`);
      console.log(`   El navegador mostrará una advertencia de certificado — es normal.`);
      console.log(`   Haz clic en "Avanzado" → "Continuar" para acceder.\n`);
    });
  });
} else {
  console.log('⚠️  No se encontraron certificados SSL. Solo disponible HTTP.');

  import('os').then(os => {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          console.log(`   Red:      http://${net.address}:${HTTP_PORT}`);
        }
      }
    }
  });
}
