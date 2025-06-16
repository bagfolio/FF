// server/services/athlete.service.ts
import { storage } from '../storage';
import { InsertAthlete, Athlete } from '@shared/schema';

class AthleteService {
    public async create(athleteData: InsertAthlete): Promise<Athlete> {
        return await storage.createAthlete(athleteData);
    }

    public async getById(id: number): Promise<Athlete | undefined> {
        return await storage.getAthlete(id);
    }

    public async getByUserId(userId: string): Promise<Athlete | undefined> {
        return await storage.getAthleteByUserId(userId);
    }

    public async update(id: number, updates: Partial<InsertAthlete>): Promise<Athlete> {
        return await storage.updateAthlete(id, updates);
    }

    public async search(filters: any): Promise<Athlete[]> {
        return await storage.searchAthletes(filters);
    }
}

export const athleteService = new AthleteService();