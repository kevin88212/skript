export default function Logo({ className = '' }) {
  return (
    <a
      href="#main"
      className={`inline-flex items-center gap-1.5 text-h3 font-semibold tracking-tight text-text ${className}`}
    >
      Viral
      <span className="text-primary">Vision</span>
    </a>
  )
}
