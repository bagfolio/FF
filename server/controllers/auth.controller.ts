// server/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { insertUserSchema } from '@shared/schema';
import { z } from 'zod';

const registerSchema = insertUserSchema.extend({
    password: z.string().min(6),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

export async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        const user = await authService.getCurrentUser(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
}

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const validatedData = registerSchema.parse(req.body);
        const { confirmPassword, ...userData } = validatedData;
        
        const registerData = {
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName || userData.email.split('@')[0]
        };
        
        const result = await authService.register(registerData);
        res.status(201).json(result);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ 
                message: 'Dados inválidos', 
                errors: error.errors 
            });
        }
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email e senha são obrigatórios' 
            });
        }

        const result = await authService.login(email, password);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function logout(req: Request, res: Response) {
    res.json({ message: 'Logout realizado com sucesso' });
}

export async function setUserType(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.id;
        const { userType } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        if (!['athlete', 'scout'].includes(userType)) {
            return res.status(400).json({ 
                message: 'Tipo de usuário inválido. Use "athlete" ou "scout"' 
            });
        }

        const updatedUser = await authService.updateUserType(userId, userType);
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
}