import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';

describe('Dashboard', () => {
    test('renders Dashboard component', () => {
        render(<Dashboard />);
        const linkElement = screen.getByText(/dashboard/i);
        expect(linkElement).toBeInTheDocument();
    });

    test('displays metrics correctly', () => {
        render(<Dashboard />);
        const metricsElement = screen.getByTestId('metrics');
        expect(metricsElement).toBeInTheDocument();
    });

    test('handles edge cases', () => {
        render(<Dashboard />);
        // Add specific edge case tests here
    });
});