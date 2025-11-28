import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConfirmModal from "../ConfirmModal";

describe("ConfirmModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: "Confirm Action",
    message: "Are you sure you want to proceed?",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render when isOpen is false", () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText(/confirm action/i)).not.toBeInTheDocument();
  });

  it("should render when isOpen is true", () => {
    render(<ConfirmModal {...defaultProps} />);

    expect(screen.getByText(/confirm action/i)).toBeInTheDocument();
    expect(
      screen.getByText(/are you sure you want to proceed/i)
    ).toBeInTheDocument();
  });

  it("should display custom title and message", () => {
    render(
      <ConfirmModal
        {...defaultProps}
        title="Delete Item"
        message="This action cannot be undone."
      />
    );

    expect(screen.getByText(/delete item/i)).toBeInTheDocument();
    expect(
      screen.getByText(/this action cannot be undone/i)
    ).toBeInTheDocument();
  });

  it("should use default confirm text when not provided", () => {
    render(<ConfirmModal {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: /confirm/i })
    ).toBeInTheDocument();
  });

  it("should use custom confirm text when provided", () => {
    render(<ConfirmModal {...defaultProps} confirmText="Delete" />);

    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /confirm/i })
    ).not.toBeInTheDocument();
  });

  it("should call onConfirm when confirm button is clicked", async () => {
    const onConfirm = jest.fn().mockResolvedValue(undefined);

    render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} />);

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  it("should call onClose after successful confirmation", async () => {
    const onConfirm = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();

    render(
      <ConfirmModal {...defaultProps} onConfirm={onConfirm} onClose={onClose} />
    );

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("should call onClose when cancel button is clicked", () => {
    const onClose = jest.fn();

    render(<ConfirmModal {...defaultProps} onClose={onClose} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should show loading state while confirming", async () => {
    const onConfirm = jest.fn(
      () => new Promise<void>((resolve) => setTimeout(resolve, 100))
    );

    render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} />);

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText(/processing/i)).toBeInTheDocument();
    });
  });

  it("should disable buttons while loading", async () => {
    const onConfirm = jest.fn(
      () => new Promise<void>((resolve) => setTimeout(resolve, 100))
    );

    render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} />);

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(confirmButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });
  });

  it("should handle onConfirm errors gracefully", async () => {
    const onConfirm = jest.fn().mockRejectedValue(new Error("Failed"));
    const onClose = jest.fn();
    // Suppress console.error output during this test
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ConfirmModal {...defaultProps} onConfirm={onConfirm} onClose={onClose} />
    );

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalled();
    });

    // Should not call onClose when error occurs
    expect(onClose).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should use default confirm color when not provided", () => {
    render(<ConfirmModal {...defaultProps} />);

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    expect(confirmButton.className).toContain("bg-red-600");
  });

  it("should use custom confirm color when provided", () => {
    render(
      <ConfirmModal
        {...defaultProps}
        confirmColor="bg-blue-600 hover:bg-blue-700"
      />
    );

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    expect(confirmButton.className).toContain("bg-blue-600");
  });

  it("should not close modal when confirmation throws error", async () => {
    const onConfirm = jest.fn().mockRejectedValue(new Error("Error"));
    const onClose = jest.fn();
    // Suppress console.error output during this test
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ConfirmModal {...defaultProps} onConfirm={onConfirm} onClose={onClose} />
    );

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalled();
    });

    // Wait a bit to ensure onClose is not called
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(onClose).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
