// ✅ src/utils/api.js
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Helper function for GET requests with token
export async function fetchWithAuth(endpoint) {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })

  if (!res.ok) {
    // Try to read a JSON error body for more informative logging
    let bodyText = null
    try {
      const text = await res.text()
      // try parse JSON but fall back to raw text
      try {
        const parsed = JSON.parse(text)
        bodyText = JSON.stringify(parsed)
      } catch (e) {
        bodyText = text
      }
    } catch (e) {
      bodyText = '<unreadable response body>'
    }

    console.error('API Error:', res.status, res.statusText, bodyText)
    const err = new Error(`Request failed: ${res.status} ${res.statusText}`)
    // attach extra info for callers / dev tools
    err.info = { status: res.status, statusText: res.statusText, body: bodyText }
    throw err
  }

  const data = await res.json()
  return data
}
