import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Benchmarks from './Benchmarks'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
}
global.localStorage = localStorageMock

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn()

describe('Benchmarks Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockClear()
    localStorageMock.clear.mockClear()
  })

  describe('Registration Wizard', () => {
    it('shows registration wizard for new users', () => {
      render(<Benchmarks />)
      expect(screen.getByText('Welcome to MedPact')).toBeInTheDocument()
    })

    it('allows skipping registration with demo mode', async () => {
      render(<Benchmarks />)
      const skipButton = screen.getByText('Skip (Demo)')
      await userEvent.click(skipButton)
      expect(screen.getByText('Practice Intelligence Dashboard')).toBeInTheDocument()
    })

    it('progresses through registration steps', async () => {
      render(<Benchmarks />)
      expect(screen.getByText(/Step 1 of/)).toBeInTheDocument()
      
      const continueButton = screen.getByText('Continue')
      await userEvent.click(continueButton)
      
      expect(screen.getByText(/Step 2 of/)).toBeInTheDocument()
    })

    it('shows back button after first step', async () => {
      render(<Benchmarks />)
      expect(screen.queryByText('Back')).not.toBeInTheDocument()
      
      const continueButton = screen.getByText('Continue')
      await userEvent.click(continueButton)
      
      expect(screen.getByText('Back')).toBeInTheDocument()
    })

    it('can go back to previous step', async () => {
      render(<Benchmarks />)
      
      const continueButton = screen.getByText('Continue')
      await userEvent.click(continueButton)
      expect(screen.getByText(/Step 2 of/)).toBeInTheDocument()
      
      const backButton = screen.getByText('Back')
      await userEvent.click(backButton)
      expect(screen.getByText(/Step 1 of/)).toBeInTheDocument()
    })
  })

  describe('Main Dashboard', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ name: 'Test Practice' }))
    })

    it('renders dashboard with practice name', () => {
      render(<Benchmarks />)
      expect(screen.getByText(/Test Practice/)).toBeInTheDocument()
    })

    it('shows all navigation tabs', () => {
      render(<Benchmarks />)
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('AI Insights')).toBeInTheDocument()
      expect(screen.getByText('Campaigns')).toBeInTheDocument()
      expect(screen.getByText('Competitors')).toBeInTheDocument()
      expect(screen.getByText('Heat Map')).toBeInTheDocument()
      expect(screen.getByText('CPT Codes')).toBeInTheDocument()
      expect(screen.getByText('OnPacePlus')).toBeInTheDocument()
      expect(screen.getByText('KCN Chat')).toBeInTheDocument()
      expect(screen.getByText('CSV Hub')).toBeInTheDocument()
      expect(screen.getByText('Profile')).toBeInTheDocument()
    })

    it('switches tabs when clicked', async () => {
      render(<Benchmarks />)
      
      const aiTab = screen.getByText('AI Insights')
      await userEvent.click(aiTab)
      
      expect(screen.getByText(/AI-Powered Insights/)).toBeInTheDocument()
    })

    it('shows metric package selector', () => {
      render(<Benchmarks />)
      expect(screen.getByText(/Select Metric Package/)).toBeInTheDocument()
    })
  })

  describe('AI Insights Tab', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ name: 'Test Practice' }))
    })

    it('displays revenue opportunities section', async () => {
      render(<Benchmarks />)
      
      const aiTab = screen.getByText('AI Insights')
      await userEvent.click(aiTab)
      
      expect(screen.getByText(/Revenue Opportunities/)).toBeInTheDocument()
    })

    it('displays top quartile section', async () => {
      render(<Benchmarks />)
      
      const aiTab = screen.getByText('AI Insights')
      await userEvent.click(aiTab)
      
      expect(screen.getByText(/Top Quartile/)).toBeInTheDocument()
    })
  })

  describe('Campaigns Tab', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ name: 'Test Practice' }))
    })

    it('displays campaign builder', async () => {
      render(<Benchmarks />)
      
      const campaignsTab = screen.getByText('Campaigns')
      await userEvent.click(campaignsTab)
      
      expect(screen.getByText(/Campaign Builder/)).toBeInTheDocument()
    })

    it('shows platform selection', async () => {
      render(<Benchmarks />)
      
      const campaignsTab = screen.getByText('Campaigns')
      await userEvent.click(campaignsTab)
      
      expect(screen.getByText('Facebook')).toBeInTheDocument()
      expect(screen.getByText('Instagram')).toBeInTheDocument()
      expect(screen.getByText('Google Ads')).toBeInTheDocument()
    })
  })

  describe('Competitors Tab', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ name: 'Test Practice' }))
    })

    it('displays competitor section', async () => {
      render(<Benchmarks />)
      
      const competitorsTab = screen.getByText('Competitors')
      await userEvent.click(competitorsTab)
      
      expect(screen.getByText('Competitive Intelligence')).toBeInTheDocument()
    })

    it('displays filter options', async () => {
      render(<Benchmarks />)
      
      const competitorsTab = screen.getByText('Competitors')
      await userEvent.click(competitorsTab)
      
      expect(screen.getByText('all')).toBeInTheDocument()
    })
  })

  describe('Heat Map Tab', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ name: 'Test Practice' }))
    })

    it('displays heat map section', async () => {
      render(<Benchmarks />)
      
      const heatmapTab = screen.getByText('Heat Map')
      await userEvent.click(heatmapTab)
      
      expect(screen.getByText('Patient Location Heat Map')).toBeInTheDocument()
    })
  })

  describe('CPT Codes Tab', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ name: 'Test Practice' }))
    })

    it('displays CPT codes section', async () => {
      render(<Benchmarks />)
      
      const cptTab = screen.getByText('CPT Codes')
      await userEvent.click(cptTab)
      
      expect(screen.getByText('Price Transparency')).toBeInTheDocument()
    })

    it('shows All filter by default', async () => {
      render(<Benchmarks />)
      
      const cptTab = screen.getByText('CPT Codes')
      await userEvent.click(cptTab)
      
      expect(screen.getByText('All')).toBeInTheDocument()
    })
  })

  describe('Innovations Tab', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ name: 'Test Practice' }))
    })

    it('displays innovations section', async () => {
      render(<Benchmarks />)
      
      const innovationsTab = screen.getByText('OnPacePlus')
      await userEvent.click(innovationsTab)
      
      expect(screen.getByText(/Innovation Tracker/)).toBeInTheDocument()
    })
  })

  describe('Chat Tab', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ name: 'Test Practice' }))
    })

    it('displays chat interface', async () => {
      render(<Benchmarks />)
      
      const chatTab = screen.getByText('KCN Chat')
      await userEvent.click(chatTab)
      
      expect(screen.getByText(/KCN Intelligence Chat/)).toBeInTheDocument()
    })

    it('has input field for messages', async () => {
      render(<Benchmarks />)
      
      const chatTab = screen.getByText('KCN Chat')
      await userEvent.click(chatTab)
      
      expect(screen.getByPlaceholderText(/Ask about metrics/)).toBeInTheDocument()
    })

    it('has send button', async () => {
      render(<Benchmarks />)
      
      const chatTab = screen.getByText('KCN Chat')
      await userEvent.click(chatTab)
      
      expect(screen.getByText('Send')).toBeInTheDocument()
    })

    it('shows welcome message', async () => {
      render(<Benchmarks />)
      
      const chatTab = screen.getByText('KCN Chat')
      await userEvent.click(chatTab)
      
      expect(screen.getByText(/Welcome to KCN Intelligence/)).toBeInTheDocument()
    })
  })

  describe('CSV Hub Tab', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ name: 'Test Practice' }))
    })

    it('displays CSV hub title', async () => {
      render(<Benchmarks />)
      
      const csvTab = screen.getByText('CSV Hub')
      await userEvent.click(csvTab)
      
      expect(screen.getByText('CSV Data Hub')).toBeInTheDocument()
    })

    it('displays import section', async () => {
      render(<Benchmarks />)
      
      const csvTab = screen.getByText('CSV Hub')
      await userEvent.click(csvTab)
      
      expect(screen.getByText(/Import CSV/)).toBeInTheDocument()
    })

    it('displays export section', async () => {
      render(<Benchmarks />)
      
      const csvTab = screen.getByText('CSV Hub')
      await userEvent.click(csvTab)
      
      expect(screen.getByText(/Export Metrics/)).toBeInTheDocument()
    })

    it('has upload button', async () => {
      render(<Benchmarks />)
      
      const csvTab = screen.getByText('CSV Hub')
      await userEvent.click(csvTab)
      
      expect(screen.getByText(/Upload CSV/)).toBeInTheDocument()
    })

    it('has download button', async () => {
      render(<Benchmarks />)
      
      const csvTab = screen.getByText('CSV Hub')
      await userEvent.click(csvTab)
      
      expect(screen.getByText('Download CSV')).toBeInTheDocument()
    })
  })

  describe('Profile Tab', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ name: 'Test Practice', type: 'Ophthalmology' }))
    })

    it('displays practice profile title', async () => {
      render(<Benchmarks />)
      
      const profileTab = screen.getByText('Profile')
      await userEvent.click(profileTab)
      
      expect(screen.getByText('Practice Profile')).toBeInTheDocument()
    })

    it('displays practice name in profile', async () => {
      render(<Benchmarks />)
      
      const profileTab = screen.getByText('Profile')
      await userEvent.click(profileTab)
      
      // Use getAllByText since name appears multiple times, then check at least one exists
      const practiceNames = screen.getAllByText('Test Practice')
      expect(practiceNames.length).toBeGreaterThan(0)
    })

    it('has edit profile button', async () => {
      render(<Benchmarks />)
      
      const profileTab = screen.getByText('Profile')
      await userEvent.click(profileTab)
      
      expect(screen.getByText('Edit Profile')).toBeInTheDocument()
    })

    it('has reset all button', async () => {
      render(<Benchmarks />)
      
      const profileTab = screen.getByText('Profile')
      await userEvent.click(profileTab)
      
      expect(screen.getByText('Reset All')).toBeInTheDocument()
    })

    it('clicking edit profile shows registration wizard', async () => {
      render(<Benchmarks />)
      
      const profileTab = screen.getByText('Profile')
      await userEvent.click(profileTab)
      
      const editButton = screen.getByText('Edit Profile')
      await userEvent.click(editButton)
      
      expect(screen.getByText('Welcome to MedPact')).toBeInTheDocument()
    })

    it('clicking reset all clears localStorage', async () => {
      render(<Benchmarks />)
      
      const profileTab = screen.getByText('Profile')
      await userEvent.click(profileTab)
      
      const resetButton = screen.getByText('Reset All')
      await userEvent.click(resetButton)
      
      expect(localStorageMock.clear).toHaveBeenCalled()
    })
  })
})
