/** Renders pre-sanitized markdown HTML inside the design's `.prose` styles. */
export default function ProseHtml({
  html,
  className = '',
}: {
  html: string
  className?: string
}) {
  return (
    <div
      className={`prose ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
