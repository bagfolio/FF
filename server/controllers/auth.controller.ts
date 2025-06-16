import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

// Mock user state for demonstration (would be replaced by real auth in production)
let mockUserState = {
    id: "mock-user-123",
    email: "user@example.com", 
    firstName: "João",
    lastName: "Silva",
    profileImageUrl: "",
    userType: null as string | null,
    createdAt: new Date(),
    updatedAt: new Date()
};

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        // Mock registration for now
        const { email, password, firstName } = req.body;
        res.status(201).json({ message: "Usuário registrado com sucesso.", userId: "mock-user-id" });
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        // Mock login for now
        const { email, password } = req.body;
        res.status(200).json({ message: "Login bem-sucedido." });
    } catch (error) {
        next(error);
    }
}

export async function logout(req: Request, res: Response) {
    res.status(200).json({ message: "Logout bem-sucedido." });
}

export async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
        // In production, this would get the actual authenticated user
        // For now, return mock user state
        res.status(200).json(mockUserState);
    } catch (error) {
        next(error);
    }
}

export async function setUserType(req: Request, res: Response, next: NextFunction) {
    try {
        const { userType } = req.body;
        
        if (!['athlete', 'scout'].includes(userType)) {
            return res.status(400).json({ message: "Tipo de usuário inválido." });
        }

        // Update mock user state
        mockUserState = {
            ...mockUserState,
            userType,
            updatedAt: new Date()
        };

        res.status(200).json(mockUserState);
    } catch (error) {
        next(error);
    }
}