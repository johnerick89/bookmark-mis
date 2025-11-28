import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { TagsService } from './tags.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  createMockPrismaService,
  createMockTag,
  createMockBookmark,
  createMockUser,
} from '../test-utils/prisma.mock';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

describe('TagsService', () => {
  let service: TagsService;
  let prismaService: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prismaService = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createTagDto: CreateTagDto = {
      name: 'javascript',
    };

    it('should successfully create a new tag', async () => {
      (prismaService.tag.findUnique as jest.Mock).mockResolvedValue(null);

      const mockTag = {
        ...createMockTag({ name: 'javascript' }),
        _count: {
          bookmarks: 0,
        },
      };

      (prismaService.tag.create as jest.Mock).mockResolvedValue(mockTag);

      const result = await service.create(createTagDto);

      expect(result).toEqual(mockTag);
      expect(prismaService.tag.findUnique).toHaveBeenCalledWith({
        where: { name: 'javascript' },
      });
      expect(prismaService.tag.create).toHaveBeenCalledWith({
        data: { name: 'javascript' },
        include: {
          _count: {
            select: {
              bookmarks: true,
            },
          },
        },
      });
    });

    it('should normalize tag name to lowercase and trim whitespace', async () => {
      const createTagDtoWithWhitespace: CreateTagDto = {
        name: '  JavaScript  ',
      };

      (prismaService.tag.findUnique as jest.Mock).mockResolvedValue(null);

      const mockTag = {
        ...createMockTag({ name: 'javascript' }),
        _count: {
          bookmarks: 0,
        },
      };

      (prismaService.tag.create as jest.Mock).mockResolvedValue(mockTag);

      const result = await service.create(createTagDtoWithWhitespace);

      expect(result).toEqual(mockTag);
      expect(prismaService.tag.findUnique).toHaveBeenCalledWith({
        where: { name: 'javascript' },
      });
      expect(prismaService.tag.create).toHaveBeenCalledWith({
        data: { name: 'javascript' },
        include: {
          _count: {
            select: {
              bookmarks: true,
            },
          },
        },
      });
    });

    it('should throw ConflictException when tag already exists', async () => {
      const existingTag = createMockTag({ name: 'javascript' });
      (prismaService.tag.findUnique as jest.Mock).mockResolvedValue(
        existingTag,
      );

      await expect(service.create(createTagDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createTagDto)).rejects.toThrow(
        'Tag with this name already exists',
      );
      expect(prismaService.tag.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all tags with bookmark counts', async () => {
      const mockTag1 = {
        ...createMockTag({ id: 'tag-1', name: 'javascript' }),
        _count: {
          bookmarks: 5,
        },
      };

      const mockTag2 = {
        ...createMockTag({ id: 'tag-2', name: 'react' }),
        _count: {
          bookmarks: 3,
        },
      };

      (prismaService.tag.findMany as jest.Mock).mockResolvedValue([
        mockTag1,
        mockTag2,
      ]);

      const result = await service.findAll();

      expect(result).toEqual([mockTag1, mockTag2]);
      expect(prismaService.tag.findMany).toHaveBeenCalledWith({
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
    });

    it('should return empty array when no tags exist', async () => {
      (prismaService.tag.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    const tagId = 'tag-id-1';

    it('should return tag with bookmarks when found', async () => {
      const mockBookmark = createMockBookmark({ id: 'bookmark-1' });
      const mockUser = createMockUser({ id: 'user-1' });

      const mockTag = {
        ...createMockTag({ id: tagId }),
        bookmarks: [
          {
            ...mockBookmark,
            user: {
              id: mockUser.id,
              email: mockUser.email,
            },
          },
        ],
        _count: {
          bookmarks: 1,
        },
      };

      (prismaService.tag.findUnique as jest.Mock).mockResolvedValue(mockTag);

      const result = await service.findOne(tagId);

      expect(result).toEqual(mockTag);
      expect(prismaService.tag.findUnique).toHaveBeenCalledWith({
        where: { id: tagId },
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
    });

    it('should throw NotFoundException when tag is not found', async () => {
      (prismaService.tag.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(tagId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(tagId)).rejects.toThrow(
        `Tag with ID ${tagId} not found`,
      );
    });
  });

  describe('findByName', () => {
    const tagName = 'javascript';

    it('should return tag with bookmarks when found', async () => {
      const mockBookmark = createMockBookmark({ id: 'bookmark-1' });
      const mockUser = createMockUser({ id: 'user-1' });

      const mockTag = {
        ...createMockTag({ name: 'javascript' }),
        bookmarks: [
          {
            ...mockBookmark,
            user: {
              id: mockUser.id,
              email: mockUser.email,
            },
          },
        ],
        _count: {
          bookmarks: 1,
        },
      };

      (prismaService.tag.findUnique as jest.Mock).mockResolvedValue(mockTag);

      const result = await service.findByName(tagName);

      expect(result).toEqual(mockTag);
      expect(prismaService.tag.findUnique).toHaveBeenCalledWith({
        where: { name: 'javascript' },
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
    });

    it('should normalize tag name to lowercase and trim whitespace', async () => {
      const mockTag = {
        ...createMockTag({ name: 'javascript' }),
        bookmarks: [],
        _count: {
          bookmarks: 0,
        },
      };

      (prismaService.tag.findUnique as jest.Mock).mockResolvedValue(mockTag);

      await service.findByName('  JavaScript  ');

      expect(prismaService.tag.findUnique).toHaveBeenCalledWith({
        where: { name: 'javascript' },
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
    });

    it('should throw NotFoundException when tag is not found', async () => {
      (prismaService.tag.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findByName(tagName)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findByName(tagName)).rejects.toThrow(
        `Tag with name ${tagName} not found`,
      );
    });
  });

  describe('update', () => {
    const tagId = 'tag-id-1';
    const updateTagDto: UpdateTagDto = {
      name: 'updated-name',
    };

    it('should successfully update tag name', async () => {
      const existingTag = createMockTag({ id: tagId, name: 'old-name' });

      const updatedTag = {
        ...createMockTag({ id: tagId, name: 'updated-name' }),
        _count: {
          bookmarks: 2,
        },
      };

      (prismaService.tag.findUnique as jest.Mock)
        .mockResolvedValueOnce(existingTag) // Check tag exists
        .mockResolvedValueOnce(null); // Check new name is available

      (prismaService.tag.update as jest.Mock).mockResolvedValue(updatedTag);

      const result = await service.update(tagId, updateTagDto);

      expect(result).toEqual(updatedTag);
      expect(prismaService.tag.findUnique).toHaveBeenCalledTimes(2);
      expect(prismaService.tag.update).toHaveBeenCalledWith({
        where: { id: tagId },
        data: { name: 'updated-name' },
        include: {
          _count: {
            select: {
              bookmarks: true,
            },
          },
        },
      });
    });

    it('should normalize tag name to lowercase and trim whitespace', async () => {
      const existingTag = createMockTag({ id: tagId, name: 'old-name' });

      const updatedTag = {
        ...createMockTag({ id: tagId, name: 'updated-name' }),
        _count: {
          bookmarks: 0,
        },
      };

      const updateDtoWithWhitespace: UpdateTagDto = {
        name: '  Updated-Name  ',
      };

      (prismaService.tag.findUnique as jest.Mock)
        .mockResolvedValueOnce(existingTag)
        .mockResolvedValueOnce(null);

      (prismaService.tag.update as jest.Mock).mockResolvedValue(updatedTag);

      const result = await service.update(tagId, updateDtoWithWhitespace);

      expect(result).toEqual(updatedTag);
      expect(prismaService.tag.update).toHaveBeenCalledWith({
        where: { id: tagId },
        data: { name: 'updated-name' },
        include: {
          _count: {
            select: {
              bookmarks: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundException when tag is not found', async () => {
      (prismaService.tag.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(tagId, updateTagDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(tagId, updateTagDto)).rejects.toThrow(
        `Tag with ID ${tagId} not found`,
      );
      expect(prismaService.tag.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when new name is already taken by another tag', async () => {
      const existingTag = createMockTag({ id: tagId, name: 'old-name' });
      const tagWithNewName = createMockTag({
        id: 'other-tag-id',
        name: 'updated-name',
      });

      (prismaService.tag.findUnique as jest.Mock)
        .mockResolvedValueOnce(existingTag) // Check tag exists
        .mockResolvedValueOnce(tagWithNewName); // New name already taken

      await expect(service.update(tagId, updateTagDto)).rejects.toThrow(
        ConflictException,
      );

      expect(prismaService.tag.update).not.toHaveBeenCalled();
    });

    it('should allow updating to the same name', async () => {
      const existingTag = createMockTag({ id: tagId, name: 'same-name' });

      const updateDtoSameName: UpdateTagDto = {
        name: 'same-name',
      };

      (prismaService.tag.findUnique as jest.Mock)
        .mockResolvedValueOnce(existingTag) // Check tag exists
        .mockResolvedValueOnce(existingTag); // Same tag found (no conflict)

      const updatedTag = {
        ...existingTag,
        _count: {
          bookmarks: 0,
        },
      };

      (prismaService.tag.update as jest.Mock).mockResolvedValue(updatedTag);

      const result = await service.update(tagId, updateDtoSameName);

      expect(result).toEqual(updatedTag);
      expect(prismaService.tag.update).toHaveBeenCalled();
    });

    it('should call findOne when name is not provided in update', async () => {
      const existingTag = createMockTag({ id: tagId });
      const tagWithBookmarks = {
        ...existingTag,
        bookmarks: [],
        _count: {
          bookmarks: 0,
        },
      };

      (prismaService.tag.findUnique as jest.Mock)
        .mockResolvedValueOnce(existingTag) // First call in update
        .mockResolvedValueOnce(tagWithBookmarks); // Second call in findOne

      const emptyUpdateDto: UpdateTagDto = {};

      const result = await service.update(tagId, emptyUpdateDto);

      expect(result).toEqual(tagWithBookmarks);
      expect(prismaService.tag.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    const tagId = 'tag-id-1';

    it('should successfully delete tag', async () => {
      const existingTag = createMockTag({ id: tagId });

      (prismaService.tag.findUnique as jest.Mock).mockResolvedValue(
        existingTag,
      );
      (prismaService.tag.delete as jest.Mock).mockResolvedValue(existingTag);

      const result = await service.remove(tagId);

      expect(result.message).toBe('Tag deleted successfully');
      expect(prismaService.tag.findUnique).toHaveBeenCalledWith({
        where: { id: tagId },
      });
      expect(prismaService.tag.delete).toHaveBeenCalledWith({
        where: { id: tagId },
      });
    });

    it('should throw NotFoundException when tag is not found', async () => {
      (prismaService.tag.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(tagId)).rejects.toThrow(NotFoundException);
      await expect(service.remove(tagId)).rejects.toThrow(
        `Tag with ID ${tagId} not found`,
      );
      expect(prismaService.tag.delete).not.toHaveBeenCalled();
    });
  });
});
