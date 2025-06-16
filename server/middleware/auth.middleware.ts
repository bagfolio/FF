// NOVO ARQUIVO: server/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';

// Estendemos a interface Request do Express para incluir nosso objeto `user`
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto-deve-ser-longo';
if (JWT_SECRET === 'seu-segredo-super-secreto-deve-ser-longo') {
    console.warn('AVISO: JWT_SECRET não está configurado. Usando valor padrão inseguro.');
}

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Acesso não autorizado: token ausente.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await storage.getUser(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Acesso não autorizado: usuário não encontrado.' });
        }

        // Anexa o usuário à requisição para ser usado nos controllers
        req.user = { id: user.id, email: user.email! }; 

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Acesso não autorizado: token inválido.' });
    }
}