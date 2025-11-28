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
exports.TagsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TagsService = class TagsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTagDto) {
        const normalizedName = createTagDto.name.trim().toLowerCase();
        const existingTag = await this.prisma.tag.findUnique({
            where: { name: normalizedName },
        });
        if (existingTag) {
            throw new common_1.ConflictException('Tag with this name already exists');
        }
        const tag = await this.prisma.tag.create({
            data: { name: normalizedName },
            include: {
                _count: {
                    select: {
                        bookmarks: true,
                    },
                },
            },
        });
        return tag;
    }
    async findAll() {
        return this.prisma.tag.findMany({
            include: {
                _count: {
                    select: {
                        bookmarks: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
    async findOne(id) {
        const tag = await this.prisma.tag.findUnique({
            where: { id },
            include: {
                bookmarks: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        bookmarks: true,
                    },
                },
            },
        });
        if (!tag) {
            throw new common_1.NotFoundException(`Tag with ID ${id} not found`);
        }
        return tag;
    }
    async findByName(name) {
        const normalizedName = name.trim().toLowerCase();
        const tag = await this.prisma.tag.findUnique({
            where: { name: normalizedName },
            include: {
                bookmarks: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        bookmarks: true,
                    },
                },
            },
        });
        if (!tag) {
            throw new common_1.NotFoundException(`Tag with name ${name} not found`);
        }
        return tag;
    }
    async update(id, updateTagDto) {
        const tag = await this.prisma.tag.findUnique({
            where: { id },
        });
        if (!tag) {
            throw new common_1.NotFoundException(`Tag with ID ${id} not found`);
        }
        if (updateTagDto.name) {
            const normalizedName = updateTagDto.name.trim().toLowerCase();
            const existingTag = await this.prisma.tag.findUnique({
                where: { name: normalizedName },
            });
            if (existingTag && existingTag.id !== id) {
                throw new common_1.ConflictException('Tag with this name already exists');
            }
            const updatedTag = await this.prisma.tag.update({
                where: { id },
                data: { name: normalizedName },
                include: {
                    _count: {
                        select: {
                            bookmarks: true,
                        },
                    },
                },
            });
            return updatedTag;
        }
        return this.findOne(id);
    }
    async remove(id) {
        const tag = await this.prisma.tag.findUnique({
            where: { id },
        });
        if (!tag) {
            throw new common_1.NotFoundException(`Tag with ID ${id} not found`);
        }
        await this.prisma.tag.delete({
            where: { id },
        });
        return { message: 'Tag deleted successfully' };
    }
};
exports.TagsService = TagsService;
exports.TagsService = TagsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TagsService);
//# sourceMappingURL=tags.service.js.map