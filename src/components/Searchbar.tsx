import { useState, useRef, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { searchItems } from '~/utils/search'
import { SearchItem } from '~/data/sampleData'
import { Input } from '~/components/ui/input'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '~/components/ui/command'

export function Searchbar() {
  const [showResults, setShowResults] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = async (value: string) => {
    setSearchQuery(value)
    if (value.length > 0) {
      const results = await searchItems({ data: value })
      setSearchResults(results)
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

  return (
    <div className="relative w-[300px]">
      <div className="relative">
        <Input
          ref={inputRef}
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchQuery.length > 0 && setShowResults(true)}
          className="w-full pr-12"
        />
        <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 dark:bg-gray-800">
          <span className="text-xs">{isMac ? '⌘' : 'Ctrl'}</span> K
        </kbd>
      </div>
      {showResults && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {searchResults.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => {
                      setSearchQuery(item.title)
                      setShowResults(false)
                      inputRef.current?.focus()
                      // You can add navigation or other actions here
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.category}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}
