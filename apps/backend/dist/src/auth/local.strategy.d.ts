import { AuthService } from './auth.service';
import { UserStatus } from 'generated/prisma/client';
declare const LocalStrategy_base: new (...args: any[]) => any;
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(email: string, password: string): Promise<{
        id: string;
        email: string;
        name: string;
        status: UserStatus;
        created_at: Date;
        updated_at: Date;
    }>;
}
export {};
