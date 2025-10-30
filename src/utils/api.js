export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function fetchWithAuth(endpoint, method = 'GET', body = null) {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : null,
  })

  if (!res.ok) {
    const text = await res.text()
    let bodyText
    try {
      bodyText = JSON.stringify(JSON.parse(text))
    } catch {
      bodyText = text
    }
    const err = new Error(`Request failed: ${res.status} ${res.statusText}`)
    err.info = { status: res.status, body: bodyText }
    throw err
  }

  return res.json()
}

// API helpers
export const getPanditBookings = (todayOnly = true, limit = 50) =>
  fetchWithAuth(`/api/pandits/pandit-bookings?todayOnly=${todayOnly}&limit=${limit}`)

export const acceptBooking = (bookingId) =>
  fetchWithAuth(`/api/pandits/accept/${bookingId}`, 'POST')

export const rejectBooking = (bookingId) =>
  fetchWithAuth(`/api/pandits/reject/${bookingId}`, 'POST')
