import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { PrismaClient } from '../../generated/prisma/client';
import { TaggingService } from './tagging.service';
type BookmarkWithTagsAndUser = PrismaClient['bookmark'] & {
    tags: PrismaClient['tag'][];
    user: PrismaClient['user'];
};
export declare class BookmarksService {
    private prisma;
    private taggingService;
    constructor(prisma: PrismaService, taggingService: TaggingService);
    create(createBookmarkDto: CreateBookmarkDto, userId: string): Promise<BookmarkWithTagsAndUser>;
    findAll(userId?: string): Promise<({
        user: {
            id: string;
            email: string;
        };
        tags: {
            id: string;
            created_at: Date;
            name: string;
        }[];
    } & {
        id: string;
        url: string;
        title: string;
        description: string | null;
        user_id: string;
        embedding: import("@prisma/client/runtime/client").JsonValue | null;
        created_at: Date;
    })[]>;
    findOne(id: string, userId?: string): Promise<{
        user: {
            id: string;
            email: string;
        };
        tags: {
            id: string;
            created_at: Date;
            name: string;
        }[];
    } & {
        id: string;
        url: string;
        title: string;
        description: string | null;
        user_id: string;
        embedding: import("@prisma/client/runtime/client").JsonValue | null;
        created_at: Date;
    }>;
    update(id: string, updateBookmarkDto: UpdateBookmarkDto, userId: string): Promise<{
        user: {
            id: string;
            email: string;
        };
        tags: {
            id: string;
            created_at: Date;
            name: string;
        }[];
    } & {
        id: string;
        url: string;
        title: string;
        description: string | null;
        user_id: string;
        embedding: import("@prisma/client/runtime/client").JsonValue | null;
        created_at: Date;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    private processTags;
}
export {};
