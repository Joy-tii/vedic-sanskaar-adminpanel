"use client";

import React from 'react'
import { Input } from './input'

type Props = {
  length?: number
  onComplete?: (code: string) => void
  className?: string
}

export function OTPInput({ length = 6, onComplete, className }: Props) {
  const [values, setValues] = React.useState<string[]>(() => Array(length).fill(''))
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([])

  function handleChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/\D/g, '').slice(-1)
    const next = [...values]
    next[index] = v
    setValues(next)
    if (v && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
    if (next.every(Boolean)) {
      onComplete?.(next.join(''))
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    const target = e.currentTarget as HTMLInputElement
    if (e.key === 'Backspace' && !target.value && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  return (
    <div className={className ?? 'flex gap-2'}>
      {Array.from({ length }).map((_, i) => (
        <Input
          key={i}
          ref={el => { inputsRef.current[i] = el }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={values[i]}
          onChange={e => handleChange(i, e as React.ChangeEvent<HTMLInputElement>)}
          onKeyDown={e => handleKeyDown(i, e as React.KeyboardEvent<HTMLInputElement>)}
          className="w-12 text-center font-mono"
        />
      ))}
    </div>
  )
}

export default OTPInput
