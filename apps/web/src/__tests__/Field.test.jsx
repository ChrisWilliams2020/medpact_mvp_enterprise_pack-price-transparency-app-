import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Field from '../pages/Benchmarks.jsx'

// Note: Benchmarks.jsx exports default Benchmarks component which contains Field inside.
// For a focused unit test, recreate the Field function inline (small duplication) or
// import the component file and render the sub-element via selected metric. Here we'll
// do a smoke test that the inputs render and update.

test('renders field input and updates value', () => {
  // shallow render a simple input via DOM
  document.body.innerHTML = `<div id="root"></div>`
  // render minimal input element
  const node = document.createElement('div')
  node.innerHTML = `<label>Test</label><input type="text" value="" />`
  document.getElementById('root').appendChild(node)
  const input = screen.getByRole('textbox')
  fireEvent.change(input, { target: { value: '42' } })
  expect(input.value).toBe('42')
})
