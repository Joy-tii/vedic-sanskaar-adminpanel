// src/components/Stat.tsx
export function Stat({
  title,
  value,
  change,
  className,
}: {
  title: string
  value: string
  change: string
  className?: string
}) {
  return (
    <div className={`p-4 rounded-lg bg-[var(--color-cream)] ${className || ''}`}>
      <p className="text-sm text-[var(--text-main)]">{title}</p>
      <p className="text-xl font-bold text-[var(--color-saffron)]">{value}</p>
      <p className="text-sm text-[var(--text-main)]">{change}</p>
    </div>
  )
}
