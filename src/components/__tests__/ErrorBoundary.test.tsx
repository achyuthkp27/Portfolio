import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import ErrorBoundary from '../ErrorBoundary';

const ThrowError = () => {
    throw new Error('Test error');
};

const WorkingComponent = () => <div>Test content</div>;

describe('ErrorBoundary', () => {
    // Suppress console.error for error boundary tests
    const originalError = console.error;

    beforeAll(() => {
        console.error = vi.fn();
    });

    afterAll(() => {
        console.error = originalError;
    });

    it('renders children when no error occurs', () => {
        render(
            <ErrorBoundary>
                <WorkingComponent />
            </ErrorBoundary>
        );

        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders error UI when error occurs', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
        expect(screen.getByText(/try again/i)).toBeInTheDocument();
    });

    it('shows error details in collapsible section', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByText('Error Details')).toBeInTheDocument();
    });
});
