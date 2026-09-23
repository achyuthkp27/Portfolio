import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import ErrorBoundary from "../ErrorBoundary";

const ThrowError = () => {
  throw new Error("Test error");
};

const WorkingComponent = () => <div>Test content</div>;

describe("ErrorBoundary", () => {
  // Suppress console.error for error boundary tests
  const originalError = console.error;

  // React rethrows the caught error to window as well; jsdom would print it to the test output
  const swallow = (e: ErrorEvent) => e.preventDefault();
  beforeAll(() => {
    console.error = vi.fn();
    window.addEventListener("error", swallow);
  });

  afterAll(() => {
    console.error = originalError;
    window.removeEventListener("error", swallow);
  });

  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders error UI when error occurs", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/try again/i)).toBeInTheDocument();
  });

  it("shows error details in collapsible section", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Error Details")).toBeInTheDocument();
  });
});
