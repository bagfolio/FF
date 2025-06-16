// ARQUIVO ATUALIZADO (CORRIGIDO): server/routes.ts

import type { Express } from "express";
import { createServer, type Server } from "http";
import { Router } from "express";

// Importe os controllers e o middleware
import { register, login, logout, getCurrentUser, setUserType } from "./controllers/auth.controller";
import { createAthleteProfile } from "./controllers/athlete.controller";
import { isAuthenticated } from "./middleware/auth.middleware"; // Importação correta

export async function registerRoutes(app: Express): Promise<Server> {
    const router = Router();

    // === ROTAS DE AUTENTICAÇÃO (Públicas) ===
    router.post('/api/auth/register', register);
    router.post('/api/auth/login', login);
    router.post('/api/auth/logout', logout);

    // === ROTAS PROTEGIDAS ===
    // AQUI ESTÁ A CORREÇÃO: Adicionamos o middleware `isAuthenticated`
    router.get('/api/auth/user', isAuthenticated, getCurrentUser); 

    router.post('/api/auth/user-type', isAuthenticated, setUserType);
    router.post('/api/athletes', isAuthenticated, createAthleteProfile);

    // ... outras rotas protegidas virão aqui

    app.use(router);

    const httpServer = createServer(app);
    return httpServer;
}