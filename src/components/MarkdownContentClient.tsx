'use client'

import { useEffect, useState } from 'react'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

interface MarkdownContentClientProps {
  content: string
}

export default function MarkdownContentClient({ content }: MarkdownContentClientProps) {
  const [htmlContent, setHtmlContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const processMarkdown = async () => {
      try {
        const processedContent = await remark()
          .use(remarkGfm)
          .use(remarkHtml, { sanitize: false })
          .process(content)

        setHtmlContent(processedContent.toString())
      } catch (error) {
        console.error('Error processing markdown:', error)
        setHtmlContent('<p>Error loading content</p>')
      } finally {
        setIsLoading(false)
      }
    }

    if (content) {
      processMarkdown()
    }
  }, [content])

  if (isLoading) {
    return <div className="text-gray-500">Loading...</div>
  }

  return (
    <div
      className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-primary-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-primary-500 prose-blockquote:bg-gray-50 prose-blockquote:py-2"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
