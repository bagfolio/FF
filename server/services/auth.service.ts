// ARQUIVO ATUALIZADO: server/controllers/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service';
import { storage } from '../storage';

// Schemas de validação para registro e login
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    firstName: z.string().min(2),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const data = registerSchema.parse(req.body);
        const user = await authService.register(data);
        res.status(201).json({ message: "Usuário registrado com sucesso.", userId: user.id });
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const token = await authService.login(email, password);

        res.cookie('token', token, {
            httpOnly: true, // O cookie não pode ser acessado via JavaScript
            secure: process.env.NODE_ENV === 'production', // Apenas em HTTPS
            sameSite: 'strict', // Proteção CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
        });

        res.status(200).json({ message: "Login bem-sucedido." });
    } catch (error) {
        next(error);
    }
}

export async function logout(req: Request, res: Response) {
    res.clearCookie('token');
    res.status(200).json({ message: "Logout bem-sucedido." });
}

export async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
    // Agora usa o usuário real do middleware `isAuthenticated`
    if (!req.user) {
        return res.status(401).json({ message: 'Não autenticado.' });
    }

    try {
        const fullUser = await storage.getUserWithRole(req.user.id);
        res.status(200).json(fullUser);
    } catch (error) {
        next(error);
    }
}

export async function setUserType(req: Request, res: Response, next: NextFunction) {
    try {
        const { userType } = req.body;
        const userId = req.user!.id; // req.user é garantido pelo middleware

        if (!['athlete', 'scout'].includes(userType)) {
            return res.status(400).json({ message: "Tipo de usuário inválido." });
        }

        const updatedUser = await authService.updateUserType(userId, userType);

        // Lógica para criar o perfil de atleta/scout seria chamada aqui
        // Ex: if (userType === 'athlete') await athleteService.createProfileShell(userId);

        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
}

