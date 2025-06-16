// NOVO ARQUIVO: server/services/athlete.service.ts

import { storage } from '../storage';
import { type InsertAthlete, type Athlete } from '@shared/schema';

class AthleteService {
    public async create(athleteData: InsertAthlete): Promise<Athlete> {
        // Verifica se um atleta com este CPF já existe (lógica de negócio)
        if (athleteData.cpf) {
            // A camada de storage poderia ter um método para isso, mas por simplicidade vamos deixar assim
            // const existing = await storage.getAthleteByCpf(athleteData.cpf);
            // if (existing) {
            //    throw new Error("Já existe um atleta com este CPF.");
            // }
        }

        // Chama a camada de persistência (storage) para criar o registro
        const newAthlete = await storage.createAthlete(athleteData);

        // Aqui poderíamos, por exemplo, enviar um e-mail de boas-vindas

        return newAthlete;
    }
}

export const athleteService = new AthleteService();
