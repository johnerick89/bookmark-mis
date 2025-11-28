import api from "./api";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  RegisterResponse,
  User,
} from "@/app/types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>("/auth/profile");
    return response.data;
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    }
  },

  getStoredUser(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("access_token");
    }
    return false;
  },

  async updateProfile(data: { email?: string; name?: string }): Promise<User> {
    const response = await api.patch<User>("/auth/me", data);
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const updatedUser = { ...user, ...response.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }
    return response.data;
  },

  async changePassword(data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      "/auth/change-password",
      data
    );
    return response.data;
  },
};
