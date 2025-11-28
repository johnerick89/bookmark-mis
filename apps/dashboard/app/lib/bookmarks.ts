import api from "./api";
import type { Bookmark, CreateBookmarkDto } from "@/app/types";

export const bookmarksService = {
  async getAllBookmarks(): Promise<Bookmark[]> {
    const response = await api.get<Bookmark[]>("/bookmarks");
    return response.data;
  },

  async getBookmarkById(id: string): Promise<Bookmark> {
    const response = await api.get<Bookmark>(`/bookmarks/${id}`);
    return response.data;
  },

  async createBookmark(data: CreateBookmarkDto): Promise<Bookmark> {
    const response = await api.post<Bookmark>("/bookmarks", data);
    return response.data;
  },

  async deleteBookmark(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/bookmarks/${id}`);
    return response.data;
  },
};
