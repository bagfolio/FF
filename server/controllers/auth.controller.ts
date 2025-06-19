// NOVO ARQUIVO: server/controllers/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service'; // Vamos criar este serviço a seguir

// Mock de estado do usuário (temporário, será substituído por autenticação real)
let mockUserState = {
    id: "dev-user-123",
    email: "dev@futebol-futuro.com",
    firstName: "João",
    lastName: "Silva",
    profileImageUrl: "https://i.pravatar.cc/150?u=dev-user-123",
    userType: null as string | null,
    createdAt: new Date(),
    updatedAt: new Date(),
    roleData: null as any
};

export async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
        // Em um sistema real, aqui teríamos `req.user` vindo de um middleware
        res.status(200).json(mockUserState);
    } catch (error) {
        next(error);
    }
}

export async function setUserType(req: Request, res: Response, next: NextFunction) {
    try {
        const { userType } = req.body;

        // Validação de entrada
        if (!['athlete', 'scout'].includes(userType)) {
            return res.status(400).json({ message: "Tipo de usuário inválido." });
        }

        // Chama o serviço para atualizar o estado
        mockUserState = authService.updateUserType(mockUserState, userType);

        res.status(200).json(mockUserState);
    } catch (error) {
        next(error);
    }
}