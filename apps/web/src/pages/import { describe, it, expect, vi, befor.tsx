import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper to render with Router
const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
};

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Header', () => {
    it('renders the MedPact logo and brand name', () => {
      renderDashboard();
      expect(screen.getByText('M')).toBeInTheDocument();
      expect(screen.getByText('MedPact')).toBeInTheDocument();
    });

    it('displays practice name from localStorage', () => {
      localStorage.setItem('practice_name', 'Test Eye Clinic');
      renderDashboard();
      expect(screen.getByText('Test Eye Clinic')).toBeInTheDocument();
    });

    it('displays default text when no practice name in localStorage', () => {
      renderDashboard();
      expect(screen.getByText('Practice Dashboard')).toBeInTheDocument();
    });

    it('renders notification bell icon', () => {
      renderDashboard();
      const bellIcon = document.querySelector('svg path[d*="M15 17h5l-1.405"]');
      expect(bellIcon).toBeInTheDocument();
    });

    it('renders Settings link in dropdown', () => {
      renderDashboard();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('renders Sign Out button in dropdown', () => {
      renderDashboard();
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });
  });

  describe('Logout functionality', () => {
    it('clears localStorage and navigates to home on logout', () => {
      localStorage.setItem('access_token', 'test-token');
      localStorage.setItem('practice_id', 'test-id');
      localStorage.setItem('practice_name', 'Test Practice');

      renderDashboard();
      
      const signOutButton = screen.getByText('Sign Out');
      fireEvent.click(signOutButton);

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('practice_id')).toBeNull();
      expect(localStorage.getItem('practice_name')).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Metrics Overview', () => {
    it('displays today\'s collections', () => {
      renderDashboard();
      expect(screen.getByText("Today's Collections")).toBeInTheDocument();
      expect(screen.getByText('$12,847')).toBeInTheDocument();
    });

    it('displays pending claims count', () => {
      renderDashboard();
      expect(screen.getByText('Pending Claims')).toBeInTheDocument();
      expect(screen.getByText('47')).toBeInTheDocument();
    });

    it('displays pending amount', () => {
      renderDashboard();
      expect(screen.getByText('Pending Amount')).toBeInTheDocument();
      expect(screen.getByText('$34,250')).toBeInTheDocument();
    });

    it('displays month revenue', () => {
      renderDashboard();
      expect(screen.getByText('Month Revenue')).toBeInTheDocument();
      expect(screen.getAllByText('$187,432').length).toBeGreaterThan(0);
    });

    it('displays month target', () => {
      renderDashboard();
      expect(screen.getByText('Month Target')).toBeInTheDocument();
      expect(screen.getByText('$204,000')).toBeInTheDocument();
    });

    it('displays denial rate', () => {
      renderDashboard();
      expect(screen.getAllByText('Denial Rate').length).toBeGreaterThan(0);
      expect(screen.getAllByText('6.2%').length).toBeGreaterThan(0);
    });

    it('displays avg days A/R', () => {
      renderDashboard();
      expect(screen.getByText('Avg Days A/R')).toBeInTheDocument();
      expect(screen.getByText('28')).toBeInTheDocument();
    });

    it('displays patients seen', () => {
      renderDashboard();
      expect(screen.getByText('Patients Seen')).toBeInTheDocument();
      expect(screen.getAllByText('24').length).toBeGreaterThan(0);
    });
  });

  describe('Recent Claims', () => {
    it('renders Recent Claims section header', () => {
      renderDashboard();
      expect(screen.getByText('Recent Claims')).toBeInTheDocument();
    });

    it('renders View All link for claims', () => {
      renderDashboard();
      const viewAllLinks = screen.getAllByText('View All');
      expect(viewAllLinks.length).toBeGreaterThan(0);
    });

    it('displays claim table headers', () => {
      renderDashboard();
      expect(screen.getByText('Claim ID')).toBeInTheDocument();
      expect(screen.getByText('Patient')).toBeInTheDocument();
      expect(screen.getByText('CPT Code')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();
    });

    it('displays all recent claims', () => {
      renderDashboard();
      expect(screen.getByText('CLM-2847')).toBeInTheDocument();
      expect(screen.getByText('CLM-2846')).toBeInTheDocument();
      expect(screen.getByText('CLM-2845')).toBeInTheDocument();
      expect(screen.getByText('CLM-2844')).toBeInTheDocument();
      expect(screen.getByText('CLM-2843')).toBeInTheDocument();
    });

    it('displays patient names', () => {
      renderDashboard();
      expect(screen.getByText('Johnson, M.')).toBeInTheDocument();
      expect(screen.getByText('Smith, A.')).toBeInTheDocument();
      expect(screen.getByText('Williams, R.')).toBeInTheDocument();
      expect(screen.getByText('Brown, L.')).toBeInTheDocument();
      expect(screen.getByText('Davis, K.')).toBeInTheDocument();
    });

    it('displays CPT codes', () => {
      renderDashboard();
      expect(screen.getAllByText('92014').length).toBe(2);
      expect(screen.getByText('92134')).toBeInTheDocument();
      expect(screen.getByText('92004')).toBeInTheDocument();
      expect(screen.getByText('92083')).toBeInTheDocument();
    });

    it('displays claim amounts', () => {
      renderDashboard();
      expect(screen.getAllByText('$145').length).toBe(2);
      expect(screen.getByText('$75')).toBeInTheDocument();
      expect(screen.getByText('$195')).toBeInTheDocument();
      expect(screen.getByText('$85')).toBeInTheDocument();
    });
  });

  describe('AI Insights', () => {
    it('renders AI Insights section header', () => {
      renderDashboard();
      expect(screen.getByText('AI Insights')).toBeInTheDocument();
    });

    it('displays underpayment insight', () => {
      renderDashboard();
      expect(screen.getByText('Underpayment Detected')).toBeInTheDocument();
      expect(screen.getByText(/VSP paid \$12 below contracted rate/)).toBeInTheDocument();
      expect(screen.getByText('Review Claims')).toBeInTheDocument();
    });

    it('displays coding opportunity insight', () => {
      renderDashboard();
      expect(screen.getByText('Coding Opportunity')).toBeInTheDocument();
      expect(screen.getByText(/Consider 92083 add-on/)).toBeInTheDocument();
      expect(screen.getByText('View Analysis')).toBeInTheDocument();
    });

    it('displays schedule gap insight', () => {
      renderDashboard();
      expect(screen.getByText('Schedule Gap')).toBeInTheDocument();
      expect(screen.getByText(/Thursday 2-4pm consistently underbooked/)).toBeInTheDocument();
      expect(screen.getByText('View Schedule')).toBeInTheDocument();
    });

    it('displays insight icons', () => {
      renderDashboard();
      expect(screen.getByText('💰')).toBeInTheDocument();
      expect(screen.getByText('📋')).toBeInTheDocument();
      expect(screen.getByText('⏱️')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('renders Overview and Reports tabs', () => {
      renderDashboard();
      expect(screen.getByRole('button', { name: 'Overview' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reports' })).toBeInTheDocument();
    });

    it('shows Overview tab content by default', () => {
      renderDashboard();
      expect(screen.getByText('Practice Overview')).toBeInTheDocument();
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('Total Patients')).toBeInTheDocument();
      expect(screen.getByText('Avg. Revenue/Patient')).toBeInTheDocument();
    });

    it('switches to Reports tab when clicked', () => {
      renderDashboard();
      
      const reportsTab = screen.getByRole('button', { name: 'Reports' });
      fireEvent.click(reportsTab);

      expect(screen.getByText('Financial Reports')).toBeInTheDocument();
      expect(screen.getByText(/Coming soon!/)).toBeInTheDocument();
      expect(screen.getByText('View Reports')).toBeInTheDocument();
    });

    it('switches back to Overview tab when clicked', () => {
      renderDashboard();
      
      // First go to Reports
      fireEvent.click(screen.getByRole('button', { name: 'Reports' }));
      expect(screen.getByText('Financial Reports')).toBeInTheDocument();

      // Then back to Overview
      fireEvent.click(screen.getByRole('button', { name: 'Overview' }));
      expect(screen.getByText('Practice Overview')).toBeInTheDocument();
    });

    it('displays calculated avg revenue per patient', () => {
      renderDashboard();
      // 187432 / 24 = 7809.67
      expect(screen.getByText('$7809.67')).toBeInTheDocument();
    });
  });

  describe('Overview Tab Metrics', () => {
    it('displays Total Revenue card', () => {
      renderDashboard();
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    });

    it('displays Total Patients card', () => {
      renderDashboard();
      expect(screen.getByText('Total Patients')).toBeInTheDocument();
    });

    it('displays Avg. Revenue/Patient card', () => {
      renderDashboard();
      expect(screen.getByText('Avg. Revenue/Patient')).toBeInTheDocument();
    });

    it('displays Denial Rate card in overview', () => {
      renderDashboard();
      const denialRateLabels = screen.getAllByText('Denial Rate');
      expect(denialRateLabels.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Navigation Links', () => {
    it('has link to home page from logo', () => {
      renderDashboard();
      const homeLinks = screen.getAllByRole('link');
      const logoLink = homeLinks.find(link => link.getAttribute('href') === '/');
      expect(logoLink).toBeInTheDocument();
    });

    it('has link to claims page', () => {
      renderDashboard();
      const claimsLink = screen.getByRole('link', { name: 'View All' });
      expect(claimsLink).toHaveAttribute('href', '/claims');
    });

    it('has link to settings page', () => {
      renderDashboard();
      const settingsLink = screen.getByRole('link', { name: 'Settings' });
      expect(settingsLink).toHaveAttribute('href', '/settings');
    });

    it('has link to reports page in Reports tab', () => {
      renderDashboard();
      fireEvent.click(screen.getByRole('button', { name: 'Reports' }));
      
      const reportsLink = screen.getByRole('link', { name: 'View Reports' });
      expect(reportsLink).toHaveAttribute('href', '/reports');
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      renderDashboard();
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBeGreaterThan(0);
    });

    it('buttons are clickable', () => {
      renderDashboard();
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach(button => {
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe('Styling and Layout', () => {
    it('renders with min-h-screen class on container', () => {
      const { container } = renderDashboard();
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('min-h-screen');
    });

    it('renders sticky header', () => {
      renderDashboard();
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('sticky');
    });
  });
});