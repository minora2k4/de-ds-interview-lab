import type { ComponentProps } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router'
import remarkGfm from 'remark-gfm'
import { conceptPath, getConceptEntry } from '@/content/catalog'
import { cn } from '@/lib/utils'

const CONCEPT_LINK_PREFIX = '#concept:'

/** Đổi `[[id]]` và `[[id|nhãn]]` thành liên kết tới trang khái niệm. */
function expandConceptLinks(source: string): string {
  return source.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, id: string, label?: string) => {
    const entry = getConceptEntry(id)
    if (!entry) return label ?? id
    return `[${label ?? entry.title}](${CONCEPT_LINK_PREFIX}${id})`
  })
}

function MarkdownLink({ href, children, ...rest }: ComponentProps<'a'>) {
  if (href?.startsWith(CONCEPT_LINK_PREFIX)) {
    return <Link to={conceptPath(href.slice(CONCEPT_LINK_PREFIX.length))}>{children}</Link>
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" {...rest}>
      {children}
    </a>
  )
}

const components = { a: MarkdownLink }

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn('prose-vi', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {expandConceptLinks(children)}
      </ReactMarkdown>
    </div>
  )
}
