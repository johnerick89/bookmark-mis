"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("../../generated/prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: createUserDto.email,
                name: createUserDto.name,
                password: hashedPassword,
                status: client_1.UserStatus.ACTIVE,
            },
            select: {
                id: true,
                email: true,
                name: true,
                created_at: true,
                updated_at: true,
            },
        });
        return user;
    }
    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                created_at: true,
                updated_at: true,
                _count: {
                    select: {
                        bookmarks: true,
                    },
                },
            },
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                created_at: true,
                updated_at: true,
                bookmarks: {
                    select: {
                        id: true,
                        url: true,
                        title: true,
                        description: true,
                        created_at: true,
                        tags: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        console.log('updateUserDto', updateUserDto);
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (updateUserDto.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email },
            });
            if (existingUser && existingUser.id !== id) {
                throw new common_1.ConflictException('User with this email already exists');
            }
        }
        const updateData = {};
        if (updateUserDto.email) {
            updateData.email = updateUserDto.email;
        }
        if (updateUserDto.password) {
            updateData.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        if (updateUserDto.name) {
            updateData.name = updateUserDto.name;
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                created_at: true,
                updated_at: true,
            },
        });
        return updatedUser;
    }
    async activate(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (user.status === client_1.UserStatus.ACTIVE) {
            throw new common_1.BadRequestException('User is already active');
        }
        if (user.status === client_1.UserStatus.BLOCKED) {
            throw new common_1.BadRequestException('Cannot activate a blocked user. Please unblock first.');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { status: client_1.UserStatus.ACTIVE },
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                created_at: true,
                updated_at: true,
            },
        });
        return updatedUser;
    }
    async deactivate(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (user.status !== client_1.UserStatus.ACTIVE) {
            throw new common_1.BadRequestException('Can only deactivate users with ACTIVE status');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { status: client_1.UserStatus.INACTIVE },
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                created_at: true,
                updated_at: true,
            },
        });
        return updatedUser;
    }
    async block(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (user.status === client_1.UserStatus.BLOCKED) {
            throw new common_1.BadRequestException('User is already blocked');
        }
        if (user.status !== client_1.UserStatus.ACTIVE) {
            throw new common_1.BadRequestException('Can only block users with ACTIVE status');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { status: client_1.UserStatus.BLOCKED },
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                created_at: true,
                updated_at: true,
            },
        });
        return updatedUser;
    }
    async unblock(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (user.status !== client_1.UserStatus.BLOCKED) {
            throw new common_1.BadRequestException('Can only unblock users with BLOCKED status');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { status: client_1.UserStatus.ACTIVE },
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                created_at: true,
                updated_at: true,
            },
        });
        return updatedUser;
    }
    async remove(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        await this.prisma.user.delete({
            where: { id },
        });
        return { message: 'User deleted successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map