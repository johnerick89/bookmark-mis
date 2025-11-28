// Mock TaggingService before importing BookmarksService
// This avoids issues with ES modules (jsdom, @mozilla/readability, node-nlp, etc.)
jest.mock('./tagging.service', () => ({
  TaggingService: jest.fn().mockImplementation(() => ({
    generateTags: jest.fn().mockResolvedValue([]),
  })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TaggingService } from './tagging.service';
import {
  createMockPrismaService,
  createMockUser,
  createMockBookmark,
  createMockTag,
} from '../test-utils/prisma.mock';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

describe('BookmarksService', () => {
  let service: BookmarksService;
  let prismaService: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prismaService = createMockPrismaService();

    const mockTaggingService = {
      generateTags: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarksService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: TaggingService,
          useValue: mockTaggingService,
        },
      ],
    }).compile();

    service = module.get<BookmarksService>(BookmarksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const userId = 'user-id-1';
    const createBookmarkDto: CreateBookmarkDto = {
      url: 'https://example.com',
      title: 'Example Title',
      description: 'Example Description',
      tags: ['javascript', 'react'],
    };

    it('should successfully create a bookmark with tags', async () => {
      // Mock existing bookmark check - no existing bookmark
      (prismaService.bookmark.findUnique as jest.Mock).mockResolvedValue(null);

      // Mock tag processing - tags don't exist yet
      (prismaService.tag.findUnique as jest.Mock)
        .mockResolvedValueOnce(null) // First tag doesn't exist
        .mockResolvedValueOnce(null); // Second tag doesn't exist

      const mockTag1 = createMockTag({ id: 'tag-1', name: 'javascript' });
      const mockTag2 = createMockTag({ id: 'tag-2', name: 'react' });

      (prismaService.tag.create as jest.Mock)
        .mockResolvedValueOnce(mockTag1)
        .mockResolvedValueOnce(mockTag2);

      const mockUser = createMockUser({ id: userId });
      const mockBookmark = {
        ...createMockBookmark({
          ...createBookmarkDto,
          user_id: userId,
        }),
        tags: [mockTag1, mockTag2],
        user: {
          id: mockUser.id,
          email: mockUser.email,
        },
      };

      (prismaService.bookmark.create as jest.Mock).mockResolvedValue(
        mockBookmark,
      );

      const result = await service.create(createBookmarkDto, userId);

      expect(result).toEqual(mockBookmark);
      expect(prismaService.bookmark.findUnique).toHaveBeenCalledWith({
        where: { url: createBookmarkDto.url },
      });
      expect(prismaService.bookmark.create).toHaveBeenCalledWith({
        data: {
          url: createBookmarkDto.url,
          title: createBookmarkDto.title,
          description: createBookmarkDto.description,
          user_id: userId,
          tags: {
            connect: [{ id: mockTag1.id }, { id: mockTag2.id }],
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
    });

    it('should successfully create a bookmark without tags', async () => {
      const createBookmarkDtoNoTags: CreateBookmarkDto = {
        url: 'https://example.com',
        title: 'Example Title',
        description: 'Example Description',
      };

      (prismaService.bookmark.findUnique as jest.Mock).mockResolvedValue(null);

      const mockUser = createMockUser({ id: userId });
      const mockBookmark = {
        ...createMockBookmark({
          ...createBookmarkDtoNoTags,
          user_id: userId,
        }),
        tags: [],
        user: {
          id: mockUser.id,
          email: mockUser.email,
        },
      };

      (prismaService.bookmark.create as jest.Mock).mockResolvedValue(
        mockBookmark,
      );

      const result = await service.create(createBookmarkDtoNoTags, userId);

      expect(result).toEqual(mockBookmark);
      expect(prismaService.tag.findUnique).not.toHaveBeenCalled();
    });

    it('should connect existing tags instead of creating new ones', async () => {
      (prismaService.bookmark.findUnique as jest.Mock).mockResolvedValue(null);

      const existingTag1 = createMockTag({ id: 'tag-1', name: 'javascript' });
      const existingTag2 = createMockTag({ id: 'tag-2', name: 'react' });

      // Mock tags already exist
      (prismaService.tag.findUnique as jest.Mock)
        .mockResolvedValueOnce(existingTag1)
        .mockResolvedValueOnce(existingTag2);

      const mockUser = createMockUser({ id: userId });
      const mockBookmark = {
        ...createMockBookmark({
          ...createBookmarkDto,
          user_id: userId,
        }),
        tags: [existingTag1, existingTag2],
        user: {
          id: mockUser.id,
          email: mockUser.email,
        },
      };

      (prismaService.bookmark.create as jest.Mock).mockResolvedValue(
        mockBookmark,
      );

      const result = await service.create(createBookmarkDto, userId);

      expect(result).toEqual(mockBookmark);
      expect(prismaService.tag.create).not.toHaveBeenCalled();
      expect(prismaService.bookmark.create).toHaveBeenCalledWith({
        data: {
          url: createBookmarkDto.url,
          title: createBookmarkDto.title,
          description: createBookmarkDto.description,
          user_id: userId,
          tags: {
            connect: [{ id: existingTag1.id }, { id: existingTag2.id }],
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
    });

    it('should throw ConflictException when bookmark URL already exists for the same user', async () => {
      const existingBookmark = createMockBookmark({
        url: createBookmarkDto.url,
        user_id: userId,
      });

      (prismaService.bookmark.findUnique as jest.Mock).mockResolvedValue(
        existingBookmark,
      );

      await expect(service.create(createBookmarkDto, userId)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createBookmarkDto, userId)).rejects.toThrow(
        'Bookmark with this URL already exists',
      );
      expect(prismaService.bookmark.create).not.toHaveBeenCalled();
    });

    it('should allow creating bookmark with same URL for different user', async () => {
      const existingBookmark = createMockBookmark({
        url: createBookmarkDto.url,
        user_id: 'different-user-id',
      });

      (prismaService.bookmark.findUnique as jest.Mock).mockResolvedValue(
        existingBookmark,
      );

      // Mock tag processing for tags in createBookmarkDto
      (prismaService.tag.findUnique as jest.Mock)
        .mockResolvedValueOnce(null) // First tag doesn't exist
        .mockResolvedValueOnce(null); // Second tag doesn't exist

      const mockTag1 = createMockTag({ id: 'tag-1', name: 'javascript' });
      const mockTag2 = createMockTag({ id: 'tag-2', name: 'react' });

      (prismaService.tag.create as jest.Mock)
        .mockResolvedValueOnce(mockTag1)
        .mockResolvedValueOnce(mockTag2);

      const mockUser = createMockUser({ id: userId });
      const mockBookmark = {
        ...createMockBookmark({
          ...createBookmarkDto,
          user_id: userId,
        }),
        tags: [mockTag1, mockTag2],
        user: {
          id: mockUser.id,
          email: mockUser.email,
        },
      };

      (prismaService.bookmark.create as jest.Mock).mockResolvedValue(
        mockBookmark,
      );

      const result = await service.create(createBookmarkDto, userId);

      expect(result).toEqual(mockBookmark);
      expect(prismaService.bookmark.create).toHaveBeenCalled();
    });

    it('should normalize and handle duplicate tag names', async () => {
      const createBookmarkDtoWithDuplicates: CreateBookmarkDto = {
        url: 'https://example.com',
        title: 'Example Title',
        tags: ['JavaScript', 'javascript', '  REACT  '],
      };

      (prismaService.bookmark.findUnique as jest.Mock).mockResolvedValue(null);

      const mockTag1 = createMockTag({ id: 'tag-1', name: 'javascript' });
      const mockTag2 = createMockTag({ id: 'tag-2', name: 'react' });

      (prismaService.tag.findUnique as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockTag1) // Second 'javascript' finds existing
        .mockResolvedValueOnce(null);

      (prismaService.tag.create as jest.Mock)
        .mockResolvedValueOnce(mockTag1)
        .mockResolvedValueOnce(mockTag2);

      const mockUser = createMockUser({ id: userId });
      const mockBookmark = {
        ...createMockBookmark({
          url: createBookmarkDtoWithDuplicates.url,
          title: createBookmarkDtoWithDuplicates.title,
          user_id: userId,
        }),
        tags: [mockTag1, mockTag2],
        user: {
          id: mockUser.id,
          email: mockUser.email,
        },
      };

      (prismaService.bookmark.create as jest.Mock).mockResolvedValue(
        mockBookmark,
      );

      await service.create(createBookmarkDtoWithDuplicates, userId);

      expect(prismaService.bookmark.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all bookmarks when no userId is provided', async () => {
      const mockBookmark1 = createMockBookmark({ id: 'bookmark-1' });
      const mockBookmark2 = createMockBookmark({ id: 'bookmark-2' });

      (prismaService.bookmark.findMany as jest.Mock).mockResolvedValue([
        mockBookmark1,
        mockBookmark2,
      ]);

      const result = await service.findAll();

      expect(result).toEqual([mockBookmark1, mockBookmark2]);
      expect(prismaService.bookmark.findMany).toHaveBeenCalledWith({
        where: {},
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
    });

    it('should return bookmarks filtered by userId', async () => {
      const userId = 'user-id-1';
      const mockBookmark = createMockBookmark({ user_id: userId });

      (prismaService.bookmark.findMany as jest.Mock).mockResolvedValue([
        mockBookmark,
      ]);

      const result = await service.findAll(userId);

      expect(result).toEqual([mockBookmark]);
      expect(prismaService.bookmark.findMany).toHaveBeenCalledWith({
        where: { user_id: userId },
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
    });
  });

  describe('findOne', () => {
    const bookmarkId = 'bookmark-id-1';

    it('should return bookmark when found', async () => {
      const mockBookmark = {
        ...createMockBookmark({ id: bookmarkId }),
        tags: [],
        user: {
          id: 'user-id-1',
          email: 'test@example.com',
        },
      };

      (prismaService.bookmark.findUnique as jest.Mock).mockResolvedValue(
        mockBookmark,
      );

      const result = await service.findOne(bookmarkId);

      expect(result).toEqual(mockBookmark);
      expect(prismaService.bookmark.findUnique).toHaveBeenCalledWith({
        where: { id: bookmarkId },
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
    });

    it('should throw NotFoundException when bookmark is not found', async () => {
      (prismaService.bookmark.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(bookmarkId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne(bookmarkId)).rejects.toThrow(
        `Bookmark with ID ${bookmarkId} not found`,
      );
    });

    it('should allow access when userId matches bookmark owner', async () => {
      const userId = 'user-id-1';
      const mockBookmark = {
        ...createMockBookmark({ id: bookmarkId, user_id: userId }),
        tags: [],
        user: {
          id: userId,
          email: 'test@example.com',
        },
      };

      (prismaService.bookmark.findUnique as jest.Mock).mockResolvedValue(
        mockBookmark,
      );

      const result = await service.findOne(bookmarkId, userId);

      expect(result).toEqual(mockBookmark);
    });

    it('should throw ForbiddenException when userId does not match bookmark owner', async () => {
      const userId = 'user-id-1';
      const otherUserId = 'user-id-2';
      const mockBookmark = {
        ...createMockBookmark({ id: bookmarkId, user_id: otherUserId }),
        tags: [],
        user: {
          id: otherUserId,
          email: 'other@example.com',
        },
      };

      (prismaService.bookmark.findUnique as jest.Mock).mockResolvedValue(
        mockBookmark,
      );

      await expect(service.findOne(bookmarkId, userId)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.findOne(bookmarkId, userId)).rejects.toThrow(
        'You do not have access to this bookmark',
      );
    });
  });

  describe('update', () => {
    const bookmarkId = 'bookmark-id-1';
    const userId = 'user-id-1';
    const updateBookmarkDto: UpdateBookmarkDto = {
      title: 'Updated Title',
      description: 'Updated Description',
    };

    it('should successfully update bookmark', async () => {
      const existingBookmark = createMockBookmark({
        id: bookmarkId,
        user_id: userId,
      });

      const updatedBookmark = {
        ...existingBookmark,
        ...updateBookmarkDto,
        tags: [],
        user: {
          id: userId,
          email: 'test@example.com',
        },
      };

      (prismaService.bookmark.findUnique as jest.Mock)
        .mockResolvedValueOnce(existingBookmark) // Check bookmark exists
        .mockResolvedValueOnce(null); // Check URL uniqueness (if URL was being updated)

      (prismaService.bookmark.update as jest.Mock).mockResolvedValue(
        updatedBookmark,
      );

      const result = await service.update(
        bookmarkId,
        updateBookmarkDto,
        userId,
      );

      expect(result).toEqual(updatedBookmark);
      expect(prismaService.bookmark.update).toHaveBeenCalledWith({
        where: { id: bookmarkId },
        data: {
          title: updateBookmarkDto.title,
          description: updateBookmarkDto.description,
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
    });

    it('should throw NotFoundException when bookmark is not found', async () => {
      (prismaService.bookmark.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.update(bookmarkId, updateBookmarkDto, userId),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.update(bookmarkId, updateBookmarkDto, userId),
      ).rejects.toThrow(`Bookmark with ID ${bookmarkId} not found`);
      expect(prismaService.bookmark.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user does not own the bookmark', async () => {
      const otherUserId = 'user-id-2';
      const existingBookmark = createMockBookmark({
        id: bookmarkId,
        user_id: otherUserId,
      });

      (prismaService.bookmark.findUnique as jest.Mock).mockResolvedValue(
        existingBookmark,
      );

      await expect(
        service.update(bookmarkId, updateBookmarkDto, userId),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.update(bookmarkId, updateBookmarkDto, userId),
      ).rejects.toThrow('You do not have permission to update this bookmark');
      expect(prismaService.bookmark.update).not.toHaveBeenCalled();
    });

    it('should check URL uniqueness when URL is being updated', async () => {
      const existingBookmark = createMockBookmark({
        id: bookmarkId,
        user_id: userId,
        url: 'https://oldurl.com',
      });

      const updateDtoWithUrl: UpdateBookmarkDto = {
        url: 'https://newurl.com',
      };

      (prismaService.bookmark.findUnique as jest.Mock)
        .mockResolvedValueOnce(existingBookmark) // Check bookmark exists
        .mockResolvedValueOnce(null); // Check new URL is available

      const updatedBookmark = {
        ...existingBookmark,
        url: updateDtoWithUrl.url,
        tags: [],
        user: {
          id: userId,
          email: 'test@example.com',
        },
      };

      (prismaService.bookmark.update as jest.Mock).mockResolvedValue(
        updatedBookmark,
      );

      const result = await service.update(bookmarkId, updateDtoWithUrl, userId);

      expect(result).toEqual(updatedBookmark);
      expect(prismaService.bookmark.findUnique).toHaveBeenCalledTimes(2);
    });

    it('should throw ConflictException when updated URL already exists', async () => {
      const existingBookmark = createMockBookmark({
        id: bookmarkId,
        user_id: userId,
        url: 'https://oldurl.com',
      });

      const conflictingBookmark = createMockBookmark({
        url: 'https://newurl.com',
        user_id: 'other-user-id',
      });

      const updateDtoWithUrl: UpdateBookmarkDto = {
        url: 'https://newurl.com',
      };

      (prismaService.bookmark.findUnique as jest.Mock)
        .mockResolvedValueOnce(existingBookmark) // Check bookmark exists
        .mockResolvedValueOnce(conflictingBookmark); // URL already taken

      await expect(
        service.update(bookmarkId, updateDtoWithUrl, userId),
      ).rejects.toThrow(ConflictException);

      expect(prismaService.bookmark.findUnique).toHaveBeenCalledTimes(2);
      expect(prismaService.bookmark.findUnique).toHaveBeenNthCalledWith(1, {
        where: { id: bookmarkId },
      });
      expect(prismaService.bookmark.findUnique).toHaveBeenNthCalledWith(2, {
        where: { url: updateDtoWithUrl.url },
      });
      expect(prismaService.bookmark.update).not.toHaveBeenCalled();
    });

    it('should update tags when provided', async () => {
      const existingBookmark = createMockBookmark({
        id: bookmarkId,
        user_id: userId,
      });

      const updateDtoWithTags: UpdateBookmarkDto = {
        title: 'Updated Title',
        tags: ['new-tag'],
      };

      (prismaService.bookmark.findUnique as jest.Mock).mockResolvedValue(
        existingBookmark,
      );

      const newTag = createMockTag({ id: 'tag-new', name: 'new-tag' });
      (prismaService.tag.findUnique as jest.Mock).mockResolvedValue(null);
      (prismaService.tag.create as jest.Mock).mockResolvedValue(newTag);

      const updatedBookmark = {
        ...existingBookmark,
        title: updateDtoWithTags.title,
        tags: [newTag],
        user: {
          id: userId,
          email: 'test@example.com',
        },
      };

      (prismaService.bookmark.update as jest.Mock).mockResolvedValue(
        updatedBookmark,
      );

      const result = await service.update(
        bookmarkId,
        updateDtoWithTags,
        userId,
      );

      expect(result).toEqual(updatedBookmark);
      expect(prismaService.bookmark.update).toHaveBeenCalledWith({
        where: { id: bookmarkId },
        data: {
          title: updateDtoWithTags.title,
          tags: {
            set: [{ id: newTag.id }],
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
    });
  });

  describe('remove', () => {
    const bookmarkId = 'bookmark-id-1';
    const userId = 'user-id-1';

    it('should successfully delete bookmark', async () => {
      const existingBookmark = createMockBookmark({
        id: bookmarkId,
        user_id: userId,
      });

      (prismaService.bookmark.findUnique as jest.Mock).mockResolvedValue(
        existingBookmark,
      );
      (prismaService.bookmark.delete as jest.Mock).mockResolvedValue(
        existingBookmark,
      );

      const result = await service.remove(bookmarkId, userId);

      expect(result.message).toBe('Bookmark deleted successfully');
      expect(prismaService.bookmark.delete).toHaveBeenCalledWith({
        where: { id: bookmarkId },
      });
    });

    it('should throw NotFoundException when bookmark is not found', async () => {
      (prismaService.bookmark.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(bookmarkId, userId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.remove(bookmarkId, userId)).rejects.toThrow(
        `Bookmark with ID ${bookmarkId} not found`,
      );
      expect(prismaService.bookmark.delete).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user does not own the bookmark', async () => {
      const otherUserId = 'user-id-2';
      const existingBookmark = createMockBookmark({
        id: bookmarkId,
        user_id: otherUserId,
      });

      (prismaService.bookmark.findUnique as jest.Mock).mockResolvedValue(
        existingBookmark,
      );

      await expect(service.remove(bookmarkId, userId)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.remove(bookmarkId, userId)).rejects.toThrow(
        'You do not have permission to delete this bookmark',
      );
      expect(prismaService.bookmark.delete).not.toHaveBeenCalled();
    });
  });
});
