import api from "./api";
import type { Tag, CreateTagDto } from "@/app/types";

export const tagsService = {
  async getAllTags(): Promise<Tag[]> {
    const response = await api.get<Tag[]>("/tags");
    return response.data;
  },

  async getTagById(id: string): Promise<Tag> {
    const response = await api.get<Tag>(`/tags/${id}`);
    return response.data;
  },

  async createTag(data: CreateTagDto): Promise<Tag> {
    const response = await api.post<Tag>("/tags", data);
    return response.data;
  },
};
