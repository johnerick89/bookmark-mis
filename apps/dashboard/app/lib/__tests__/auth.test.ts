import { authService } from "../auth";
import api from "../api";
import type { LoginCredentials, RegisterData, User } from "@/app/types";

// Mock the api module
jest.mock("../api");
const mockedApi = api as jest.Mocked<typeof api>;

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset localStorage mocks
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  describe("login", () => {
    const mockCredentials: LoginCredentials = {
      email: "test@example.com",
      password: "password123",
    };

    const mockAuthResponse = {
      access_token: "mock-token",
      user: {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        status: "ACTIVE",
      } as User,
    };

    it("should login successfully and store token and user", async () => {
      mockedApi.post.mockResolvedValue({
        data: mockAuthResponse,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      });

      const result = await authService.login(mockCredentials);

      expect(result).toEqual(mockAuthResponse);
      expect(mockedApi.post).toHaveBeenCalledWith(
        "/auth/login",
        mockCredentials
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "access_token",
        "mock-token"
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify(mockAuthResponse.user)
      );
    });

    it("should handle login errors", async () => {
      const error = new Error("Login failed");
      mockedApi.post.mockRejectedValue(error);

      await expect(authService.login(mockCredentials)).rejects.toThrow(
        "Login failed"
      );
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it("should not store data when window is undefined", async () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      mockedApi.post.mockResolvedValue({
        data: mockAuthResponse,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      });

      const result = await authService.login(mockCredentials);

      expect(result).toEqual(mockAuthResponse);

      global.window = originalWindow;
    });
  });

  describe("register", () => {
    const mockRegisterData: RegisterData = {
      email: "newuser@example.com",
      name: "New User",
      password: "password123",
    };

    const mockRegisterResponse = {
      message: "User created successfully",
      user: {
        id: "user-2",
        email: "newuser@example.com",
        name: "New User",
      } as User,
    };

    it("should register successfully", async () => {
      mockedApi.post.mockResolvedValue({
        data: mockRegisterResponse,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      });

      const result = await authService.register(mockRegisterData);

      expect(result).toEqual(mockRegisterResponse);
      expect(mockedApi.post).toHaveBeenCalledWith(
        "/auth/register",
        mockRegisterData
      );
    });

    it("should handle registration errors", async () => {
      const error = new Error("Registration failed");
      mockedApi.post.mockRejectedValue(error);

      await expect(authService.register(mockRegisterData)).rejects.toThrow(
        "Registration failed"
      );
    });
  });

  describe("getProfile", () => {
    const mockUser: User = {
      id: "user-1",
      email: "test@example.com",
      name: "Test User",
      status: "ACTIVE",
    } as User;

    it("should fetch user profile successfully", async () => {
      mockedApi.get.mockResolvedValue({
        data: mockUser,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      });

      const result = await authService.getProfile();

      expect(result).toEqual(mockUser);
      expect(mockedApi.get).toHaveBeenCalledWith("/auth/profile");
    });

    it("should handle profile fetch errors", async () => {
      const error = new Error("Failed to fetch profile");
      mockedApi.get.mockRejectedValue(error);

      await expect(authService.getProfile()).rejects.toThrow(
        "Failed to fetch profile"
      );
    });
  });

  describe("logout", () => {
    it("should remove token and user from localStorage", () => {
      authService.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith("access_token");
      expect(localStorage.removeItem).toHaveBeenCalledWith("user");
    });

    it("should not throw error when window is undefined", () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      expect(() => authService.logout()).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe("getStoredUser", () => {
    it("should return stored user from localStorage", () => {
      const mockUser = {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
      };

      (localStorage.getItem as jest.Mock).mockReturnValue(
        JSON.stringify(mockUser)
      );

      const result = authService.getStoredUser();

      expect(result).toEqual(mockUser);
      expect(localStorage.getItem).toHaveBeenCalledWith("user");
    });

    it("should return null when no user is stored", () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      const result = authService.getStoredUser();

      expect(result).toBeNull();
    });

    it("should return null when window is undefined", () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const result = authService.getStoredUser();

      expect(result).toBeNull();

      global.window = originalWindow;
    });

    it("should handle invalid JSON gracefully", () => {
      (localStorage.getItem as jest.Mock).mockReturnValue("invalid-json");

      expect(() => authService.getStoredUser()).toThrow();
    });
  });

  describe("isAuthenticated", () => {
    it("should return true when access token exists", () => {
      (localStorage.getItem as jest.Mock).mockReturnValue("mock-token");

      const result = authService.isAuthenticated();

      expect(result).toBe(true);
      expect(localStorage.getItem).toHaveBeenCalledWith("access_token");
    });

    it("should return false when access token does not exist", () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      const result = authService.isAuthenticated();

      expect(result).toBe(false);
    });

    it("should return false when window is undefined", () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const result = authService.isAuthenticated();

      expect(result).toBe(false);

      global.window = originalWindow;
    });
  });

  describe("updateProfile", () => {
    const updateData = {
      email: "updated@example.com",
      name: "Updated Name",
    };

    const mockUpdatedUser: User = {
      id: "user-1",
      email: "updated@example.com",
      name: "Updated Name",
      status: "ACTIVE",
    } as User;

    it("should update profile successfully and update localStorage", async () => {
      const existingUser = {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        status: "ACTIVE",
      };

      (localStorage.getItem as jest.Mock).mockReturnValue(
        JSON.stringify(existingUser)
      );

      mockedApi.patch.mockResolvedValue({
        data: mockUpdatedUser,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      });

      const result = await authService.updateProfile(updateData);

      expect(result).toEqual(mockUpdatedUser);
      expect(mockedApi.patch).toHaveBeenCalledWith("/auth/me", updateData);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify(mockUpdatedUser)
      );
    });

    it("should handle update errors", async () => {
      const error = new Error("Update failed");
      mockedApi.patch.mockRejectedValue(error);

      await expect(authService.updateProfile(updateData)).rejects.toThrow(
        "Update failed"
      );
    });

    it("should not update localStorage when no user exists", async () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      mockedApi.patch.mockResolvedValue({
        data: mockUpdatedUser,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      });

      await authService.updateProfile(updateData);

      // Should not call setItem when no user exists in localStorage
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe("changePassword", () => {
    const changePasswordData = {
      oldPassword: "oldpassword123",
      newPassword: "newpassword123",
    };

    const mockResponse = {
      message: "Password changed successfully",
    };

    it("should change password successfully", async () => {
      mockedApi.post.mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      });

      const result = await authService.changePassword(changePasswordData);

      expect(result).toEqual(mockResponse);
      expect(mockedApi.post).toHaveBeenCalledWith(
        "/auth/change-password",
        changePasswordData
      );
    });

    it("should handle password change errors", async () => {
      const error = new Error("Password change failed");
      mockedApi.post.mockRejectedValue(error);

      await expect(
        authService.changePassword(changePasswordData)
      ).rejects.toThrow("Password change failed");
    });
  });
});
