import { API_BASE_URL } from '@/utils/api'

export async function getUsers() {
  const res = await fetch(`${API_BASE_URL}/api/users`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

export async function getUser(id: string) {
  const res = await fetch(`${API_BASE_URL}/api/users/${id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('User not found')
  return res.json()
}

export async function getUserActivities(id: string) {
  const res = await fetch(`${API_BASE_URL}/api/users/${id}/activities`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}
