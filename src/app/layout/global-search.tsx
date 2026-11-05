import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { conceptPath, TOPICS } from '@/content/catalog'
import { normalizeText } from '@/domain/text/normalize'

function matchScore(value: string, search: string): number {
  const haystack = normalizeText(value)
  return normalizeText(search)
    .split(' ')
    .every((word) => haystack.includes(word))
    ? 1
    : 0
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const groups = useMemo(
    () =>
      TOPICS.map((topic) => ({
        id: topic.id,
        title: topic.title,
        concepts: topic.subtopics.flatMap((s) => s.concepts),
      })),
    [],
  )

  const go = (conceptId: string) => {
    setOpen(false)
    navigate(conceptPath(conceptId))
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-9 justify-start px-2 text-muted-foreground sm:w-56"
        aria-label="Tìm kiếm khái niệm"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4 shrink-0" aria-hidden />
        <span className="hidden flex-1 truncate text-left font-normal sm:inline">Tìm khái niệm...</span>
        <kbd className="hidden rounded border px-1 text-[0.625rem] sm:inline">Ctrl K</kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Tìm kiếm khái niệm"
        description="Nhập tên khái niệm, có dấu hoặc không dấu"
      >
        <Command filter={matchScore}>
          <CommandInput placeholder="Nhập tên khái niệm, có dấu hoặc không dấu..." className="text-base sm:text-sm" />
          <CommandList className="max-h-[60dvh]">
            <CommandEmpty>Không tìm thấy khái niệm phù hợp.</CommandEmpty>
            {groups.map((group) => (
              <CommandGroup key={group.id} heading={group.title}>
                {group.concepts.map((concept) => (
                  <CommandItem
                    key={concept.id}
                    value={`${concept.title} ${concept.viTitle ?? ''} ${group.title} ${concept.id}`}
                    onSelect={() => go(concept.id)}
                  >
                    <span className="truncate">{concept.title}</span>
                    {concept.viTitle && (
                      <span className="ml-1 truncate text-xs text-muted-foreground">
                        {concept.viTitle}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
