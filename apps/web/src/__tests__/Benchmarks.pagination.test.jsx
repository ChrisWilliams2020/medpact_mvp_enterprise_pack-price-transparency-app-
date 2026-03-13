import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Benchmarks from '../pages/Benchmarks.jsx'
import axios from 'axios'

vi.mock('axios')

test('paginates entries', async () => {
  const fakeEntries = Array.from({length:25}).map((_,i) => ({ id: i+1, metric_key: 'm', created_at: new Date().toISOString(), payload: { v: i+1 } }))
  axios.get.mockImplementation((url) => {
    if (url === '/metrics/catalog') return Promise.resolve({ data: {} })
    if (url.startsWith('/metrics/entries')) return Promise.resolve({ data: fakeEntries })
    return Promise.resolve({ data: {} })
  })
  render(<Benchmarks />)
  // entries should show page 1
  expect(await screen.findByText('Page 1')).toBeInTheDocument()
  fireEvent.click(screen.getByText('Next'))
  expect(screen.getByText('Page 2')).toBeInTheDocument()
})
