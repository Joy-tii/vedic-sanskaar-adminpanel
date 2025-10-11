"use client";

import OTPInput from '@/components/otp-input'
import { useState } from 'react'

export default function VerifyOtpPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const email = 'user@example.com' // ideally user se input ya context me lein

  async function handleOtpComplete(code: string) {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode: code }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        // aage password reset page redirect ya UI dikhayein
      } else {
        setError(data.message || 'Invalid OTP')
      }
    } catch {
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
      {success && <p className="text-green-600 mt-2 text-center">OTP Verified! You can reset your password.</p>}
    </div>
  )
}
