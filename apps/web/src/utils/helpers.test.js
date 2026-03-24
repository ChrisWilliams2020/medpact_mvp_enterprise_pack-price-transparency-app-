import { describe, it, expect, vi } from 'vitest'
import { 
  formatValue, 
  getScoreColor, 
  calculateScore, 
  getProfitColor, 
  getTypeIcon, 
  getTypeColor, 
  searchKCN, 
  exportToCSV 
} from './helpers'

describe('formatValue', () => {
  it('formats currency values correctly', () => {
    expect(formatValue(1000, 'currency')).toBe('$1,000')
    // Note: toLocaleString may not always add trailing zeros
    expect(formatValue(1500.50, 'currency')).toMatch(/^\$1,500\.?5?0?$/)
  })

  it('formats percentage values correctly', () => {
    expect(formatValue(85, 'percent')).toBe('85%')
    expect(formatValue(99.5, 'percent')).toBe('99.5%')
  })

  it('formats number values correctly', () => {
    expect(formatValue(1000, 'number')).toBe('1,000')
  })

  it('formats days values correctly', () => {
    expect(formatValue(30, 'days')).toBe('30 days')
  })

  it('formats ratio values correctly', () => {
    expect(formatValue(2.5, 'ratio')).toBe('2.5:1')
  })

  it('handles null/undefined values', () => {
    expect(formatValue(null, 'currency')).toBe('N/A')
    expect(formatValue(undefined, 'percent')).toBe('N/A')
    expect(formatValue('', 'number')).toBe('N/A')
  })

  it('returns string for unknown unit types', () => {
    expect(formatValue(100, 'unknown')).toBe('100')
  })
})

describe('calculateScore', () => {
  it('calculates score as percentage of benchmark', () => {
    expect(calculateScore(90, 100)).toBe(90)
    expect(calculateScore(100, 100)).toBe(100)
    expect(calculateScore(50, 100)).toBe(50)
  })

  it('rounds to nearest integer', () => {
    expect(calculateScore(33, 100)).toBe(33)
    expect(calculateScore(66.6, 100)).toBe(67)
  })

  it('handles zero benchmark', () => {
    expect(calculateScore(50, 0)).toBe(null)
  })

  it('handles null/undefined values', () => {
    expect(calculateScore(null, 100)).toBe(null)
    expect(calculateScore(50, null)).toBe(null)
    expect(calculateScore(undefined, 100)).toBe(null)
    expect(calculateScore('', 100)).toBe(null)
  })
})

describe('getScoreColor', () => {
  it('returns green for high scores (>=90)', () => {
    expect(getScoreColor(95)).toBe('#10b981')
    expect(getScoreColor(90)).toBe('#10b981')
    expect(getScoreColor(100)).toBe('#10b981')
  })

  it('returns yellow for medium scores (70-89)', () => {
    expect(getScoreColor(75)).toBe('#f59e0b')
    expect(getScoreColor(80)).toBe('#f59e0b')
    expect(getScoreColor(89)).toBe('#f59e0b')
    expect(getScoreColor(70)).toBe('#f59e0b')
  })

  it('returns red for low scores (<70)', () => {
    expect(getScoreColor(60)).toBe('#ef4444')
    expect(getScoreColor(50)).toBe('#ef4444')
    expect(getScoreColor(69)).toBe('#ef4444')
    expect(getScoreColor(0)).toBe('#ef4444')
  })

  it('returns gray for null/undefined', () => {
    expect(getScoreColor(null)).toBe('#64748b')
    expect(getScoreColor(undefined)).toBe('#64748b')
  })
})

describe('getProfitColor', () => {
  it('returns green for high profit (>=80)', () => {
    expect(getProfitColor(90)).toBe('#10b981')
    expect(getProfitColor(80)).toBe('#10b981')
    expect(getProfitColor(100)).toBe('#10b981')
  })

  it('returns yellow for medium profit (60-79)', () => {
    expect(getProfitColor(70)).toBe('#f59e0b')
    expect(getProfitColor(60)).toBe('#f59e0b')
    expect(getProfitColor(79)).toBe('#f59e0b')
  })

  it('returns red for low profit (<60)', () => {
    expect(getProfitColor(50)).toBe('#ef4444')
    expect(getProfitColor(59)).toBe('#ef4444')
    expect(getProfitColor(0)).toBe('#ef4444')
  })

  it('returns gray for null/undefined', () => {
    expect(getProfitColor(null)).toBe('#64748b')
    expect(getProfitColor(undefined)).toBe('#64748b')
  })
})

