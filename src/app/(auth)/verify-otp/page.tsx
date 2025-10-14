'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import OTPInput from '@/components/otp-input'
import { API_BASE_URL } from '@/utils/api'

export default function VerifyOtpPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email') || '' // ✅ get email from query
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleOtpComplete(code: string) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // ✅ call backend API
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode: code }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        // ✅ redirect to reset-password page
        setTimeout(() => {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`)
        }, 1000)
      } else {
        setError(data.message || 'Invalid OTP')
      }
    } catch (err) {
      console.error(err)
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto bg-[var(--color-cream)] rounded-lg shadow-lg">
      <h2 className="text-[var(--color-maroon)] mb-4 font-serif text-center text-xl">Verify OTP</h2>

      <OTPInput
        length={6}
        onComplete={handleOtpComplete}
        className="flex gap-2 justify-center"
      />

      {loading && <p className="text-[var(--color-saffron)] mt-2 text-center">Verifying OTP...</p>}
      {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
      {success && <p className="text-green-600 mt-2 text-center">OTP Verified! Redirecting...</p>}
    </div>
  )
}
