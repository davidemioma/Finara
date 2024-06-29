import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/settings')({
  component: () => <div>Hello /_authenticated/settings!</div>
})