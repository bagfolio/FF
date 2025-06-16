// server/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'Acesso não autorizado: token ausente ou formato inválido' 
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            req.user = {
                id: decoded.id,
                email: decoded.email
            };
            next();
        } catch (jwtError) {
            return res.status(401).json({ 
                message: 'Acesso não autorizado: token inválido ou expirado' 
            });
        }
    } catch (error) {
        return res.status(500).json({ 
            message: 'Erro interno do servidor' 
        });
    }
}