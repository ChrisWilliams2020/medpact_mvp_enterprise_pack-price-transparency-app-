const { render, screen } = require('@testing-library/react');
const DashboardMetrics = require('../../components/DashboardMetrics');

test('renders DashboardMetrics component', () => {
	render(<DashboardMetrics />);
	const element = screen.getByText(/some metric text/i);
	expect(element).toBeInTheDocument();
});

test('handles edge case correctly', () => {
	render(<DashboardMetrics metricValue={0} />);
	const element = screen.getByText(/no metrics available/i);
	expect(element).toBeInTheDocument();
});