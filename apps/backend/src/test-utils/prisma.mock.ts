import { PrismaService } from '../../prisma/prisma.service';
import { UserStatus, User, Bookmark, Tag } from '../../generated/prisma/client';

/**
 * Creates a mock PrismaService for unit testing
 * This mock can be extended with additional methods as needed
 */
export function createMockPrismaService() {
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
  } as unknown as jest.Mocked<PrismaService>;

  return mockPrismaService;
}

/**
 * Helper function to create mock user data
 */
export function createMockUser(overrides?: Partial<User>) {
  return {
    id: 'user-id-1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword123',
    status: UserStatus.ACTIVE,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
    ...overrides,
  } as User;
}

/**
 * Helper function to create mock bookmark data
 */
export function createMockBookmark(overrides?: Partial<Bookmark>) {
  return {
    id: 'bookmark-id-1',
    url: 'https://example.com',
    title: 'Example Title',
    description: 'Example Description',
    user_id: 'user-id-1',
    embedding: null,
    created_at: new Date('2024-01-01'),
    ...overrides,
  } as Bookmark;
}

/**
 * Helper function to create mock tag data
 */
export function createMockTag(overrides?: Partial<Tag>) {
  return {
    id: 'tag-id-1',
    name: 'javascript',
    created_at: new Date('2024-01-01'),
    ...overrides,
  } as Tag;
}
