import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserStatus } from 'generated/prisma/client';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: import("generated/prisma/client").User;
    }>;
    login(req: {
        user: {
            email: string;
            password: string;
            id: string;
            name: string;
            status: UserStatus;
            created_at: Date;
            updated_at: Date;
        };
    }): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            status: UserStatus;
            name: string;
        };
    }>;
    getProfile(req: {
        user: {
            userId: string;
            email: string;
        };
    }): {
        userId: string;
        email: string;
    };
    updateProfile(req: {
        user: {
            userId: string;
        };
    }, updateProfileDto: UpdateProfileDto): Promise<{
        email: string;
        name: string | null;
        password: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        status: UserStatus;
    }>;
    changePassword(req: {
        user: {
            userId: string;
        };
    }, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
