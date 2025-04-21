import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/postsByuser/$userName/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Please select a post from the list</div>
}
