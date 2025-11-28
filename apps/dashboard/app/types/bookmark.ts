import { Tag } from "./tag";
import { User } from "./user";
export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  user_id: string;
  embedding?: unknown;
  created_at: string;
  tags?: Tag[];
  user?: Partial<User>;
}

export interface CreateBookmarkDto {
  url: string;
  title: string;
  description?: string;
  tags?: string[];
}

export interface UpdateBookmarkDto {
  url?: string;
  title?: string;
  description?: string;
  tags?: string[];
}
