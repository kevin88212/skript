const POSITIONS = {
  'top-left': 'top-0 left-0 border-t border-l',
  'top-right': 'top-0 right-0 border-t border-r',
  'bottom-left': 'bottom-0 left-0 border-b border-l',
  'bottom-right': 'bottom-0 right-0 border-b border-r',
}

export default function CornerBrackets({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {Object.entries(POSITIONS).map(([position, edgeClasses]) => (
        <span
          key={position}
          className={`absolute h-4 w-4 md:h-5 md:w-5 border-border-strong/70 ${edgeClasses}`}
        />
      ))}
    </div>
  )
}
