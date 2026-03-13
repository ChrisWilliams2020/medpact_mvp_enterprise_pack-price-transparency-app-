import '@testing-library/jest-dom'

// Provide a minimal EventSource mock for the jsdom test environment
class MockEventSource {
	constructor(url) {
		this.url = url
		this.onmessage = null
		this.onerror = null
	}
	close() {}
}

if (typeof global.EventSource === 'undefined') {
	global.EventSource = MockEventSource
}
