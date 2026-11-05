import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

export interface TocItem {
  id: string
  label: string
}

function scrollToSection(id: string) {
  // Router dùng hash cho đường dẫn nên không thể dùng liên kết #id.
  const target = document.getElementById(id)
  if (!target) return
  target.scrollIntoView({ block: 'start' })
  target.focus({ preventScroll: true })
}

function useActiveSection(items: TocItem[]): string | undefined {
  const [active, setActive] = useState<string>()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-64px 0px -70% 0px' },
    )
    for (const item of items) {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [items])

  return active
}

function TocLinks({ items, active, onPick }: { items: TocItem[]; active?: string; onPick?: () => void }) {
  return (
    <ol className="space-y-0.5 text-sm">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            aria-current={active === item.id ? 'location' : undefined}
            onClick={() => {
              scrollToSection(item.id)
              onPick?.()
            }}
            className={cn(
              'w-full rounded px-2 py-1 text-left transition-colors hover:bg-muted',
              active === item.id ? 'font-medium text-foreground' : 'text-muted-foreground',
            )}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ol>
  )
}

export function ConceptTocRail({ items }: { items: TocItem[] }) {
  const active = useActiveSection(items)
  return (
    <nav aria-label="Mục lục" className="sticky top-16 hidden w-52 shrink-0 self-start xl:block">
      <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Mục lục</p>
      <TocLinks items={items} active={active} />
    </nav>
  )
}

export function ConceptTocCollapsible({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mb-6 rounded-lg border xl:hidden">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium">
        Mục lục
        <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} aria-hidden />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t p-1.5">
        <nav aria-label="Mục lục">
          <TocLinks items={items} onPick={() => setOpen(false)} />
        </nav>
      </CollapsibleContent>
    </Collapsible>
  )
}
