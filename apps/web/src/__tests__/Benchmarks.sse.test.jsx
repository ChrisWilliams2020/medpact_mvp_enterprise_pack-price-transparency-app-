import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import Benchmarks from '../pages/Benchmarks.jsx'
import axios from 'axios'

vi.mock('axios')

let handlers = []
class FakeES {
  constructor() { this.onmessage = null; handlers.push(this) }
  close() {}
}
global.EventSource = FakeES

test('sse updates last job and refreshes entries', async () => {
  axios.get.mockImplementation((url) => {
    if (url === '/metrics/catalog') return Promise.resolve({ data: {} })
    if (url.startsWith('/metrics/entries')) return Promise.resolve({ data: [] })
    return Promise.resolve({ data: {} })
  })
  render(<Benchmarks />)
  // simulate SSE message
  await waitFor(() => handlers.length > 0)
  const es = handlers[0]
  const msg = { job_id: '1', status: 'running', metric: 'collection_rate' }
  es.onmessage && es.onmessage({ data: JSON.stringify(msg) })
  await waitFor(() => expect(screen.getByText(/running/)).toBeInTheDocument())
})
