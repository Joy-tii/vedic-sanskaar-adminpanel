'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Field, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Strong, Text, TextLink } from '@/components/text'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (res.ok && data.data?.tokens) {
        localStorage.setItem('accessToken', data.data.tokens.accessToken)
        localStorage.setItem('refreshToken', data.data.tokens.refreshToken)
        router.push('/')
      } else {
        setError(data.message || 'Invalid login credentials')
      }
    } catch (err) {
      setError('Network error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
      <form className="w-full max-w-md rounded-2xl bg-[var(--bg-card)] p-8 shadow-lg" onSubmit={handleSubmit}>
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo className="h-12 text-[var(--color-saffron)]" />
        </div>

        {/* Heading */}
        <Heading className="text-[var(--color-gold)] text-center mb-6 font-serif">
          Sign in to your Vedic Sanskaar account
        </Heading>

        {/* Error Message */}
        {error && (
          <Text className="mb-4 text-center text-[var(--color-error)] font-medium">
            {error}
          </Text>
        )}

        {/* Email Field */}
        <Field>
          <Label className="text-[var(--color-maroon)] font-medium" htmlFor="email">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            required
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="border-[var(--color-earth)] focus:ring-[var(--color-saffron)] focus:border-[var(--color-saffron)]"
          />
        </Field>

        {/* Password Field */}
        <Field>
          <Label className="text-[var(--color-maroon)] font-medium" htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="border-[var(--color-earth)] focus:ring-[var(--color-saffron)] focus:border-[var(--color-saffron)]"
          />
        </Field>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between mb-6 text-[var(--color-text)]">
          <CheckboxField>
            <Checkbox
              id="remember"
              name="remember"
              checked={remember}
              onChange={(checked) => setRemember(checked)}
              disabled={loading}
            />
            <Label htmlFor="remember">Remember me</Label>
          </CheckboxField>

          <Text>
            <TextLink href="/forgot-password" className="text-[var(--color-accent)] hover:text-[var(--color-gold)] transition-colors">
              <Strong>Forgot password?</Strong>
            </TextLink>
          </Text>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full font-bold" color="saffron" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </Button>

        {/* Footer Link */}
        <Text className="mt-6 text-center text-[var(--color-text)]">
          Don’t have an account?{' '}
          <TextLink href="/register" className="text-[var(--color-accent)] hover:text-[var(--color-gold)] transition-colors">
            <Strong>Sign up</Strong>
          </TextLink>
        </Text>
      </form>
    </div>
  )
}
