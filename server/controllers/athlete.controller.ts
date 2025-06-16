// server/controllers/athlete.controller.ts
import { Request, Response, NextFunction } from 'express';
import { athleteService } from '../services/athlete.service';
import { insertAthleteSchema } from '@shared/schema';
import { z } from 'zod';

export async function createAthleteProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        const validatedData = insertAthleteSchema.parse(req.body);
        const athleteData = { ...validatedData, userId };
        
        const athlete = await athleteService.create(athleteData);
        res.status(201).json(athlete);
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

export async function getAthleteProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const athlete = await athleteService.getById(parseInt(id));
        
        if (!athlete) {
            return res.status(404).json({ message: 'Atleta não encontrado' });
        }

        res.json(athlete);
    } catch (error) {
        next(error);
    }
}

export async function getCurrentAthleteProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        const athlete = await athleteService.getByUserId(userId);
        if (!athlete) {
            return res.status(404).json({ message: 'Perfil de atleta não encontrado' });
        }

        res.json(athlete);
    } catch (error) {
        next(error);
    }
}

export async function updateAthleteProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        const athlete = await athleteService.getByUserId(userId);
        if (!athlete) {
            return res.status(404).json({ message: 'Perfil de atleta não encontrado' });
        }

        const validatedData = insertAthleteSchema.partial().parse(req.body);
        const updatedAthlete = await athleteService.update(athlete.id, validatedData);
        
        res.json(updatedAthlete);
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

export async function searchAthletes(req: Request, res: Response, next: NextFunction) {
    try {
        const filters = req.query;
        const athletes = await athleteService.search(filters);
        res.json(athletes);
    } catch (error) {
        next(error);
    }
}