// ARQUIVO ATUALIZADO (CORRIGIDO): server/controllers/athlete.controller.ts

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { athleteService } from '../services/athlete.service';
import { insertAthleteSchema } from '@shared/schema';

// O mockUser foi removido daqui!

export async function createAthleteProfile(req: Request, res: Response, next: NextFunction) {
    try {
        // Agora usamos o usuário real, garantido pelo middleware
        const userId = req.user!.id; // O '!' diz ao TypeScript que temos certeza que `req.user` existe.

        const athleteData = insertAthleteSchema.parse({ ...req.body, userId });

        const newAthlete = await athleteService.create(athleteData);

        res.status(201).json(newAthlete);
    } catch (error) {
        next(error);
    }
}

// ...