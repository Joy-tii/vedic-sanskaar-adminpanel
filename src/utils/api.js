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
    console.error('API Error:', res.statusText)
    throw new Error(`Request failed: ${res.status}`)
  }

  const data = await res.json()
  return data
}
