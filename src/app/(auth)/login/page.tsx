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

// rest of file...


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
      const res = await fetch('/api/auth/login', {
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
    } catch {
      setError('Network error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-[var(--bg-card)] p-8 shadow-lg">
        <div className="flex justify-center mb-6">
          <Logo className="h-12 text-[var(--text-main)]" />
        </div>
        <Heading className="text-[var(--text-main)] text-center mb-6 font-serif">
          Sign in to your Vedic Sanskaar account
        </Heading>

        {error && <Text className="mb-4 text-red-600 font-semibold">{error}</Text>}

        <Field>
          <Label className="text-[var(--text-main)]" htmlFor="email">
            Email Address
          </Label>
          <Input
            className="border-[var(--color-earth)] focus:ring-[var(--color-saffron)]"
            type="email"
            id="email"
            name="email"
            required
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </Field>

        <Field>
          <Label className="text-[var(--text-main)]" htmlFor="password">
            Password
          </Label>
          <Input
            className="border-[var(--color-earth)] focus:ring-[var(--color-saffron)]"
            type="password"
            id="password"
            name="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </Field>

        <div className="flex items-center justify-between mb-6 text-[var(--text-main)]">
          <CheckboxField>
            <Checkbox
              id="remember"
              name="remember"
              checked={remember}
              onChange={(checked: boolean) => setRemember(checked)}
              disabled={loading}
            />
            <Label htmlFor="remember">Remember me</Label>
          </CheckboxField>

          <Text>
            <TextLink href="/forgot-password" className="text-[var(--text-accent)] hover:underline">
              <Strong>Forgot password?</Strong>
            </TextLink>
          </Text>
        </div>

        <Button type="submit" className="w-full font-bold" color="maroon" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </Button>

        <Text className="mt-6 text-center text-[var(--text-main)]">
          Don’t have an account?{' '}
          <TextLink href="/register" className="text-[var(--text-accent)] hover:underline">
            <Strong>Sign up</Strong>
          </TextLink>
        </Text>
      </form>
    </div>
  )
}
