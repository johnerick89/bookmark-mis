import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
        status: import("../../generated/prisma/enums").UserStatus;
        _count: {
            bookmarks: number;
        };
    }[]>;
    getMe(req: {
        user: {
            userId: string;
        };
    }): Promise<{
        email: string;
        name: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        status: import("../../generated/prisma/enums").UserStatus;
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
    findOne(id: string): Promise<{
        email: string;
        name: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        status: import("../../generated/prisma/enums").UserStatus;
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
        status: import("../../generated/prisma/enums").UserStatus;
    }>;
    activate(id: string): Promise<{
        email: string;
        name: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        status: import("../../generated/prisma/enums").UserStatus;
    }>;
    deactivate(id: string): Promise<{
        email: string;
        name: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        status: import("../../generated/prisma/enums").UserStatus;
    }>;
    block(id: string): Promise<{
        email: string;
        name: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        status: import("../../generated/prisma/enums").UserStatus;
    }>;
    unblock(id: string): Promise<{
        email: string;
        name: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        status: import("../../generated/prisma/enums").UserStatus;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
