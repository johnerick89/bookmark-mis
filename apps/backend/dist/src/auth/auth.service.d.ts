import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { User, UserStatus } from 'generated/prisma/client';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<User | null>;
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: User;
    }>;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    login(user: User): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            status: UserStatus;
            name: string;
        };
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
