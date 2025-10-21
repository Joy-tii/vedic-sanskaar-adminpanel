'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { Field, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Strong, Text, TextLink } from '@/components/text'
import { API_BASE_URL } from '@/utils/api'

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setStatus('success')
        setMessage('OTP sent! Check your email inbox.')
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`)
      } else {
        const data = await res.json()
        setStatus('error')
        setMessage(data.message || 'Unable to send OTP.')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
      setMessage('Something went wrong. Try again later.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full max-w-sm grid-cols-1 gap-8 bg-[var(--color-cream)] p-8 rounded-2xl shadow-lg"
    >
      {/* Logo */}
      <div className="flex justify-center">
        <Logo className="h-12 text-[var(--color-saffron)]" />
      </div>

      {/* Heading */}
      <Heading className="text-[var(--color-maroon)] font-semibold text-center">
        Reset your password
      </Heading>

      {/* Subtext */}
      <Text className="text-[var(--color-text-secondary)] text-center">
        Please enter your registered email address. We’ll send you a link to create a new password.
      </Text>

      {/* Email Field */}
      <Field>
        <Label className="text-[var(--color-maroon)] font-medium" htmlFor="email">
          Email Address
        </Label>
        <Input
          type="email"
          name="email"
          id="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="your.email@domain.com"
          className="border-[var(--color-earth)] focus:ring-[var(--color-saffron)] focus:border-[var(--color-saffron)]"
        />
      </Field>

      {/* Submit Button */}
      <Button
        type="submit"
        color="saffron"
        className="w-full font-bold"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Sending...' : 'Send OTP'}
      </Button>

      {/* Message Feedback */}
      {message && (
        <Text
          className={`text-center font-medium ${
            status === 'success'
              ? 'text-[var(--color-saffron)]'
              : 'text-[var(--color-secondary)]'
          }`}
        >
          {message}
        </Text>
      )}

      {/* Footer Link */}
      <Text className="text-[var(--color-maroon)] text-center">
        Don’t have an account?{' '}
        <TextLink
          href="/register"
          className="text-[var(--color-saffron)] hover:text-[var(--color-gold)] transition-colors"
        >
          <Strong>Sign up here</Strong>
        </TextLink>
      </Text>
    </form>
  )
}
