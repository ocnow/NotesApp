import { createServerFn } from '@tanstack/react-start'
import { sampleData, SearchItem } from '~/data/sampleData'
import { getAuth } from 'firebase-admin/auth'

export const searchItems = createServerFn({ method: 'GET' })
  .validator((query: string) => query)
  .handler(async ({ data: query }) => {
    console.log('query received', query)
    if (!query) return []

    const searchQuery = query.toLowerCase()
  
    const result = await getAuth().listUsers();

    const filteredUsers = result.users.filter(user => 
      user.email?.toLowerCase().includes(searchQuery))
    

    return filteredUsers.map(user => ({
      email: user.email,
      uid: user.uid,
    }))
  }) 