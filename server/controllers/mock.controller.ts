// server/controllers/mock.controller.ts
import { Request, Response } from 'express';
import { generateMockAthletes } from '../mockData';

export function getMockAthletes(req: Request, res: Response) {
    const mockAthletes = generateMockAthletes(20);
    res.json(mockAthletes);
}

export function getMockTests(req: Request, res: Response) {
    const mockTests = [
        {
            id: 1,
            athleteId: 1,
            testType: 'velocidade_20m',
            result: 2.85,
            date: new Date().toISOString(),
            verified: true
        },
        {
            id: 2,
            athleteId: 1,
            testType: 'agilidade_5_10_5',
            result: 4.12,
            date: new Date().toISOString(),
            verified: false
        }
    ];
    res.json(mockTests);
}

export function getMockScoutProfile(req: Request, res: Response) {
    const mockScout = {
        id: 1,
        name: 'João Santos',
        organization: 'Santos FC',
        experience: 8,
        specialization: 'Jovens Talentos',
        region: 'São Paulo',
        verified: true
    };
    res.json(mockScout);
}