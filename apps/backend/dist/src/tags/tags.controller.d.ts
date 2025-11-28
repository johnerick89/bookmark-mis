import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
export declare class TagsController {
    private readonly tagsService;
    constructor(tagsService: TagsService);
    create(createTagDto: CreateTagDto): Promise<{
        _count: {
            bookmarks: number;
        };
    } & {
        name: string;
        id: string;
        created_at: Date;
    }>;
    findAll(): Promise<({
        _count: {
            bookmarks: number;
        };
    } & {
        name: string;
        id: string;
        created_at: Date;
    })[]>;
    findByName(name: string): Promise<{
        bookmarks: ({
            user: {
                email: string;
                id: string;
            };
        } & {
            description: string | null;
            title: string;
            id: string;
            created_at: Date;
            url: string;
            user_id: string;
            embedding: import("@prisma/client/runtime/client").JsonValue | null;
        })[];
        _count: {
            bookmarks: number;
        };
    } & {
        name: string;
        id: string;
        created_at: Date;
    }>;
    findOne(id: string): Promise<{
        bookmarks: ({
            user: {
                email: string;
                id: string;
            };
        } & {
            description: string | null;
            title: string;
            id: string;
            created_at: Date;
            url: string;
            user_id: string;
            embedding: import("@prisma/client/runtime/client").JsonValue | null;
        })[];
        _count: {
            bookmarks: number;
        };
    } & {
        name: string;
        id: string;
        created_at: Date;
    }>;
    update(id: string, updateTagDto: UpdateTagDto): Promise<{
        _count: {
            bookmarks: number;
        };
    } & {
        name: string;
        id: string;
        created_at: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
