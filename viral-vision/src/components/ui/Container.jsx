const SIZE_CLASSES = {
  narrow: 'max-w-(--container-narrow)',
  default: 'max-w-(--container-default)',
  wide: 'max-w-(--container-wide)',
}

export default function Container({ as: Tag = 'div', size = 'default', className = '', children, ...rest }) {
  return (
    <Tag
      className={`mx-auto w-full px-6 md:px-8 lg:px-12 ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
