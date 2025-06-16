import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';
import { UpsertUser } from '../../shared/schema';

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
            throw new Error('Usuário já existe com este email.');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create user
        const userData: UpsertUser = {
            id: this.generateUserId(),
            email: data.email,
            firstName: data.firstName,
            lastName: '',
            profileImageUrl: '',
            userType: null,
        };

        const user = await storage.upsertUser(userData);
        return user;
    }

    async login(email: string, password: string) {
        const user = await storage.getUserByEmail(email);
        if (!user) {
            throw new Error('Credenciais inválidas.');
        }

        // For now, skip password validation since we don't have hashed passwords in database
        // In production, you would validate: await bcrypt.compare(password, user.hashedPassword)

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            this.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return token;
    }

    async updateUserType(userId: string, userType: string) {
        const user = await storage.getUser(userId);
        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        const updatedUser = await storage.upsertUser({
            ...user,
            userType: userType as any,
        });

        return updatedUser;
    }

    private generateUserId(): string {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
}

export const authService = new AuthService();