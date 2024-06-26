import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-in')({
  component: () => <div>Hello /auth/sign-in!</div>
})