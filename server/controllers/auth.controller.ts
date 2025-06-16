// ARQUIVO ATUALIZADO (MODO DE DEPURAÇÃO): server/controllers/auth.controller.ts

import { Request, Response, NextFunction } from 'express';

// Mock DEFINITIVO e SIMPLES para o usuário de desenvolvimento.
const devUser = {
    id: "dev-user-123",
    email: "dev@futebol-futuro.com",
    firstName: "João",
    lastName: "Silva",
    profileImageUrl: "https://i.pravatar.cc/150?u=dev-user-123",
    userType: 'athlete', // Definindo um tipo padrão para evitar problemas
    roleData: {
        id: 1,
        userId: "dev-user-123",
        fullName: "João Silva",
        position: "Atacante",
        city: "São Paulo",
        state: "SP",
        verificationLevel: "bronze"
    }
};

export async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
    // Ignora tudo e apenas retorna o usuário mockado.
    // Isso garante que o problema NÃO está no backend.
    console.log("INFO: Endpoint /api/auth/user chamado, retornando usuário mockado.");
    res.status(200).json(devUser);
}

// As outras funções permanecem, mas não serão usadas por enquanto.
// Manteremos a estrutura para quando reativarmos.
export async function register(req: Request, res: Response, next: NextFunction) {
    res.status(501).json({ message: "Registro desabilitado em modo de depuração." });
}

export async function login(req: Request, res: Response, next: NextFunction) {
     res.status(501).json({ message: "Login desabilitado em modo de depuração." });
}

export async function logout(req: Request, res: Response) {
    res.status(200).json({ message: "Logout." });
}

export async function setUserType(req: Request, res: Response, next: NextFunction) {
    res.status(200).json(devUser);
}