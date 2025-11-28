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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarksController = void 0;
const common_1 = require("@nestjs/common");
const bookmarks_service_1 = require("./bookmarks.service");
const create_bookmark_dto_1 = require("./dto/create-bookmark.dto");
const update_bookmark_dto_1 = require("./dto/update-bookmark.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
let BookmarksController = class BookmarksController {
    bookmarksService;
    constructor(bookmarksService) {
        this.bookmarksService = bookmarksService;
    }
    create(createBookmarkDto, req) {
        console.log('createBookmarkDto', createBookmarkDto);
        console.log('req.user.userId', req.user.userId);
        return this.bookmarksService.create(createBookmarkDto, req.user.userId);
    }
    findAll(req, all) {
        const userId = all === 'true' ? undefined : req.user.userId;
        return this.bookmarksService.findAll(userId);
    }
    findOne(id, req) {
        return this.bookmarksService.findOne(id, req.user.userId);
    }
    update(id, updateBookmarkDto, req) {
        return this.bookmarksService.update(id, updateBookmarkDto, req.user.userId);
    }
    remove(id, req) {
        return this.bookmarksService.remove(id, req.user.userId);
    }
};
exports.BookmarksController = BookmarksController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new bookmark' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Bookmark created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Bookmark already exists' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bookmark_dto_1.CreateBookmarkDto, Object]),
    __metadata("design:returntype", void 0)
], BookmarksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all bookmarks' }),
    (0, swagger_1.ApiQuery)({
        name: 'all',
        required: false,
        description: 'Get all bookmarks (admin only)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of bookmarks' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('all')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BookmarksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a bookmark by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Bookmark ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bookmark found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Bookmark not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BookmarksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a bookmark' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Bookmark ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bookmark updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Bookmark not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'URL already exists' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_bookmark_dto_1.UpdateBookmarkDto, Object]),
    __metadata("design:returntype", void 0)
], BookmarksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a bookmark' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Bookmark ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bookmark deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Bookmark not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BookmarksController.prototype, "remove", null);
exports.BookmarksController = BookmarksController = __decorate([
    (0, swagger_1.ApiTags)('bookmarks'),
    (0, common_1.Controller)('bookmarks'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [bookmarks_service_1.BookmarksService])
], BookmarksController);
//# sourceMappingURL=bookmarks.controller.js.map