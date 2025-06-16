// NOVO ARQUIVO: server/controllers/mock.controller.ts

import { Request, Response, NextFunction } from 'express';
import { generateMockAthletes } from '../mockData';

export function getMockAthletes(req: Request, res: Response) {
    const mockAthletes = generateMockAthletes(20);
    res.json(mockAthletes);
}

export function getMockTests(req: Request, res: Response) {
    const athleteId = parseInt(req.params.id);
    const mockTests = [
        { id: 1, athleteId, testType: "speed_20m", result: 2.78, verified: true, createdAt: new Date() },
        { id: 2, athleteId, testType: "agility_5_10_5", result: 4.65, verified: true, createdAt: new Date() },
    ];
    res.json(mockTests);
}

export function getMockScoutProfile(req: Request, res: Response) {
    // Assume que o usuário é um scout para este endpoint mockado
    const mockScoutProfile = {
        id: 1,
        userId: "dev-user-123",
        fullName: "Carlos Alberto",
        organization: "Olheiros do Brasil",
        position: "Scout Chefe - Sudeste"
    };
    res.json(mockScoutProfile);
}