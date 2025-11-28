import { PrismaService } from '../../prisma/prisma.service';
import { User, Bookmark, Tag } from '../../generated/prisma/client';
export declare function createMockPrismaService(): jest.Mocked<PrismaService>;
export declare function createMockUser(overrides?: Partial<User>): User;
export declare function createMockBookmark(overrides?: Partial<Bookmark>): Bookmark;
export declare function createMockTag(overrides?: Partial<Tag>): Tag;
