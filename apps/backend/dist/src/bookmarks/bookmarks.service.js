"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const tagging_service_1 = require("./tagging.service");
let BookmarksService = class BookmarksService {
    prisma;
    taggingService;
    constructor(prisma, taggingService) {
        this.prisma = prisma;
        this.taggingService = taggingService;
    }
    async create(createBookmarkDto, userId) {
        const existingBookmark = await this.prisma.bookmark.findUnique({
            where: { url: createBookmarkDto.url },
        });
        if (existingBookmark && existingBookmark.user_id === userId) {
            throw new common_1.ConflictException('Bookmark with this URL already exists');
        }
        const mlTags = await this.taggingService.generateTags(createBookmarkDto.url, 5);
        const tagConnections = await this.processTags([
            ...mlTags,
            ...(createBookmarkDto.tags || []),
        ]);
        const bookmark = await this.prisma.bookmark.create({
            data: {
                url: createBookmarkDto.url,
                title: createBookmarkDto.title,
                description: createBookmarkDto.description,
                user_id: userId,
                tags: {
                    connect: tagConnections.map((tag) => ({ id: tag.id })),
                },
            },
            include: {
                tags: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        if (!bookmark) {
            throw new Error('Failed to create bookmark');
        }
        return bookmark;
    }
    async findAll(userId) {
        const where = userId ? { user_id: userId } : {};
        return this.prisma.bookmark.findMany({
            where,
            include: {
                tags: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }
    async findOne(id, userId) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: { id },
            include: {
                tags: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        if (!bookmark) {
            throw new common_1.NotFoundException(`Bookmark with ID ${id} not found`);
        }
        if (userId && bookmark.user_id !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this bookmark');
        }
        return bookmark;
    }
    async update(id, updateBookmarkDto, userId) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: { id },
        });
        if (!bookmark) {
            throw new common_1.NotFoundException(`Bookmark with ID ${id} not found`);
        }
        if (bookmark.user_id !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to update this bookmark');
        }
        if (updateBookmarkDto.url && updateBookmarkDto.url !== bookmark.url) {
            const existingBookmark = await this.prisma.bookmark.findUnique({
                where: { url: updateBookmarkDto.url },
            });
            if (existingBookmark) {
                throw new common_1.ConflictException('Bookmark with this URL already exists');
            }
        }
        const mlTags = await this.taggingService.generateTags(updateBookmarkDto.url || bookmark.url, 5);
        let tagConnections = [];
        if (updateBookmarkDto.tags !== undefined) {
            const allTags = [...mlTags, ...(updateBookmarkDto.tags || [])];
            tagConnections = await this.processTags(allTags);
        }
        const updateData = {};
        if (updateBookmarkDto.url)
            updateData.url = updateBookmarkDto.url;
        if (updateBookmarkDto.title)
            updateData.title = updateBookmarkDto.title;
        if (updateBookmarkDto.description !== undefined) {
            updateData.description = updateBookmarkDto.description;
        }
        const updatedBookmark = await this.prisma.bookmark.update({
            where: { id },
            data: {
                ...updateData,
                ...(updateBookmarkDto.tags !== undefined && {
                    tags: {
                        set: tagConnections.map((tag) => ({ id: tag.id })),
                    },
                }),
            },
            include: {
                tags: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        return updatedBookmark;
    }
    async remove(id, userId) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: { id },
        });
        if (!bookmark) {
            throw new common_1.NotFoundException(`Bookmark with ID ${id} not found`);
        }
        if (bookmark.user_id !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to delete this bookmark');
        }
        await this.prisma.bookmark.delete({
            where: { id },
        });
        return { message: 'Bookmark deleted successfully' };
    }
    async processTags(tagNames) {
        const tags = [];
        for (const tagName of tagNames) {
            const normalizedName = tagName.trim().toLowerCase();
            if (!normalizedName)
                continue;
            let tag = await this.prisma.tag.findUnique({
                where: { name: normalizedName },
            });
            if (!tag) {
                tag = await this.prisma.tag.create({
                    data: { name: normalizedName },
                });
            }
            tags.push(tag);
        }
        return tags;
    }
};
exports.BookmarksService = BookmarksService;
exports.BookmarksService = BookmarksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tagging_service_1.TaggingService])
], BookmarksService);
//# sourceMappingURL=bookmarks.service.js.map