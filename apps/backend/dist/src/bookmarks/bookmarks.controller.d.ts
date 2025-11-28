import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
type CustomRequest = Request & {
    user: {
        userId: string;
    };
};
export declare class BookmarksController {
    private readonly bookmarksService;
    constructor(bookmarksService: BookmarksService);
    create(createBookmarkDto: CreateBookmarkDto, req: CustomRequest): Promise<import("../../generated/prisma/models").BookmarkDelegate<import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig;
    }> & {
        tags: import("../../generated/prisma/client").PrismaClient["tag"][];
        user: import("../../generated/prisma/client").PrismaClient["user"];
    }>;
    findAll(req: CustomRequest, all?: string): Promise<({
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
    findOne(id: string, req: CustomRequest): Promise<{
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
    update(id: string, updateBookmarkDto: UpdateBookmarkDto, req: CustomRequest): Promise<{
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
    remove(id: string, req: CustomRequest): Promise<{
        message: string;
    }>;
}
export {};
