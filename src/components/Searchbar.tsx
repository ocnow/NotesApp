import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
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
import { useQuery } from '@tanstack/react-query'

const LoadingResults = () => {
  return (
            <>
            <CommandItem>
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
            </CommandItem>
            <CommandItem>
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
            </CommandItem>
  </>
  )
}

export function Searchbar() {
  // const [searchResults, setSearchResults] = useState<SearchItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }

      if(e.key === 'Escape') {
        inputRef.current?.blur()
        setShowResults(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = async (value: string) => {
    setSearchQuery(value)
    // if (value.length > 0) {
    //   const results = await searchItems({ data: value })
    //   setSearchResults(results)
    //   setShowResults(true)
    // } else {
    //   setSearchResults([])
    //   setShowResults(false)
    // }
  }

  const { data: searchResults, isLoading,isSuccess,isFetching } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => searchItems({ data: searchQuery }),
    staleTime: 0,
    refetchOnMount : true,
    refetchOnWindowFocus : true,
  })

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

  return (
    <div className="relative w-[300px]">
      <div className="relative">
        <Input
          ref={inputRef}
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => {
            setTimeout(() => setShowResults(false), 200)
          }}
          className="w-full pr-12"
        />
        <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 dark:bg-gray-800">
          <span className="text-xs">{isMac ? '⌘' : 'Ctrl'}</span> K
        </kbd>
      </div>
      {showResults && searchQuery.length > 0 && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {(isLoading || isFetching) && <LoadingResults />}
                {!(isLoading || isFetching) && searchResults && searchResults.map((item) => (
                  <CommandItem
                    key={item.uid}
                    // onSelect={() => {
                    //   console.log('item selected:', item);
                    //   setSearchQuery(item.email?.split("@")[0]!)
                    //   setShowResults(false);
                    //   inputRef.current?.focus()
                    // }}
                  >
                    <Link to="/postsByuser/$userName" params={{ userName: item.email?.split("@")[0]! }} className="flex flex-col w-full">
                      <span className="font-medium">{item.email?.split("@")[0]}</span>
                    </Link>
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
