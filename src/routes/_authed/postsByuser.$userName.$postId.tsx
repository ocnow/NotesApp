import { createFileRoute } from '@tanstack/react-router'
import { fetchPostFromFirebase } from '~/utils/posts'
import { PostErrorComponent } from './posts.$postId'

export const Route = createFileRoute('/_authed/postsByuser/$userName/$postId')({
  loader : ({params : {userName, postId}}) => fetchPostFromFirebase({data : postId}),
  errorComponent: PostErrorComponent,
  component: PostByUserComponent,
})

function PostByUserComponent() {
  const post = Route.useLoaderData()

  return (
    <div className="space-y-2">
      <h4 className="text-xl font-bold underline">{post.title}</h4>
      <div className="text-sm">{post.content}</div>
      <div className="text-sm">{post.createdAt}</div> 
    </div>
  )
}