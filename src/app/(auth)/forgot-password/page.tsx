'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { Field, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Strong, Text, TextLink } from '@/components/text'

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
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setMessage('OTP sent! Check your email inbox.')
        // OTP sent successfully, navigate to verify-otp page with email param
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`)
      } else {
        const data = await res.json()
        setStatus('error')
        setMessage(data.message || 'Unable to send OTP.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Something went wrong. Try again later.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full max-w-sm grid-cols-1 gap-8 bg-[var(--color-cream)] p-8 rounded-lg shadow-lg"
    >
      <div className="flex justify-center">
        <Logo className="h-12 text-[var(--color-maroon)]" />
      </div>
      <Heading className="text-[var(--color-maroon)] font-serif text-center">
        Reset your password
      </Heading>
      <Text className="text-[var(--color-maroon)] text-center">
        Please enter your registered email address. We will send you a link to create a new password.
      </Text>
      <Field>
        <Label className="text-[var(--color-maroon)]" htmlFor="email">
          Email Address
        </Label>
        <Input
          type="email"
          name="email"
          id="email"
          required
          onChange={e => setEmail(e.target.value)}
          value={email}
          placeholder="your.email@domain.com"
          className="border-[var(--color-earth)] focus:ring-[var(--color-saffron)]"
        />
      </Field>
      <Button type="submit" color="maroon" className="w-full font-bold" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Reset password'}
      </Button>
      {message && 
        <Text className={`text-center ${status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </Text>
      }
      <Text className="text-[var(--color-maroon)] text-center">
        Don’t have an account?{' '}
        <TextLink href="/register" className="text-[var(--color-gold)] hover:underline">
          <Strong>Sign up here</Strong>
        </TextLink>
      </Text>
    </form>
  )
}
