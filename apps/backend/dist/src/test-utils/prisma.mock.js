"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockPrismaService = createMockPrismaService;
exports.createMockUser = createMockUser;
exports.createMockBookmark = createMockBookmark;
exports.createMockTag = createMockTag;
const client_1 = require("../../generated/prisma/client");
function createMockPrismaService() {
    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        bookmark: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        tag: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    return mockPrismaService;
}
function createMockUser(overrides) {
    return {
        id: 'user-id-1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword123',
        status: client_1.UserStatus.ACTIVE,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
        ...overrides,
    };
}
function createMockBookmark(overrides) {
    return {
        id: 'bookmark-id-1',
        url: 'https://example.com',
        title: 'Example Title',
        description: 'Example Description',
        user_id: 'user-id-1',
        embedding: null,
        created_at: new Date('2024-01-01'),
        ...overrides,
    };
}
function createMockTag(overrides) {
    return {
        id: 'tag-id-1',
        name: 'javascript',
        created_at: new Date('2024-01-01'),
        ...overrides,
    };
}
//# sourceMappingURL=prisma.mock.js.map