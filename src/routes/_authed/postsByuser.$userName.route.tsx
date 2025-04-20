import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start';
import { getAuth } from 'firebase-admin/auth';
import { postsByUserQueryOptions } from '~/utils/posts'

export const Route = createFileRoute('/_authed/postsByuser/$userName')({
    loader: async({params, context : {queryClient}}) => {
      await queryClient.ensureQueryData(postsByUserQueryOptions(params.userName))
    },
    component: PostsByUserComponent,
  })
  

  function PostsByUserComponent() {
    //get the username from params
    const userName = Route.useParams().userName;
    const {data : posts} = useSuspenseQuery(postsByUserQueryOptions(userName))
  
    return (
      <div className="p-2 flex gap-2">
        <ul className="list-disc pl-4">
          {[...posts, { id: 'i-do-not-exist', title: 'Non-existent Post' }].map(
            (post) => {
              return (
                <li key={post.id} className="whitespace-nowrap">
                  <Link
                    to="/posts/$postId"
                    params={{
                      postId: post.id,
                    }}
                    className="block py-1 text-blue-800 hover:text-blue-600"
                    activeProps={{ className: 'text-black font-bold' }}
                  >
                    <div>{post.title.substring(0, 20)}</div>
                  </Link>
                </li>
              )
            },
          )}
        </ul>
        <hr />
        <Outlet />
      </div>
    )
  }
  