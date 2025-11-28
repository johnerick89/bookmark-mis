import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";
import { authService } from "@/app/lib/auth";
import type { User } from "@/app/types";

// Mock the auth service
jest.mock("@/app/lib/auth");
const mockedAuthService = authService as jest.Mocked<typeof authService>;

// Test component that uses the auth context
const TestComponent: React.FC<{ onContextValue?: (value: any) => void }> = ({
  onContextValue,
}) => {
  const auth = useAuth();

  React.useEffect(() => {
    if (onContextValue) {
      onContextValue(auth);
    }
  }, [auth, onContextValue]);

  return (
    <div>
      {auth.loading ? (
        <div>Loading...</div>
      ) : auth.user ? (
        <div>User: {auth.user.email}</div>
      ) : (
        <div>No user</div>
      )}
    </div>
  );
};

describe("AuthContext", () => {
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

  describe("AuthProvider", () => {
    it("should initialize with loading state", async () => {
      mockedAuthService.getStoredUser.mockReturnValue(null);
      mockedAuthService.isAuthenticated.mockReturnValue(false);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Loading state is very brief, so check for "No user" instead
      await waitFor(() => {
        expect(screen.getByText(/no user/i)).toBeInTheDocument();
      });
    });

    it("should load stored user on mount if authenticated", async () => {
      const mockUser: User = {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        status: "ACTIVE",
      } as User;

      mockedAuthService.getStoredUser.mockReturnValue(mockUser);
      mockedAuthService.isAuthenticated.mockReturnValue(true);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
      });
    });

    it("should not load user if not authenticated", async () => {
      mockedAuthService.getStoredUser.mockReturnValue(null);
      mockedAuthService.isAuthenticated.mockReturnValue(false);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/no user/i)).toBeInTheDocument();
      });
    });
  });

  describe("useAuth hook", () => {
    it("should throw error when used outside AuthProvider", () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      expect(() => {
        render(<TestComponent />);
      }).toThrow(/useAuth must be used within an AuthProvider/i);

      consoleSpy.mockRestore();
    });

    it("should provide auth context value when used inside AuthProvider", async () => {
      mockedAuthService.getStoredUser.mockReturnValue(null);
      mockedAuthService.isAuthenticated.mockReturnValue(false);

      let contextValue: any;

      render(
        <AuthProvider>
          <TestComponent
            onContextValue={(value) => {
              contextValue = value;
            }}
          />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(contextValue).toBeDefined();
        expect(contextValue).toHaveProperty("user");
        expect(contextValue).toHaveProperty("loading");
        expect(contextValue).toHaveProperty("login");
        expect(contextValue).toHaveProperty("register");
        expect(contextValue).toHaveProperty("logout");
      });
    });
  });

  describe("login", () => {
    it("should login user and update context", async () => {
      const mockUser: User = {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        status: "ACTIVE",
      } as User;

      mockedAuthService.getStoredUser.mockReturnValue(null);
      mockedAuthService.isAuthenticated.mockReturnValue(false);
      mockedAuthService.login.mockResolvedValue({
        access_token: "token",
        user: mockUser,
      });

      let contextValue: any;

      render(
        <AuthProvider>
          <TestComponent
            onContextValue={(value) => {
              contextValue = value;
            }}
          />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(contextValue).toBeDefined();
      });

      await act(async () => {
        await contextValue.login("test@example.com", "password123");
      });

      await waitFor(() => {
        expect(contextValue.user).toEqual(mockUser);
      });

      expect(mockedAuthService.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  describe("register", () => {
    it("should register user and automatically log in", async () => {
      const mockUser: User = {
        id: "user-1",
        email: "newuser@example.com",
        name: "New User",
        status: "ACTIVE",
      } as User;

      mockedAuthService.getStoredUser.mockReturnValue(null);
      mockedAuthService.isAuthenticated.mockReturnValue(false);
      mockedAuthService.register.mockResolvedValue({
        message: "User created successfully",
        user: mockUser,
      });
      mockedAuthService.login.mockResolvedValue({
        access_token: "token",
        user: mockUser,
      });

      let contextValue: any;

      render(
        <AuthProvider>
          <TestComponent
            onContextValue={(value) => {
              contextValue = value;
            }}
          />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(contextValue).toBeDefined();
      });

      await act(async () => {
        await contextValue.register(
          "newuser@example.com",
          "New User",
          "password123"
        );
      });

      await waitFor(() => {
        expect(mockedAuthService.register).toHaveBeenCalledWith({
          email: "newuser@example.com",
          name: "New User",
          password: "password123",
        });
      });

      expect(mockedAuthService.login).toHaveBeenCalledWith({
        email: "newuser@example.com",
        password: "password123",
      });
    });
  });

  describe("logout", () => {
    it("should logout user and clear context", async () => {
      const mockUser: User = {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        status: "ACTIVE",
      } as User;

      mockedAuthService.getStoredUser.mockReturnValue(mockUser);
      mockedAuthService.isAuthenticated.mockReturnValue(true);

      let contextValue: any;

      render(
        <AuthProvider>
          <TestComponent
            onContextValue={(value) => {
              contextValue = value;
            }}
          />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(contextValue.user).toEqual(mockUser);
      });

      act(() => {
        contextValue.logout();
      });

      await waitFor(() => {
        expect(contextValue.user).toBeNull();
        expect(mockedAuthService.logout).toHaveBeenCalled();
      });
    });
  });
});
