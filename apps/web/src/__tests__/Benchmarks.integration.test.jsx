import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import axios from 'axios'

import Benchmarks from '../pages/Benchmarks.jsx'

vi.mock('axios')

class MockEventSource {
  constructor() { this.onmessage = null }
  close() {}
}

global.EventSource = MockEventSource

test('benchmarks loads catalog and enables calculate when inputs valid', async () => {
  axios.get.mockImplementation((url) => {
    if (url === '/metrics/catalog') return Promise.resolve({ data: { collection_rate: { title: 'Collection', inputs: [{ key: 'allowed_amount', label: 'Allowed Amount', type: 'number', required: true }, { key: 'paid_amount', label: 'Paid Amount', type: 'number', required: true }] } } })
    if (url.startsWith('/metrics/entries')) return Promise.resolve({ data: [] })
    return Promise.resolve({ data: {} })
  })
  axios.post.mockResolvedValue({ data: { value: 0.9, entry: { id: 1 } } })

  render(<Benchmarks />)

  // wait for catalog buttons
  await waitFor(() => expect(screen.getByText('Collection')).toBeInTheDocument())
  fireEvent.click(screen.getByText('Collection'))

  // inputs should render
  await waitFor(() => expect(screen.getByLabelText('Allowed Amount')).toBeInTheDocument())
  fireEvent.change(screen.getByLabelText('Allowed Amount'), { target: { value: '100' } })
  fireEvent.change(screen.getByLabelText('Paid Amount'), { target: { value: '90' } })

  // calculate button should be enabled
  const btn = screen.getByText('Calculate')
  expect(btn).toBeEnabled()

  fireEvent.click(btn)

  await waitFor(() => expect(axios.post).toHaveBeenCalled())
  expect(screen.getByText(/Value/)).toBeInTheDocument()
})
