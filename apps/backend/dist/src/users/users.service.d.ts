import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from 'generated/prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        email: string;
        name: string;
        id: string;
        created_at: Date;
        updated_at: Date;
    }>;
    findAll(): Promise<{
        email: string;
        name: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        status: UserStatus;
        _count: {
            bookmarks: number;
        };
    }[]>;
    findOne(id: string): Promise<{
        email: string;
        name: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        status: UserStatus;
        bookmarks: {
            description: string;
            title: string;
            id: string;
            created_at: Date;
            tags: {
                name: string;
                id: string;
            }[];
            url: string;
        }[];
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        name: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        status: UserStatus;
    }>;
    activate(id: string): Promise<{
        email: string;
        name: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        status: UserStatus;
    }>;
    deactivate(id: string): Promise<{
        email: string;
        name: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        status: UserStatus;
    }>;
    block(id: string): Promise<{
        email: string;
        name: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        status: UserStatus;
    }>;
    unblock(id: string): Promise<{
        email: string;
        name: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        status: UserStatus;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
