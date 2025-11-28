import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupForm from "../SignupForm";
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

describe("SignupForm", () => {
  const mockRegister = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuthService.register = mockRegister;
    mockedAuthService.login = mockLogin;

    // Mock window.location
    delete (window as any).location;
    window.location = { href: "" } as any;
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<AuthProvider>{component}</AuthProvider>);
  };

  it("should render signup form with all fields", () => {
    renderWithProvider(<SignupForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it("should update name input value", () => {
    renderWithProvider(<SignupForm />);

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "John Doe" } });

    expect(nameInput.value).toBe("John Doe");
  });

  it("should update email input value", () => {
    renderWithProvider(<SignupForm />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    expect(emailInput.value).toBe("test@example.com");
  });

  it("should update password input value", () => {
    renderWithProvider(<SignupForm />);

    const passwordInput = screen.getByLabelText(
      /password/i
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(passwordInput.value).toBe("password123");
  });

  it("should show error for password less than 6 characters", async () => {
    renderWithProvider(<SignupForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen
      .getByRole("button", { name: /sign up/i })
      .closest("form");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "12345" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 6 characters/i)
      ).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should call register and login on successful form submit", async () => {
    const mockUser = {
      id: "user-1",
      email: "test@example.com",
      name: "Test User",
      status: "ACTIVE",
    };

    mockRegister.mockResolvedValue({
      message: "User created successfully",
      user: mockUser as any,
    });

    mockLogin.mockResolvedValue({
      access_token: "token",
      user: mockUser as any,
    });

    renderWithProvider(<SignupForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen
      .getByRole("button", { name: /sign up/i })
      .closest("form");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: "test@example.com",
        name: "John Doe",
        password: "password123",
      });
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("should display error message on registration failure", async () => {
    const error = {
      response: {
        data: {
          message: "Email already exists",
        },
      },
    };

    mockRegister.mockRejectedValue(error);

    renderWithProvider(<SignupForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen
      .getByRole("button", { name: /sign up/i })
      .closest("form");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });

  it("should display generic error message when error has no response", async () => {
    mockRegister.mockRejectedValue(new Error("Network error"));

    renderWithProvider(<SignupForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen
      .getByRole("button", { name: /sign up/i })
      .closest("form");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    });
  });

  it("should require name field", () => {
    renderWithProvider(<SignupForm />);

    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput).toHaveAttribute("required");
  });

  it("should require email field", () => {
    renderWithProvider(<SignupForm />);

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute("required");
  });

  it("should require password field", () => {
    renderWithProvider(<SignupForm />);

    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute("required");
  });

  it("should set password minLength to 6", () => {
    renderWithProvider(<SignupForm />);

    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute("minLength", "6");
  });

  it("should show loading state when submitting", async () => {
    mockRegister.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithProvider(<SignupForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    });
  });

  it("should disable submit button while loading", async () => {
    mockRegister.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithProvider(<SignupForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});
