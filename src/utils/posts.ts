import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { useAppSession } from './session'

export type PostPreviewType = {
  id: string
  title: string
}

export type PostType = {
  id : string,
  title : string,
  content : string,
  createdAt : string,
}

export const fetchPostFromFirebase = createServerFn({ method: 'GET' })
.validator((postId: string) => postId)
.handler(async ({ data: postId }): Promise<PostType> => {
  console.info(`Fetching post from Firebase with id: ${postId}`)
  const db = getFirestore()

  const doc = await db.collection('blogs').doc(postId).get();

  if (!doc.exists) {
    console.warn(`Post not found: ${postId}`)
    throw notFound()
  }
  const data = doc.data()!
  const post: PostType = {
    id: data.id,
    title: data.title,
    content: data.content,
    createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
  }

  console.log("Post fetched:", post)
  return post
})

export const fetchPostsFromFirebase = createServerFn({ method: 'GET' })
  .handler(async () : Promise<PostPreviewType[]> => {
    console.info('Fetching posts from Firebase...');
    // Get the current user's UID from the session/context
    const session = useAppSession();
    const userUid = (await session).data.firebaseUid;
    console.log("userUid", userUid);
    const db = getFirestore();
    // Query blogs collection where userId == userUid
    const snapshot = await db.collection('blogs').where('authorId', '==', userUid).get();
    const posts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id : doc.id,
        title : data.title,
      }
    });
    console.log("posts found :", posts);
    return posts;
  });