export function Logo({ className, ...props }: React.ComponentPropsWithoutRef<'img'>) {
  return (
    <img
      src="/vedic_logo-removebg.png"  // No /public prefix here
      alt="Vedic Sanskaar Logo"
      className={className}
      {...props}
    />
  )
}
