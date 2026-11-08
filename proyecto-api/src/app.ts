import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";

import "./database/db.js";
import { usersRouter } from "./routes/users.routes.js";
import { initializeAuthDatabase } from "./database/auth-db.js";

import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.routes.js";
import { deleteExpiredSessions } from "./auth/session.js";

import { csrfProtection } from "./middleware/csrf.middleware.js";

import path from "node:path";
import { fileURLToPath } from "node:url";

import { getAllowedOrigin } from './config/origin.js';

// 1. Inicializar la base de datos
initializeAuthDatabase();

// 2. Eliminar sesiones vencidas al iniciar la API
deleteExpiredSessions();

// 3. Crear aplicación Express
export const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  'http://localhost:4200',
  'http://127.0.0.1:4200',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

// 4. Configurar middlewares globales
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS'));
      }
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

// 5. Protección CSRF para rutas /api
app.use('/api', csrfProtection);

// 6. Ruta para verificar el estado de la API
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'API funcionando correctamente',
  });
});

// 7. Rutas de autenticación
app.use('/api/auth', authRouter);

// 8. Rutas de usuarios
app.use('/api/users', usersRouter);

// 9. Manejar rutas /api no encontradas
app.use('/api', (_req, res) => {
  res.status(404).json({
    message: 'Ruta no encontrada',
  });
});

// 10. Servir archivos estáticos de Angular
const angularPath = path.resolve(__dirname, '../../dist/proyecto-angular/browser');

app.use(express.static(angularPath));

// 11. Redirigir el resto de peticiones GET al index.html de Angular (SPA)
app.get('/{*splat}', (_req, res) => {
  res.sendFile(path.join(angularPath, 'index.html'));
});

// 12. Manejar cualquier otra ruta no encontrada
app.use((_req, res) => {
  res.status(404).json({
    message: 'Ruta no encontrada',
  });
});
