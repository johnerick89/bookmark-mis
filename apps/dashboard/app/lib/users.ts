import api from "./api";
import type { User } from "@/app/types";

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
}

export const usersService = {
  async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>("/users");
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async createUser(data: CreateUserData): Promise<User> {
    const response = await api.post<User>("/users", data);
    return response.data;
  },

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  },

  async activateUser(id: string): Promise<User> {
    const response = await api.put<User>(`/users/${id}/activate`);
    return response.data;
  },

  async deactivateUser(id: string): Promise<User> {
    const response = await api.put<User>(`/users/${id}/deactivate`);
    return response.data;
  },

  async blockUser(id: string): Promise<User> {
    const response = await api.put<User>(`/users/${id}/block`);
    return response.data;
  },

  async unblockUser(id: string): Promise<User> {
    const response = await api.put<User>(`/users/${id}/unblock`);
    return response.data;
  },
};
