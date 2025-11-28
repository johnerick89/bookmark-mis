export interface Tag {
  id: string;
  name: string;
  bookmarks?: unknown[];
  _count?: {
    bookmarks: number;
  };
}

export interface CreateTagDto {
  name: string;
}

export interface UpdateTagDto {
  name?: string;
}
