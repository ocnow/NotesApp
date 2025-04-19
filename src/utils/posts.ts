import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import axios from 'redaxios'
import { getAuth } from 'firebase-admin/auth'

export type PostType = {
  id: string
  title: string
  body: string
}

export const fetchPost = createServerFn({ method: 'GET' })
  .validator((postId: string) => postId)
  .handler(async ({ data }) => {
    console.info(`Fetching post with id ${data}...`)
    const post = await axios
      .get<PostType>(`https://jsonplaceholder.typicode.com/posts/${data}`)
      .then((r) => r.data)
      .catch((err) => {
        console.error(err)
        if (err.status === 404) {
          throw notFound()
        }
        throw err
      })

    return post
  })

export const fetchPosts = createServerFn({ method: 'GET' }).handler(
  async () => {
    console.info('Fetching posts...')
    await new Promise((r) => setTimeout(r, 1000))
    return axios
      .get<Array<PostType>>('https://jsonplaceholder.typicode.com/posts')
      .then((r) => r.data.slice(0, 10))
  },
)

export const fetchPostsFromFirebase = createServerFn({ method: 'GET' })
  .handler(async ({ context }) => {
    console.info('Fetching posts from Firebase...');
    // Get the current user's UID from the session/context
    const userUid = context?.user?.firebaseUid;
    if (!userUid) {
      throw new Error('Not authenticated');
    }
    // Import Firestore from firebase-admin
    const { getFirestore } = await import('firebase-admin/firestore');
    const db = getFirestore();
    // Query blogs collection where userId == userUid
    const snapshot = await db.collection('blogs').where('userId', '==', userUid).get();
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return posts;
  });