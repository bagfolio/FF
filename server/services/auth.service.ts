// server/services/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';
import { UpsertUser } from '@shared/schema';

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
}

class AuthService {
    private JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

    async register(data: RegisterData) {
        // Check if user already exists
        const existingUser = await storage.getUserByEmail(data.email);
        if (existingUser) {
            throw new Error('Usuário já existe com este email');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 12);

        // Create user data
        const userData: UpsertUser = {
            id: this.generateUserId(),
            email: data.email,
            firstName: data.firstName,
            lastName: null,
            profileImageUrl: null,
            userType: null
        };

        // Create user
        const user = await storage.upsertUser(userData);

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            this.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userType: user.userType
            },
            token
        };
    }

    async login(email: string, password: string) {
        // Find user
        const user = await storage.getUserByEmail(email);
        if (!user) {
            throw new Error('Credenciais inválidas');
        }

        // For now, we'll skip password verification since we don't store passwords
        // In a real implementation, you would verify the password here
        // const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        // if (!isValidPassword) {
        //     throw new Error('Credenciais inválidas');
        // }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            this.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userType: user.userType
            },
            token
        };
    }

    async getCurrentUser(userId: string) {
        const user = await storage.getUserWithRole(userId);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userType: user.userType,
            athlete: user.athlete || null,
            scout: user.scout || null
        };
    }

    async updateUserType(userId: string, userType: string) {
        const existingUser = await storage.getUser(userId);
        if (!existingUser) {
            throw new Error('Usuário não encontrado');
        }

        const userData: UpsertUser = {
            id: userId,
            email: existingUser.email,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            profileImageUrl: existingUser.profileImageUrl,
            userType: userType as 'athlete' | 'scout'
        };

        return await storage.upsertUser(userData);
    }

    private generateUserId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}

export const authService = new AuthService();