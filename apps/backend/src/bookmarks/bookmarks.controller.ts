import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

type CustomRequest = Request & {
  user: {
    userId: string;
  };
};

@ApiTags('bookmarks')
@Controller('bookmarks')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bookmark' })
  @ApiResponse({ status: 201, description: 'Bookmark created successfully' })
  @ApiResponse({ status: 409, description: 'Bookmark already exists' })
  create(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @Request() req: CustomRequest,
  ) {
    console.log('createBookmarkDto', createBookmarkDto);
    console.log('req.user.userId', req.user.userId);
    return this.bookmarksService.create(createBookmarkDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookmarks' })
  @ApiQuery({
    name: 'all',
    required: false,
    description: 'Get all bookmarks (admin only)',
  })
  @ApiResponse({ status: 200, description: 'List of bookmarks' })
  findAll(@Request() req: CustomRequest, @Query('all') all?: string) {
    const userId = all === 'true' ? undefined : req.user.userId;
    return this.bookmarksService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a bookmark by ID' })
  @ApiParam({ name: 'id', description: 'Bookmark ID' })
  @ApiResponse({ status: 200, description: 'Bookmark found' })
  @ApiResponse({ status: 404, description: 'Bookmark not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findOne(@Param('id') id: string, @Request() req: CustomRequest) {
    return this.bookmarksService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a bookmark' })
  @ApiParam({ name: 'id', description: 'Bookmark ID' })
  @ApiResponse({ status: 200, description: 'Bookmark updated successfully' })
  @ApiResponse({ status: 404, description: 'Bookmark not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'URL already exists' })
  update(
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
    @Request() req: CustomRequest,
  ) {
    return this.bookmarksService.update(id, updateBookmarkDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bookmark' })
  @ApiParam({ name: 'id', description: 'Bookmark ID' })
  @ApiResponse({ status: 200, description: 'Bookmark deleted successfully' })
  @ApiResponse({ status: 404, description: 'Bookmark not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id') id: string, @Request() req: CustomRequest) {
    return this.bookmarksService.remove(id, req.user.userId);
  }
}
