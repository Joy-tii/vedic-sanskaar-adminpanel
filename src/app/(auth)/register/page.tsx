'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Field, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { Strong, Text, TextLink } from '@/components/text'

export default function Register() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('')
  const [subscribe, setSubscribe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          profile: { name, country, subscribe },
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        router.push('/login')
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch {
      setError('Network error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid w-full max-w-sm grid-cols-1 gap-8 bg-[var(--color-cream)] p-8 rounded-lg shadow-lg">
      <div className="flex justify-center">
        <Logo className="h-12 text-[var(--color-maroon)]" />
      </div>
      <Heading className="text-[var(--color-maroon)] font-serif text-center">
        Join the Vedic Sanskaar Community
      </Heading>
      {error && <Text className="mb-4 text-red-600 font-semibold">{error}</Text>}
      <Field>
        <Label className="text-[var(--color-maroon)]" htmlFor="email">Email Address</Label>
        <Input type="email" name="email" id="email" required
          placeholder="your.email@domain.com"
          className="border-[var(--color-earth)] focus:ring-[var(--color-saffron)]"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />
      </Field>
      <Field>
        <Label className="text-[var(--color-maroon)]" htmlFor="name">Full Name</Label>
        <Input type="text" name="name" id="name" required
          placeholder="Your full name"
          className="border-[var(--color-earth)] focus:ring-[var(--color-saffron)]"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={loading}
        />
      </Field>
      <Field>
        <Label className="text-[var(--color-maroon)]" htmlFor="password">Password</Label>
        <Input type="password" name="password" id="password" required
          autoComplete="new-password"
          placeholder="********"
          className="border-[var(--color-earth)] focus:ring-[var(--color-saffron)]"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
        />
      </Field>
      <Field>
        <Label className="text-[var(--color-maroon)]" htmlFor="country">Select Your Country</Label>
        <Select name="country" id="country"
          className="border-[var(--color-earth)] focus:ring-[var(--color-saffron)]"
          required value={country}
          onChange={e => setCountry(e.target.value)}
          disabled={loading}
        >
          <option value="">-- Choose Country --</option>
          <option value="India">India</option>
          <option value="Canada">Canada</option>
          <option value="Mexico">Mexico</option>
          <option value="United States">United States</option>
        </Select>
      </Field>
      <CheckboxField>
        <Checkbox
          name="subscribe"
          id="subscribe"
          checked={subscribe}
          onChange={(checked: boolean) => setSubscribe(checked)}
          disabled={loading}
        />
        <Label className="text-[var(--color-maroon)]" htmlFor="subscribe">
          I wish to receive updates and spiritual insights from the Vedic Sanskaar community.
        </Label>
      </CheckboxField>
      <Button type="submit" color="maroon" className="w-full font-bold" disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
      <Text className="text-[var(--color-maroon)] text-center">
        Already have an account?{' '}
        <TextLink href="/login" className="text-[var(--color-gold)] hover:underline">
          <Strong>Sign in here</Strong>
        </TextLink>
      </Text>
    </form>
  )
}