describe('getTypeIcon', () => {
  it('returns correct icon for known practice types', () => {
    expect(getTypeIcon('ophthalmology')).toBe('👁️')
    expect(getTypeIcon('optometry')).toBe('👓')
    expect(getTypeIcon('general')).toBe('🏥')
    expect(getTypeIcon('retina')).toBe('🔬')
    expect(getTypeIcon('glaucoma')).toBe('💧')
    expect(getTypeIcon('pediatric')).toBe('👶')
  })

  it('handles case insensitivity', () => {
    expect(getTypeIcon('OPHTHALMOLOGY')).toBe('👁️')
    expect(getTypeIcon('Optometry')).toBe('👓')
  })

  it('returns default icon for unknown types', () => {
    expect(getTypeIcon('unknown')).toBe('🏥')
    expect(getTypeIcon('')).toBe('🏥')
  })

  it('handles null/undefined', () => {
    expect(getTypeIcon(null)).toBe('🏥')
    expect(getTypeIcon(undefined)).toBe('🏥')
  })
})

describe('getTypeColor', () => {
  it('returns correct color for known practice types', () => {
    expect(getTypeColor('ophthalmology')).toBe('#6366f1')
    expect(getTypeColor('optometry')).toBe('#8b5cf6')
    expect(getTypeColor('general')).toBe('#64748b')
    expect(getTypeColor('retina')).toBe('#10b981')
    expect(getTypeColor('glaucoma')).toBe('#3b82f6')
    expect(getTypeColor('pediatric')).toBe('#f59e0b')
  })

  it('handles case insensitivity', () => {
    expect(getTypeColor('OPHTHALMOLOGY')).toBe('#6366f1')
  })

  it('returns default color for unknown types', () => {
    expect(getTypeColor('unknown')).toBe('#64748b')
  })

  it('handles null/undefined', () => {
    expect(getTypeColor(null)).toBe('#64748b')
    expect(getTypeColor(undefined)).toBe('#64748b')
  })
})

describe('searchKCN', () => {
  it('returns relevant response for benchmark queries', () => {
    const response = searchKCN('benchmark')
    expect(response.toLowerCase()).toContain('benchmark')
  })

  it('returns relevant response for revenue queries', () => {
    const response = searchKCN('revenue')
    expect(response.toLowerCase()).toContain('revenue')
  })

  it('returns relevant response for competitor queries', () => {
    const response = searchKCN('competitor')
    expect(response.toLowerCase()).toContain('competitive')
  })

  it('returns relevant response for CPT queries', () => {
    const response = searchKCN('cpt')
    expect(response.toLowerCase()).toContain('cpt')
  })

  it('returns relevant response for staffing queries', () => {
    const response = searchKCN('staffing')
    expect(response.toLowerCase()).toContain('staffing')
  })

  it('returns default response for unknown queries', () => {
    const response = searchKCN('xyzabc123')
    expect(response).toContain('I can help you with')
  })

  it('handles invalid input', () => {
    expect(searchKCN(null)).toBe('Please enter a valid search query.')
    expect(searchKCN(undefined)).toBe('Please enter a valid search query.')
    expect(searchKCN(123)).toBe('Please enter a valid search query.')
    expect(searchKCN('')).toBe('Please enter a valid search query.')
  })

  it('handles case insensitivity', () => {
    const response = searchKCN('BENCHMARK')
    expect(response.toLowerCase()).toContain('benchmark')
  })
})

describe('exportToCSV', () => {
  it('handles empty data gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    exportToCSV(null, 'test.csv')
    expect(consoleSpy).toHaveBeenCalledWith('No data to export')
    consoleSpy.mockRestore()
  })

  it('handles empty array gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    exportToCSV([], 'test.csv')
    expect(consoleSpy).toHaveBeenCalledWith('No data to export')
    consoleSpy.mockRestore()
  })

  it('handles non-array data gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    exportToCSV('not an array', 'test.csv')
    expect(consoleSpy).toHaveBeenCalledWith('No data to export')
    consoleSpy.mockRestore()
  })
})
