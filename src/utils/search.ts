import { createServerFn } from '@tanstack/react-start'
import { sampleData, SearchItem } from '~/data/sampleData'

export const searchItems = createServerFn({ method: 'GET' })
  .validator((query: string) => query)
  .handler(async ({ data: query }) => {
    if (!query) return []

    const searchQuery = query.toLowerCase()
    
    return sampleData.filter(item => 
      item.title.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery) ||
      item.category.toLowerCase().includes(searchQuery)
    )
  }) 