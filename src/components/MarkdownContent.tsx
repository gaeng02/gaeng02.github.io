import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

interface MarkdownContentProps {
  content: string
}

export default async function MarkdownContent({ content }: MarkdownContentProps) {
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content)

  const htmlContent = processedContent.toString()

  return (
    <div
      className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-primary-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-primary-500 prose-blockquote:bg-gray-50 prose-blockquote:py-2"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
