// NOVO ARQUIVO: server/services/auth.service.ts

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
    userType: string | null;
    createdAt: Date;
    updatedAt: Date;
    roleData: any;
}

class AuthService {
    updateUserType(user: User, userType: string): User {
        return {
            ...user,
            userType,
            updatedAt: new Date()
        };
    }
}

export const authService = new AuthService();
