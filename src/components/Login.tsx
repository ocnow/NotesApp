import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { loginFn } from '../routes/_authed'
import { Auth } from './Auth'
import { signupFn } from '~/routes/signup'
import { useMutation } from '@tanstack/react-query'
  
export function Login() {
  const router = useRouter()

  const loginMutation = useMutation({
    mutationFn : loginFn,
    onSuccess: async (ctx) => {
      if (!ctx.error) {
        await router.invalidate()
        router.navigate({ to: '/' })
        return
      }
    },
  })

  const signupMutation = useMutation({
    mutationFn : useServerFn(signupFn),
  })

  return (
    <Auth
      actionText="Login"
      status={loginMutation.status}
      onSubmit={(e) => {
        const formData = new FormData(e.target as HTMLFormElement)
        loginMutation.mutate({data : {
          email: formData.get('email') as string,
          password: formData.get('password') as string,
        }})
      }}
      afterSubmit={
        loginMutation.data ? (
          <>
            <div className="text-red-400">{loginMutation.data.message}</div>
            {loginMutation.data.error && loginMutation.data.userNotFound?  (
              <div>
                <button
                  className="text-blue-500"
                  onClick={(e) => {
                    const formData = new FormData(
                      (e.target as HTMLButtonElement).form!,
                    )

                    signupMutation.mutate({
                      data: {
                        email: formData.get('email') as string,
                        password: formData.get('password') as string,
                      },
                    })
                  }}
                  type="button"
                >
                  Sign up instead?
                </button>
              </div>
            ) : null}
          </>
        ) : null
      }
    />
  )
}