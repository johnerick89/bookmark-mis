import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../LoginForm";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { authService } from "@/app/lib/auth";

// Mock the auth service
jest.mock("@/app/lib/auth");
const mockedAuthService = authService as jest.Mocked<typeof authService>;

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe("LoginForm", () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuthService.login = mockLogin;

    // Mock window.location
    delete (window as any).location;
    window.location = { href: "" } as any;
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<AuthProvider>{component}</AuthProvider>);
  };

  it("should render login form with all fields", () => {
    renderWithProvider(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("should update email input value", () => {
    renderWithProvider(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    expect(emailInput.value).toBe("test@example.com");
  });

  it("should update password input value", () => {
    renderWithProvider(<LoginForm />);

    const passwordInput = screen.getByLabelText(
      /password/i
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(passwordInput.value).toBe("password123");
  });

  it("should show loading state when submitting", async () => {
    mockLogin.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithProvider(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    });
  });

  it("should call login function on form submit", async () => {
    const mockUser = {
      id: "user-1",
      email: "test@example.com",
      name: "Test User",
      status: "ACTIVE",
    };

    mockLogin.mockResolvedValue({
      access_token: "token",
      user: mockUser as any,
    });

    renderWithProvider(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen
      .getByRole("button", { name: /sign in/i })
      .closest("form");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("should display error message on login failure", async () => {
    const error = {
      response: {
        data: {
          message: "Invalid credentials",
        },
      },
    };

    mockLogin.mockRejectedValue(error);

    renderWithProvider(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen
      .getByRole("button", { name: /sign in/i })
      .closest("form");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it("should display generic error message when error has no response", async () => {
    mockLogin.mockRejectedValue(new Error("Network error"));

    renderWithProvider(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen
      .getByRole("button", { name: /sign in/i })
      .closest("form");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    });
  });

  it("should require email field", () => {
    renderWithProvider(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute("required");
  });

  it("should require password field", () => {
    renderWithProvider(<LoginForm />);

    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute("required");
  });

  it("should disable submit button while loading", async () => {
    mockLogin.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithProvider(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it("should clear error message on new submission attempt", async () => {
    mockLogin
      .mockRejectedValueOnce({
        response: { data: { message: "First error" } },
      })
      .mockResolvedValueOnce({
        access_token: "token",
        user: { id: "1", email: "test@example.com" } as any,
      });

    renderWithProvider(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen
      .getByRole("button", { name: /sign in/i })
      .closest("form");

    // First submission - error
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrong" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText(/first error/i)).toBeInTheDocument();
    });

    // Second submission - success (error should be cleared)
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.queryByText(/first error/i)).not.toBeInTheDocument();
    });
  });
});
